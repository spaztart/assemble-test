/**
 * Docs page initialization: section wrapping, TOC generation, sidebar,
 * install tabs, animations, and View Transition lifecycle.
 */
import { addCodeCopyButtons, createCodeTabs } from './code-blocks';
import { setupCopyButton } from './markdown-copy';

declare const Prism: { highlightAll: () => void } | undefined;

// ===================================
// Mobile Sidebar
// ===================================

const mobileOverlay = document.getElementById('mobileOverlay');

function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.mobile-sidebar-toggle') as HTMLElement;
  if (sidebar && toggleBtn) {
    sidebar.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close sidebar navigation');
    mobileOverlay?.classList.add('active');
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.mobile-sidebar-toggle') as HTMLElement;
  if (sidebar) sidebar.classList.remove('open');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open sidebar navigation');
  }
  mobileOverlay?.classList.remove('active');
}

document.addEventListener('click', function(e) {
  const target = e.target as HTMLElement;

  if (target.closest('.mobile-sidebar-toggle')) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
    return;
  }

  if (target.closest('.close-sidebar')) {
    closeMobileSidebar();
    return;
  }

  if (target.id === 'mobileOverlay') {
    closeMobileSidebar();
    return;
  }

  if (target.closest('.mobile-search-btn')) {
    return;
  }
});

// ===================================
// Sidebar Group Collapse/Expand
// ===================================

function saveSidebarState() {
  const state: boolean[] = [];
  document.querySelectorAll('.sidebar-group').forEach(group => {
    state.push(group.classList.contains('collapsed'));
  });
  sessionStorage.setItem('sidebar-collapsed', JSON.stringify(state));
}

function restoreSidebarState() {
  try {
    const state: boolean[] = JSON.parse(sessionStorage.getItem('sidebar-collapsed') || '[]');
    document.querySelectorAll('.sidebar-group').forEach((group, i) => {
      if (state[i]) {
        group.classList.add('collapsed');
        const label = group.querySelector('.sidebar-group-label');
        if (label) label.setAttribute('aria-expanded', 'false');
      }
    });
  } catch {}
}

function saveSidebarScroll() {
  const sb = document.getElementById('sidebar');
  if (sb) sessionStorage.setItem('sidebar-scroll', String(sb.scrollTop));
}

function restoreSidebarScroll() {
  const sb = document.getElementById('sidebar');
  const val = sessionStorage.getItem('sidebar-scroll');
  if (sb && val) sb.scrollTop = parseInt(val, 10);
}

// Restore state immediately
restoreSidebarState();
restoreSidebarScroll();

function initSidebarInteractions() {
  const sb = document.getElementById('sidebar');
  if (sb) {
    sb.addEventListener('click', (e) => {
      const label = (e.target as HTMLElement).closest('.sidebar-group-label');
      if (!label) return;
      const group = label.closest('.sidebar-group');
      if (group) {
        const isCollapsed = group.classList.toggle('collapsed');
        label.setAttribute('aria-expanded', String(!isCollapsed));
        saveSidebarState();
      }
    });

    sb.addEventListener('scroll', saveSidebarScroll, { passive: true });
  }
}

initSidebarInteractions();

// Save scroll before Astro swaps the page
document.addEventListener('astro:before-swap', saveSidebarScroll);

// ===================================
// Table of Contents
// ===================================

function generateTOC() {
  const tocNav = document.getElementById('tocNav');
  const tocDropdownMenu = document.getElementById('tocDropdownMenu');
  const headings = document.querySelectorAll('.markdown-content h2');

  if (headings.length === 0) return;

  if (tocNav) tocNav.innerHTML = '';
  if (tocDropdownMenu) tocDropdownMenu.innerHTML = '';

  headings.forEach(heading => {
    if (tocNav) {
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.className = `toc-link toc-link-h2`;
      tocNav.appendChild(link);
    }
    if (tocDropdownMenu) {
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.className = `toc-link toc-link-h2`;
      tocDropdownMenu.appendChild(link);
    }
  });
}

function setupTocDropdown() {
  const toggleBtn = document.getElementById('tocToggleBtn');
  const menu = document.getElementById('tocDropdownMenu');
  const backdrop = document.getElementById('tocDropdownBackdrop');
  if (!toggleBtn || !menu || !backdrop) return;

  function positionMenu() {
    const rect = toggleBtn!.getBoundingClientRect();
    menu!.style.top = `${rect.bottom + 4}px`;
    menu!.style.right = `${window.innerWidth - rect.right}px`;
  }

  function closeTocDropdown() {
    menu!.classList.remove('open');
    backdrop!.classList.remove('open');
    menu!.style.top = '';
    menu!.style.right = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeTocDropdown();
    } else {
      positionMenu();
      menu.classList.add('open');
      backdrop.classList.add('open');
    }
  });

  backdrop.addEventListener('click', closeTocDropdown);

  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).tagName === 'A') {
      closeTocDropdown();
    }
  });
}

