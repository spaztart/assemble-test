/**
 * Search engine: full-text search powered by MiniSearch.
 * Features:
 * - Instant search-as-you-type with debouncing
 * - Fuzzy matching and prefix search
 * - Categorized results (Getting Started, Design, Components)
 * - Highlighted excerpts showing matched terms
 * - Keyboard navigation (↑/↓/Enter/Esc)
 * - Recent searches with localStorage persistence
 * - Accessible ARIA attributes
 */
import MiniSearch from 'minisearch';

// --- Types ---
interface SearchDocument {
  id: number;
  title: string;
  description: string;
  content: string;
  headings: string;
  href: string;
  category: string;
  excerpt: string;
}

interface SearchResultItem {
  id: number;
  title: string;
  href: string;
  category: string;
  excerpt: string;
  score: number;
}

// --- Constants ---
const RECENT_SEARCHES_KEY = 'assemble_recent_searches';
const MAX_RECENT_SEARCHES = 5;
const MAX_RESULTS = 20;
const DEBOUNCE_MS = 120;

// --- State ---
let miniSearch: MiniSearch<SearchDocument> | null = null;
let documents: SearchDocument[] = [];
let selectedIndex = -1;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let indexLoaded = false;
let indexLoading = false;

// --- Index Loading ---

async function loadSearchIndex(): Promise<void> {
  if (indexLoaded || indexLoading) return;
  indexLoading = true;

  try {
    // Resolve base path from the favicon link
    const iconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    const base = iconLink
      ? iconLink.href.replace(/\/favicon\.ico$/, '').replace(window.location.origin, '')
      : '';

    const response = await fetch(`${base}/search-index.json`);
    if (!response.ok) throw new Error(`Failed to load search index: ${response.status}`);

    documents = await response.json();

    miniSearch = new MiniSearch<SearchDocument>({
      fields: ['title', 'description', 'content', 'headings'],
      storeFields: ['title', 'href', 'category', 'excerpt'],
      searchOptions: {
        boost: { title: 4, headings: 2, description: 1.5, content: 1 },
        fuzzy: 0.2,
        prefix: true,
      },
    });

    miniSearch.addAll(documents);
    indexLoaded = true;
  } catch (err) {
    console.error('[search] Failed to load index:', err);
  } finally {
    indexLoading = false;
  }
}

// --- Recent Searches ---

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string): void {
  if (!term.trim()) return;
  let searches = getRecentSearches();
  searches = searches.filter(s => s.toLowerCase() !== term.toLowerCase());
  searches.unshift(term);
  searches = searches.slice(0, MAX_RECENT_SEARCHES);
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch {}
}

function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {}
}

// --- Search Logic ---

function executeSearch(query: string): SearchResultItem[] {
  if (!miniSearch || !query.trim()) return [];

  const results = miniSearch.search(query, {
    boost: { title: 4, headings: 2, description: 1.5, content: 1 },
    fuzzy: 0.2,
    prefix: true,
    combineWith: 'OR',
  });

  return results.slice(0, MAX_RESULTS).map(r => ({
    id: r.id,
    title: r.title,
    href: r.href,
    category: r.category,
    excerpt: r.excerpt,
    score: r.score,
  }));
}

// --- Highlight ---

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlightText(text: string, query: string): string {
  if (!query.trim() || !text) return escapeHtml(text);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(t => t.length > 1);
  if (terms.length === 0) return escapeHtml(text);

  const escaped = escapeHtml(text);
  const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');

  return escaped.replace(regex, '<mark>$1</mark>');
}

/**
 * Build an excerpt contextual to the search query.
 * Finds the first occurrence of a search term in content and shows surrounding text.
 */
