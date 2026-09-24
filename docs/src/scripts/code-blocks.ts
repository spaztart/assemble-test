/**
 * Code block interactions: toggle, tab switching, copy, and platform-based tabs.
 * Global window functions are used by onclick handlers in component doc pages.
 */
import { showCopiedSnackbar } from './utils';

// ===================================
// Global handlers (used by inline onclick in component previews)
// ===================================

(window as any).toggleCode = function(el: HTMLElement) {
  const wrapper = el.closest('.code-block-wrapper') as HTMLElement;
  if (!wrapper) return;
  wrapper.classList.toggle('collapsed');
};

(window as any).switchCodeTab = function(btn: HTMLElement, lang: string) {
  const wrapper = btn.closest('.code-block-wrapper');
  if (!wrapper) return;
  wrapper.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  wrapper.querySelectorAll('.code-block-inner').forEach(p => p.classList.remove('active'));
  wrapper.querySelector('.code-panel-' + lang)?.classList.add('active');
};

(window as any).copyActiveCode = async function(btn: HTMLElement) {
  const wrapper = btn.closest('.code-block-wrapper');
  if (!wrapper) return;
  const activePanel = wrapper.querySelector('.code-block-inner.active');
  const code = activePanel?.querySelector('code');
  if (code) {
    await navigator.clipboard.writeText(code.textContent || '');
    showCopiedSnackbar();
    const span = btn.querySelector('span');
    if (span) {
      span.textContent = 'Copied!';
      setTimeout(() => { span.textContent = 'Copy'; }, 2000);
    }
  }
};

// ===================================
// Add copy buttons to standalone code blocks
// ===================================

export function addCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll('.markdown-content pre');

  codeBlocks.forEach((pre) => {
    if (pre.querySelector('.code-copy-btn')) return;
    if (pre.closest('.code-block-wrapper')) return;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copy</span>
    `;

    copyBtn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      if (code) {
        await navigator.clipboard.writeText(code.textContent || '');
        showCopiedSnackbar();
        const span = copyBtn.querySelector('span');
        if (span) {
          span.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            span.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        }
      }
    });

    pre.appendChild(copyBtn);
  });
}

// ===================================
// Convert consecutive @platform code blocks into tabs
// ===================================

export function createCodeTabs() {
  const content = document.querySelector('.markdown-content');
  if (!content) return;

  const allPres = Array.from(content.querySelectorAll('pre'));
  let i = 0;

  while (i < allPres.length) {
    const pre = allPres[i];
    const code = pre.querySelector('code');

    const codeText = code?.textContent || '';
    const platformMatch = codeText.match(/^\/\/\s*@platform:\s*(.+)$/m) ||
                         codeText.match(/^#\s*@platform:\s*(.+)$/m) ||
                         codeText.match(/^<!--\s*@platform:\s*(.+)\s*-->$/m);

    if (platformMatch) {
      const tabs: { platform: string; pre: Element; code: string }[] = [];
      let j = i;

      while (j < allPres.length) {
        const currentPre = allPres[j];
        const currentCode = currentPre.querySelector('code');
        const currentText = currentCode?.textContent || '';
        const match = currentText.match(/^\/\/\s*@platform:\s*(.+)$/m) ||
                     currentText.match(/^#\s*@platform:\s*(.+)$/m) ||
                     currentText.match(/^<!--\s*@platform:\s*(.+)\s*-->$/m);

        if (match) {
          const cleanCode = currentText.replace(/^(\/\/|#|<!--)\s*@platform:\s*.+\s*(-->)?\n?/m, '');
          if (currentCode) currentCode.textContent = cleanCode;

          tabs.push({
            platform: match[1].trim(),
            pre: currentPre,
            code: cleanCode
          });
          j++;
        } else {
          break;
        }
      }

      if (tabs.length > 1) {
        const tabContainer = document.createElement('div');
        tabContainer.className = 'code-tabs';

        const tabHeader = document.createElement('div');
        tabHeader.className = 'code-tabs-header';

        tabs.forEach((tab, index) => {
          const tabBtn = document.createElement('button');
          tabBtn.className = `code-tab-btn ${index === 0 ? 'active' : ''}`;
          tabBtn.textContent = tab.platform;
          tabBtn.dataset.tab = index.toString();
          tabBtn.addEventListener('click', () => {
            tabHeader.querySelectorAll('.code-tab-btn').forEach(btn => btn.classList.remove('active'));
            tabBtn.classList.add('active');
            tabContainer.querySelectorAll('.code-tab-content').forEach(c => c.classList.remove('active'));
            tabContainer.querySelector(`[data-content="${index}"]`)?.classList.add('active');
          });
          tabHeader.appendChild(tabBtn);
        });

        tabContainer.appendChild(tabHeader);

        tabs[0].pre.parentNode?.insertBefore(tabContainer, tabs[0].pre);

        tabs.forEach((tab, index) => {
          const contentDiv = document.createElement('div');
          contentDiv.className = `code-tab-content ${index === 0 ? 'active' : ''}`;
          contentDiv.dataset.content = index.toString();
          contentDiv.appendChild(tab.pre);
          tabContainer.appendChild(contentDiv);
        });

        i = j;
        continue;
      }
    }
    i++;
  }
}
