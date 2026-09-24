/**
 * Component inventory data.
 *
 * To update a component's status, change it here — the table on the
 * components page renders from this single source of truth.
 *
 * Status values: 'active' | 'in-progress' | 'not-available' | 'beta'
 */

export type ComponentStatus = 'active' | 'in-progress' | 'not-available' | 'beta';

export interface ComponentEntry {
  name: string;
  href?: string; // link to docs page (omit if no page exists)
  web: ComponentStatus;
  flutter: ComponentStatus;
}

export const components: ComponentEntry[] = [
  { name: 'Accordion', href: '/components/accordion', web: 'in-progress', flutter: 'active' },
  { name: 'Alert Banner', href: '/components/alert-banner', web: 'active', flutter: 'active' },
  { name: 'Alert Card', web: 'not-available', flutter: 'active' },
  { name: 'Badge', href: '/components/badge', web: 'in-progress', flutter: 'active' },
  { name: 'Brand', href: '/components/brand', web: 'active', flutter: 'active' },
  { name: 'Button', href: '/components/button', web: 'active', flutter: 'active' },
  { name: 'Card', href: '/components/card', web: 'active', flutter: 'active' },
  { name: 'Carousel', href: '/components/carousel-indicator', web: 'active', flutter: 'active' },
  { name: 'Calendar', href: '/components/calendar', web: 'active', flutter: 'active' },
  { name: 'Chat Bubble', href: '/components/chat-bubble', web: 'active', flutter: 'active' },
  { name: 'Checkbox', href: '/components/checkbox', web: 'in-progress', flutter: 'active' },
  { name: 'Credit Score', web: 'not-available', flutter: 'active' },
  { name: 'Date Input', href: '/components/date-input', web: 'active', flutter: 'active' },
  { name: 'Divider', href: '/components/divider', web: 'in-progress', flutter: 'active' },
  { name: 'Empty State', href: '/components/empty-state', web: 'in-progress', flutter: 'active' },
  { name: 'Feature Banner', web: 'not-available', flutter: 'active' },
  { name: 'Feedback', href: '/components/feedback', web: 'active', flutter: 'active' },
  { name: 'Guided Action Panel', web: 'not-available', flutter: 'active' },
  { name: 'Icon', href: '/components/icon', web: 'in-progress', flutter: 'active' },
  { name: 'Icon Button', href: '/components/icon-button', web: 'active', flutter: 'active' },
  { name: 'List Item', href: '/components/list-item', web: 'active', flutter: 'active' },
  { name: 'Loader', href: '/components/loader', web: 'active', flutter: 'active' },
  { name: 'Menu', href: '/components/menu', web: 'active', flutter: 'active' },
  { name: 'Modal', href: '/components/modal', web: 'active', flutter: 'active' },
  { name: 'Nav Drawer', href: '/components/nav-drawer', web: 'active', flutter: 'active' },
  { name: 'Navigation Rail', href: '/components/navigation-rail', web: 'active', flutter: 'active' },
  { name: 'Pagination', href: '/components/pagination', web: 'active', flutter: 'active' },
  { name: 'Peek Label', href: '/components/peek-label', web: 'active', flutter: 'active' },
  { name: 'Phone Input', href: '/components/phoneput', web: 'active', flutter: 'active' },
  { name: 'Progress Bar', href: '/components/progress-bar', web: 'active', flutter: 'active' },
  { name: 'Protection Score', web: 'not-available', flutter: 'active' },
  { name: 'Radio', href: '/components/radio', web: 'in-progress', flutter: 'active' },
  { name: 'Side Sheet', href: '/components/side-sheet', web: 'active', flutter: 'active' },
  { name: 'Skeleton Loader', href: '/components/skeleton-loader', web: 'in-progress', flutter: 'active' },
  { name: 'Snackbar', href: '/components/snackbar', web: 'in-progress', flutter: 'active' },
  { name: 'Split Button', href: '/components/split-button', web: 'in-progress', flutter: 'active' },
  { name: 'Status Indicator', href: '/components/status-indicator', web: 'in-progress', flutter: 'active' },
  { name: 'Status Notification', href: '/components/status-notification', web: 'in-progress', flutter: 'active' },
  { name: 'Switch', href: '/components/switch', web: 'in-progress', flutter: 'active' },
  { name: 'Table', href: '/components/table', web: 'in-progress', flutter: 'active' },
  { name: 'Tabs', href: '/components/tabs', web: 'active', flutter: 'active' },
  { name: 'Tag', href: '/components/tag', web: 'in-progress', flutter: 'active' },
  { name: 'Text Field', href: '/components/text-field', web: 'in-progress', flutter: 'active' },
  { name: 'Toggle Group', href: '/components/toggle-group', web: 'in-progress', flutter: 'active' },
  { name: 'Tooltip', href: '/components/tooltip', web: 'in-progress', flutter: 'active' },
  { name: 'Topbar', href: '/components/topbar', web: 'active', flutter: 'active' },
  { name: 'Wayfinder', web: 'not-available', flutter: 'active' },
];

/** Badge mapping — change these once and it applies everywhere. */
export const STATUS_CONFIG: Record<ComponentStatus, { label: string; status: string }> = {
  'active': { label: 'Active', status: 'low' },
  'in-progress': { label: 'In Progress', status: 'moderate' },
  'not-available': { label: 'Not Available', status: 'neutral' },
  'beta': { label: 'Beta', status: 'high' },
};