function getContextualExcerpt(docId: number, query: string): string {
  const doc = documents.find(d => d.id === docId);
  if (!doc) return '';

  const terms = query.trim().toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const content = doc.content;

  if (terms.length === 0) return doc.excerpt;

  // Find first match position in content
  const lowerContent = content.toLowerCase();
  let matchPos = -1;
  for (const term of terms) {
    const pos = lowerContent.indexOf(term);
    if (pos !== -1 && (matchPos === -1 || pos < matchPos)) {
      matchPos = pos;
    }
  }

  if (matchPos === -1) return doc.excerpt;

  // Extract surrounding context
  const start = Math.max(0, matchPos - 50);
  const end = Math.min(content.length, matchPos + 150);
  let excerpt = content.slice(start, end).replace(/\n/g, ' ').trim();

  if (start > 0) excerpt = '\u2026' + excerpt;
  if (end < content.length) excerpt = excerpt + '\u2026';

  return excerpt;
}

// --- UI Rendering ---

function renderRecentSearches(): void {
  const recentSection = document.getElementById('search-recent');
  const listEl = document.getElementById('search-recent-list');
  const resultsEl = document.getElementById('search-results');
  const emptyEl = document.getElementById('search-empty');

  if (resultsEl) resultsEl.style.display = 'none';
  if (emptyEl) emptyEl.style.display = 'none';

  if (!listEl || !recentSection) return;

  const searches = getRecentSearches();

  if (searches.length === 0) {
    recentSection.style.display = 'none';
    return;
  }

  recentSection.style.display = 'block';
  listEl.innerHTML = searches.map((term, index) => `
    <li class="search-recent-item" data-index="${index}" data-term="${escapeHtml(term)}" role="option" aria-selected="false">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span>${escapeHtml(term)}</span>
    </li>
  `).join('');
}

function renderResults(results: SearchResultItem[], query: string): void {
  const recentSection = document.getElementById('search-recent');
  const resultsEl = document.getElementById('search-results');
  const emptyEl = document.getElementById('search-empty');

  if (recentSection) recentSection.style.display = 'none';

  if (!resultsEl || !emptyEl) return;

  if (results.length === 0) {
    resultsEl.style.display = 'none';
    emptyEl.style.display = 'block';
    emptyEl.innerHTML = `
      <div class="search-empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
          <path d="M8 11h6" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="search-empty-title">No results for "${escapeHtml(query)}"</p>
      <p class="search-empty-hint">Try different keywords or check your spelling</p>
    `;
    return;
  }

  emptyEl.style.display = 'none';
  resultsEl.style.display = 'flex';

  // Group results by category
  const grouped = new Map<string, SearchResultItem[]>();
  for (const result of results) {
    const cat = result.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(result);
  }

  let html = '';
  let globalIndex = 0;

  for (const [category, items] of grouped) {
    html += `<div class="search-result-group">
      <div class="search-section-label">${escapeHtml(category)}</div>`;

    for (const item of items) {
      const excerpt = getContextualExcerpt(item.id, query);
      html += `
        <a class="search-result-item" href="${escapeHtml(item.href)}" data-index="${globalIndex}" role="option" aria-selected="false">
          <div class="search-result-title">${highlightText(item.title, query)}</div>
          <div class="search-result-excerpt">${highlightText(excerpt, query)}</div>
        </a>`;
      globalIndex++;
    }
    html += '</div>';
  }

  resultsEl.innerHTML = html;
}

function updateSelection(): void {
  const items = document.querySelectorAll<HTMLElement>('.search-recent-item, .search-result-item');
  items.forEach((item, index) => {
    const isSelected = index === selectedIndex;
    item.classList.toggle('selected', isSelected);
    item.setAttribute('aria-selected', String(isSelected));
    if (isSelected) {
      item.scrollIntoView({ block: 'nearest' });
    }
  });
}

// --- Overlay Control ---

export function openSearchOverlay(): void {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-overlay-input') as HTMLInputElement | null;

  if (!overlay) return;

  overlay.classList.add('active');
  overlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';

  selectedIndex = -1;
  renderRecentSearches();

  // Lazy-load the search index on first open
  loadSearchIndex();

  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 50);
  }
}