// ===================================
// Navigation helper
// ===================================

function navigateTo(href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ===================================
// Section wrapping + page actions
// ===================================

function wrapSections() {
  const content = document.querySelector('.markdown-content');
  if (!content) return;

  const children = Array.from(content.children);
  let currentSection: HTMLElement | null = null;
  let currentSubSection: HTMLElement | null = null;
  let headerSection: HTMLElement | null = null;
  let isInHeader = true;

  children.forEach((child) => {
    const tagName = child.tagName.toLowerCase();

    if (tagName === 'h1' && isInHeader) {
      headerSection = document.createElement('section');
      headerSection.className = 'page-header';
      content.insertBefore(headerSection, child);

      const titleRow = document.createElement('div');
      titleRow.className = 'title-row';
      titleRow.appendChild(child);

      const pageActions = document.createElement('div');
      pageActions.className = 'page-actions';
      pageActions.id = 'pageActions';

      const prevHref = (content as HTMLElement).dataset.prevHref;
      const prevLabel = (content as HTMLElement).dataset.prevLabel;
      const nextHref = (content as HTMLElement).dataset.nextHref;
      const nextLabel = (content as HTMLElement).dataset.nextLabel;

      pageActions.innerHTML = `
        <asm-split-button class="copy-btn" id="copyPageBtn" label="Copy" start-icon="content_copy" variant="outline" size="compact">
          <asm-menu density="compact">
            <asm-menu-item id="copyMarkdownBtn" label="Copy Markdown" start-icon="content_copy"></asm-menu-item>
            <asm-menu-item id="openMarkdownBtn" label="Open Markdown" start-icon="open_in_new"></asm-menu-item>
          </asm-menu>
        </asm-split-button>
        ${prevHref ? `<asm-tooltip message="Previous: ${prevLabel}"><asm-icon-button id="prevPageBtn" icon="keyboard_arrow_left" variant="outline" size="compact" label="Previous: ${prevLabel}"></asm-icon-button></asm-tooltip>` : ''}
        ${nextHref ? `<asm-tooltip message="Next: ${nextLabel}"><asm-icon-button id="nextPageBtn" icon="keyboard_arrow_right" variant="outline" size="compact" label="Next: ${nextLabel}"></asm-icon-button></asm-tooltip>` : ''}
        <asm-tooltip message="On this page"><asm-icon-button class="toc-btn" id="tocToggleBtn" icon="toc" variant="outline" size="compact" label="On this page"></asm-icon-button></asm-tooltip>
      `;

      const prevBtn = pageActions.querySelector('#prevPageBtn');
      if (prevBtn && prevHref) {
        prevBtn.addEventListener('click', () => navigateTo(prevHref));
      }
      const nextBtn = pageActions.querySelector('#nextPageBtn');
      if (nextBtn && nextHref) {
        nextBtn.addEventListener('click', () => navigateTo(nextHref));
      }

      titleRow.appendChild(pageActions);
      headerSection.appendChild(titleRow);
      return;
    }

    if (isInHeader && tagName !== 'h2' && headerSection) {
      headerSection.appendChild(child);
      return;
    }

    if (tagName === 'h2') {
      isInHeader = false;
      currentSubSection = null;
      currentSection = document.createElement('section');
      currentSection.className = 'page-section';
      content.insertBefore(currentSection, child);
      currentSubSection = document.createElement('div');
      currentSubSection.className = 'page-subsection';
      currentSection.appendChild(currentSubSection);
      currentSubSection.appendChild(child);
      return;
    }

    if (tagName === 'h3' && currentSection) {
      currentSubSection = document.createElement('div');
      currentSubSection.className = 'page-subsection';
      currentSection.appendChild(currentSubSection);
      currentSubSection.appendChild(child);
      return;
    }

    if (currentSection && !isInHeader && currentSubSection) {
      currentSubSection.appendChild(child);
    }
  });

  // If page has tabs, convert page-sections into a tabbed UI
  const resolvedHeader = headerSection as HTMLElement | null;
  if ((content as HTMLElement).dataset.tabs === 'true' && resolvedHeader) {
    const sections = content.querySelectorAll('.page-section');
    if (sections.length > 0) {
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'page-tabs';

      const tabBar = document.createElement('div');
      tabBar.className = 'page-tabs-bar';
      tabBar.setAttribute('role', 'tablist');

      const panelsContainer = document.createElement('div');
      panelsContainer.className = 'page-tabs-panels';

      sections.forEach((section, i) => {
        const h2 = section.querySelector('h2');
        const label = h2 ? h2.textContent || `Tab ${i + 1}` : `Tab ${i + 1}`;

        const btn = document.createElement('button');
        btn.className = 'page-tab-btn';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.dataset.index = String(i);
        btn.textContent = label;
        tabBar.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'page-tab-panel';
        panel.setAttribute('role', 'tabpanel');
        panel.style.display = i === 0 ? 'block' : 'none';
        if (h2) h2.remove();
        panel.appendChild(section);
        panelsContainer.appendChild(panel);
      });

      tabBar.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest('.page-tab-btn') as HTMLElement;
        if (!btn) return;
        const idx = parseInt(btn.dataset.index || '0');
        tabBar.querySelectorAll('.page-tab-btn').forEach(b => b.setAttribute('aria-selected', 'false'));
        btn.setAttribute('aria-selected', 'true');
        panelsContainer.querySelectorAll('.page-tab-panel').forEach((p, j) => {
          (p as HTMLElement).style.display = j === idx ? 'block' : 'none';
        });
      });

      tabBar.addEventListener('keydown', (e) => {
        const btns = [...tabBar.querySelectorAll('.page-tab-btn')] as HTMLElement[];
        const current = btns.findIndex(b => b === document.activeElement);
        let next = current;
        if (e.key === 'ArrowRight') next = (current + 1) % btns.length;
        else if (e.key === 'ArrowLeft') next = (current - 1 + btns.length) % btns.length;
        else return;
        e.preventDefault();
        btns[next].focus();
        btns[next].click();
      });

      tabsContainer.appendChild(tabBar);
      resolvedHeader.appendChild(tabsContainer);
      content.appendChild(panelsContainer);
    }
  }
}

