#!/usr/bin/env node
/**
 * Standalone script to regenerate public/search-index.json.
 * Run: node src/integrations/generate-search-index.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PAGES_DIR = join(__dirname, '../pages');
const OUTPUT_PATH = join(__dirname, '../../public/search-index.json');

function stripMarkdown(content) {
  return content
    .replace(/^---[\s\S]*?---\n?/, '')
    .replace(/^import\s+.*$/gm, '')
    .replace(/<[A-Z][^>]*\/>/g, '')
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '')
    .replace(/<[a-z][^>]*\/>/g, '')
    .replace(/<[a-z][^>]*>[\s\S]*?<\/[a-z][^>]*>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/^---+$/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      fm[key] = value;
    }
  }
  return fm;
}

function extractHeadings(content) {
  const headings = [];
  const regex = /^##\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    headings.push(match[1].trim());
  }
  return headings;
}

function getCategory(filePath) {
  if (filePath.includes('/components/')) return 'Components';
  const gettingStarted = ['introduction', 'releases', 'installation', 'design-resources', 'skills', 'theming', 'getting-started'];
  const design = ['color', 'typography', 'states', 'icons', 'tokens'];
  const name = basename(filePath, extname(filePath));
  if (gettingStarted.includes(name)) return 'Getting Started';
  if (design.includes(name)) return 'Design';
  return 'Docs';
}

async function collectFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(fullPath, files);
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  const files = await collectFiles(PAGES_DIR);
  const documents = [];
  let id = 0;

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    const plainText = stripMarkdown(content);
    const headings = extractHeadings(content);

    const relPath = relative(PAGES_DIR, filePath);
    let slug = relPath.replace(/\.mdx?$/, '').replace(/\/index$/, '');
    if (!slug) slug = '';

    const href = slug ? `/${slug}` : '/';
    const name = basename(filePath, extname(filePath));
    const title = frontmatter.title
      ? frontmatter.title.replace(/\s*-\s*Design System\s*$/, '')
      : name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const description = frontmatter.description || '';
    const category = getCategory(filePath);
    const excerpt = plainText.slice(0, 200).replace(/\n/g, ' ').trim();

    documents.push({
      id: id++,
      title,
      description,
      content: plainText,
      headings: headings.join(' '),
      href,
      category,
      excerpt,
    });
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(documents));
  console.log(`[search-index] Generated ${documents.length} documents → public/search-index.json`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