export function closeSearchOverlay(): void {
  const overlay = document.getElementById('search-overlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  selectedIndex = -1;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

function navigateToResult(item: HTMLElement): void {
  const href = item.getAttribute('href') || item.dataset.href;
  const term = item.dataset.term;

  if (term) {
    // Recent search item — re-run the search
    const input = document.getElementById('search-overlay-input') as HTMLInputElement | null;
    if (input) {
      input.value = term;
      handleSearchInput(term);
    }
    return;
  }

  if (href) {
    saveRecentSearch(
      (document.getElementById('search-overlay-input') as HTMLInputElement)?.value || ''
    );
    closeSearchOverlay();
    window.location.href = href;
  }
}

// --- Input Handler ---

function handleSearchInput(query: string): void {
  if (debounceTimer) clearTimeout(debounceTimer);

  if (!query.trim()) {
    selectedIndex = -1;
    renderRecentSearches();
    return;
  }

  debounceTimer = setTimeout(() => {
    const results = executeSearch(query);
    selectedIndex = -1;
    renderResults(results, query);
  }, DEBOUNCE_MS);
}

// --- Event Listeners ---

// Input event for live search
document.addEventListener('input', (e) => {
  const target = e.target as HTMLElement;
  if (target.id === 'search-overlay-input') {
    const query = (target as HTMLInputElement).value;
    handleSearchInput(query);
  }
});

// Click handlers
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  // Close on backdrop click
  if (
    target.classList.contains('search-overlay-backdrop') ||
    target.classList.contains('search-overlay-container')
  ) {
    closeSearchOverlay();
    return;
  }

  // Navigate on result click
  const resultItem = target.closest('.search-result-item') as HTMLElement | null;
  if (resultItem) {
    e.preventDefault();
    const input = document.getElementById('search-overlay-input') as HTMLInputElement | null;
    if (input?.value) saveRecentSearch(input.value);
    closeSearchOverlay();
    const href = resultItem.getAttribute('href');
    if (href) window.location.href = href;
    return;
  }

  // Populate from recent search click
  const recentItem = target.closest('.search-recent-item') as HTMLElement | null;
  if (recentItem) {
    const term = recentItem.dataset.term;
    if (term) {
      const input = document.getElementById('search-overlay-input') as HTMLInputElement | null;
      if (input) {
        input.value = term;
        input.focus();
        handleSearchInput(term);
      }
    }
    return;
  }

  // Clear recent searches
  if (target.closest('.search-clear-recent')) {
    clearRecentSearches();
    renderRecentSearches();
    return;
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('search-overlay');
  const isOpen = overlay?.classList.contains('active');

  // Cmd/Ctrl+K to toggle
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (isOpen) {
      closeSearchOverlay();
    } else {
      openSearchOverlay();
    }
    return;
  }

  if (!isOpen) return;

  // Escape to close
  if (e.key === 'Escape') {
    e.preventDefault();
    closeSearchOverlay();
    return;
  }

  const items = document.querySelectorAll<HTMLElement>('.search-recent-item, .search-result-item');
  const itemCount = items.length;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (itemCount > 0) {
      selectedIndex = selectedIndex < itemCount - 1 ? selectedIndex + 1 : 0;
      updateSelection();
    }
    return;
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (itemCount > 0) {
      selectedIndex = selectedIndex <= 0 ? itemCount - 1 : selectedIndex - 1;
      updateSelection();
    }
    return;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    if (selectedIndex >= 0 && items[selectedIndex]) {
      navigateToResult(items[selectedIndex]);
    } else {
      // If nothing selected but input has a value, select first result
      const input = document.getElementById('search-overlay-input') as HTMLInputElement | null;
      if (input?.value && items.length > 0) {
        navigateToResult(items[0]);
      }
    }
    return;
  }
});