// ===================================
// Install tabs
// ===================================

function setupInstallTabs() {
  const tabGroup = document.getElementById('installTabs');
  if (!tabGroup) return;
  const panels = document.querySelectorAll('.install-panel');
  tabGroup.addEventListener('tab-change', (e: any) => {
    const idx = e.detail?.index ?? 0;
    panels.forEach((p, i) => p.classList.toggle('active', i === idx));
  });
}

// ===================================
// Widgetbook button
// ===================================

function setupWidgetbookButton() {
  if (!window.location.pathname.includes('/components/')) return;
  const heroPreview = document.querySelector('.hero-preview');
  if (!heroPreview) return;
  (heroPreview as HTMLElement).style.position = 'relative';
  const wrapper = document.createElement('div');
  wrapper.className = 'widgetbook-btn';
  wrapper.innerHTML = `<img src="/flutter-logo.svg" width="16" height="16" alt="Flutter"><asm-button label="Open in Flutter" variant="tonal" size="compact"></asm-button>`;
  heroPreview.appendChild(wrapper);
}

// ===================================
// Entrance animations
// ===================================

function playEntranceAnimations() {
  const prev = (window as any).__previousPath || '';
  const fromDocs = prev !== '' && prev !== '/' && !prev.startsWith('/blocks') && !prev.startsWith('/developers');

  if (!fromDocs) {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach((link, i) => {
      link.classList.remove('animate-in');
      void (link as HTMLElement).offsetWidth;
      (link as HTMLElement).style.animationDelay = `${i * 30}ms`;
      link.classList.add('animate-in');
    });

    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach((link, i) => {
      link.classList.remove('animate-in');
      void (link as HTMLElement).offsetWidth;
      (link as HTMLElement).style.animationDelay = `${80 + i * 25}ms`;
      link.classList.add('animate-in');
    });
  }

  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.classList.remove('animate-in');
    void (mainContent as HTMLElement).offsetWidth;
    (mainContent as HTMLElement).style.animationDelay = fromDocs ? '0ms' : '60ms';
    mainContent.classList.add('animate-in');
  }
}

// ===================================
// Page init orchestrator
// ===================================

function initDocsPage() {
  wrapSections();
  setupWidgetbookButton();
  generateTOC();
  addCodeCopyButtons();
  createCodeTabs();
  setupCopyButton();
  setupInstallTabs();
  setupTocDropdown();
  playEntranceAnimations();

  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
}

// Run immediately + on View Transition navigations
initDocsPage();
document.addEventListener('astro:page-load', () => {
  if ((window as any).__docsInitialized) {
    initDocsPage();
    restoreSidebarState();
    restoreSidebarScroll();
    initSidebarInteractions();
  }
  (window as any).__docsInitialized = true;
});
