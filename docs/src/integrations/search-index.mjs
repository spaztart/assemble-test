/**
 * Astro integration: generates a search index JSON file at build time.
 * Reads all .md and .mdx pages, extracts frontmatter + content, and writes
 * a compact JSON index to the public output directory.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, relative, basename, extname } from 'node:path';
import { existsSync } from 'node:fs';

const PAGES_DIR = new URL('../pages/', import.meta.url).pathname;

/**
 * Strip markdown/MDX syntax to plain text for indexing.
 */
function stripMarkdown(content) {
  return content
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n?/, '')
    // Remove import statements
    .replace(/^import\s+.*$/gm, '')
    // Remove JSX/HTML component tags (self-closing and paired)
    .replace(/<[A-Z][^>]*\/>/g, '')
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '')
    .replace(/<[a-z][^>]*\/>/g, '')
    .replace(/<[a-z][^>]*>[\s\S]*?<\/[a-z][^>]*>/g, ' ')
    // Remove inline HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove markdown images
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove blockquote markers
    .replace(/^>\s?/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Collapse whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Extract frontmatter from markdown content.
 */
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

/**
 * Extract h2 headings for section-level indexing.
 */
function extractHeadings(content) {
  const headings = [];
  const regex = /^##\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    headings.push(match[1].trim());
  }
  return headings;
}

/**
 * Determine the category based on file path.
 */
function getCategory(filePath) {
  if (filePath.includes('/components/')) return 'Components';
  const gettingStarted = ['introduction', 'releases', 'installation', 'design-resources', 'skills', 'theming', 'getting-started'];
  const design = ['color', 'typography', 'states', 'icons', 'tokens'];
  const name = basename(filePath, extname(filePath));
  if (gettingStarted.includes(name)) return 'Getting Started';
  if (design.includes(name)) return 'Design';
  return 'Docs';
}

/**
 * Recursively collect all .md and .mdx files.
 */
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

/**
 * Build the search index from all pages.
 */
async function buildSearchIndex(base = '') {
  const files = await collectFiles(PAGES_DIR);
  const documents = [];
  let id = 0;

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    const plainText = stripMarkdown(content);
    const headings = extractHeadings(content);

    // Build the URL path from file location
    const relPath = relative(PAGES_DIR, filePath);
    let slug = relPath
      .replace(/\.mdx?$/, '')
      .replace(/\/index$/, '');

    // Skip index pages that are astro files (they won't be in here)
    if (!slug) slug = '';

    const href = slug ? `${base}/${slug}` : `${base}/`;
    const name = basename(filePath, extname(filePath));

    // Use frontmatter title or generate one from filename
    const title = frontmatter.title
      ? frontmatter.title.replace(/\s*-\s*Design System\s*$/, '')
      : name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const description = frontmatter.description || '';
    const category = getCategory(filePath);

    // Create an excerpt (first ~200 chars of plain text)
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

  return documents;
}

/**
 * Astro integration hook.
 */
export default function searchIndexIntegration() {
  return {
    name: 'search-index',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = dir.pathname;
        const base = '';  // Will be set relative at runtime

        console.log('[search-index] Generating search index...');
        const documents = await buildSearchIndex('');
        const indexPath = join(outDir, 'search-index.json');
        await writeFile(indexPath, JSON.stringify(documents));
        console.log(`[search-index] Indexed ${documents.length} pages → search-index.json`);
      },
      'astro:server:setup': async () => {
        // Also generate for dev mode
        const documents = await buildSearchIndex('');
        const publicDir = new URL('../../public/', import.meta.url).pathname;
        const indexPath = join(publicDir, 'search-index.json');
        await writeFile(indexPath, JSON.stringify(documents));
        console.log(`[search-index] Dev: Indexed ${documents.length} pages → public/search-index.json`);
      },
    },
  };
}
