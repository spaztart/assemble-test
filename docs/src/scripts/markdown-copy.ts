/**
 * HTML-to-Markdown converter and page copy/open functionality.
 */
import { showCopiedSnackbar } from './utils';

function htmlToMarkdown(container: HTMLElement): string {
  const lines: string[] = [];

  function processNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) lines.push(text.trim());
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;

    // Skip non-content elements
    if (el.closest('.code-block-wrapper') && !el.classList.contains('code-block-wrapper')) return;
    if (el.closest('.preview-card') && !el.classList.contains('preview-card')) return;
    if (el.closest('.install-panel--flutter')) return;
    if (el.classList.contains('hero-preview') || el.classList.contains('toc-nav') ||
        el.classList.contains('widgetbook-btn') || el.classList.contains('page-nav') ||
        el.classList.contains('copy-page-toolbar') || el.tagName === 'ASM-TAB-GROUP') return;

    const tag = el.tagName.toLowerCase();

    // Headings
    if (/^h[1-6]$/.test(tag)) {
      const level = parseInt(tag[1]);
      lines.push('', '#'.repeat(level) + ' ' + (el.textContent || '').trim(), '');
      return;
    }

    // Preview card — extract web code block only
    if (el.classList.contains('preview-card')) {
      const webCode = el.querySelector('.code-panel-web code');
      if (webCode) {
        const lang = (webCode.className.match(/language-(\w+)/) || [])[1] || '';
        lines.push('', '```' + lang, (webCode.textContent || '').trim(), '```', '');
      }
      return;
    }

    // Code blocks (standalone, not in preview-card)
    if (tag === 'pre' && !el.closest('.preview-card') && !el.closest('.stepper')) {
      const code = el.querySelector('code');
      if (code) {
        const lang = (code.className.match(/language-(\w+)/) || [])[1] || '';
        lines.push('', '```' + lang, (code.textContent || '').trim(), '```', '');
      }
      return;
    }

    // Install steps (web panel only)
    if (el.classList.contains('install-panel--web')) {
      const steps = el.querySelectorAll('.stepper__step');
      lines.push('');
      steps.forEach((step, i) => {
        const title = step.querySelector('.stepper__title')?.textContent?.trim() || '';
        const code = step.querySelector('code');
        lines.push(`${i + 1}. **${title}**`);
        if (code) {
          const lang = (code.className.match(/language-(\w+)/) || [])[1] || '';
          lines.push('   ```' + lang, '   ' + (code.textContent || '').trim(), '   ```');
        }
      });
      lines.push('');
      return;
    }

    // Tables
    if (tag === 'table') {
      const rows = el.querySelectorAll('tr');
      rows.forEach((row, i) => {
        const cells = Array.from(row.querySelectorAll('th, td')).map(c => (c.textContent || '').trim());
        lines.push('| ' + cells.join(' | ') + ' |');
        if (i === 0) lines.push('|' + cells.map(() => '---').join('|') + '|');
      });
      lines.push('');
      return;
    }

    // Lists
    if (tag === 'ul' || tag === 'ol') {
      lines.push('');
      const items = el.querySelectorAll(':scope > li');
      items.forEach((li, i) => {
        const prefix = tag === 'ul' ? '- ' : `${i + 1}. `;
        lines.push(prefix + (li.textContent || '').trim());
      });
      lines.push('');
      return;
    }

    // Paragraphs
    if (tag === 'p' && !el.closest('.stepper') && !el.closest('.install-panel')) {
      const text = (el.textContent || '').trim();
      if (text) lines.push('', text, '');
      return;
    }

    // Sections / divs — recurse into children
    if (tag === 'div' || tag === 'section' || tag === 'article' || tag === 'main') {
      Array.from(el.childNodes).forEach(processNode);
      return;
    }
  }

  Array.from(container.childNodes).forEach(processNode);

  // Clean up: collapse multiple blank lines into one
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function getMarkdownText(): string {
  const rawEl = document.getElementById('rawMarkdownSource');
  if (rawEl?.textContent) return rawEl.textContent;
  const content = document.getElementById('markdownContent');
  if (content) return htmlToMarkdown(content);
  return '';
}

export function setupCopyButton() {
  const splitBtn = document.getElementById('copyPageBtn') as any;
  if (splitBtn) {
    splitBtn.addEventListener('action', async () => {
      const text = getMarkdownText();
      await navigator.clipboard.writeText(text);
      showCopiedSnackbar();
      splitBtn.setAttribute('start-icon', 'check');
      setTimeout(() => {
        splitBtn.setAttribute('start-icon', 'content_copy');
      }, 2000);
    });

    const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');
    copyMarkdownBtn?.addEventListener('click', async () => {
      const text = getMarkdownText();
      await navigator.clipboard.writeText(text);
      showCopiedSnackbar();
      splitBtn.setAttribute('start-icon', 'check');
      splitBtn.open = false;
      setTimeout(() => {
        splitBtn.setAttribute('start-icon', 'content_copy');
      }, 2000);
    });

    const openMarkdownBtn = document.getElementById('openMarkdownBtn');
    openMarkdownBtn?.addEventListener('click', () => {
      const text = getMarkdownText();
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      splitBtn.open = false;
    });
  }
}
