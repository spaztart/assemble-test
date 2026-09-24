export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export function getNavGroups(base: string): NavGroup[] {
  return [
    {
      label: 'Getting Started',
      items: [
        { label: 'Introduction', href: `${base}/introduction` },
        { label: 'Releases', href: `${base}/releases` },
        { label: 'Installation', href: `${base}/installation` },
        { label: 'Design Resources', href: `${base}/design-resources` },
        { label: 'Skills', href: `${base}/skills` },
        { label: 'Theming', href: `${base}/theming` },
      ],
    },
    {
      label: 'Design',
      items: [
        { label: 'Color', href: `${base}/color` },
        { label: 'Typography', href: `${base}/typography` },
        { label: 'States', href: `${base}/states` },
        { label: 'Icons', href: `${base}/icons` },
        { label: 'Tokens', href: `${base}/tokens` },
      ],
    },
    {
      label: 'Components',
      items: [
        { label: 'Accordion', href: `${base}/components/accordion` },
        { label: 'Alert Banner', href: `${base}/components/alert-banner` },
        { label: 'Badge', href: `${base}/components/badge` },
        { label: 'Brand', href: `${base}/components/brand` },
        { label: 'Button', href: `${base}/components/button` },
        { label: 'Calendar', href: `${base}/components/calendar` },
        { label: 'Carousel Indicator', href: `${base}/components/carousel-indicator` },
        { label: 'Chat Bubble', href: `${base}/components/chat-bubble` },
        { label: 'Checkbox', href: `${base}/components/checkbox` },
        { label: 'Date Input', href: `${base}/components/date-input` },
        { label: 'Divider', href: `${base}/components/divider` },
        { label: 'Empty State', href: `${base}/components/empty-state` },
        { label: 'Feedback', href: `${base}/components/feedback` },
        { label: 'Icon', href: `${base}/components/icon` },
        { label: 'Icon Button', href: `${base}/components/icon-button` },
        { label: 'Loader', href: `${base}/components/loader` },
        { label: 'List Item', href: `${base}/components/list-item` },
        { label: 'Menu', href: `${base}/components/menu` },
        { label: 'Modal', href: `${base}/components/modal` },
        { label: 'Nav Drawer', href: `${base}/components/nav-drawer` },
        { label: 'Navigation Rail', href: `${base}/components/navigation-rail` },
        { label: 'Pagination', href: `${base}/components/pagination` },
        { label: 'Peek Label', href: `${base}/components/peek-label` },
        { label: 'Phone Input', href: `${base}/components/phoneput` },
        { label: 'Progress Bar', href: `${base}/components/progress-bar` },
        { label: 'Radio', href: `${base}/components/radio` },
        { label: 'Side Sheet', href: `${base}/components/side-sheet` },
        { label: 'Skeleton Loader', href: `${base}/components/skeleton-loader` },
        { label: 'Snackbar', href: `${base}/components/snackbar` },
        { label: 'Split Button', href: `${base}/components/split-button` },
        { label: 'Status Indicator', href: `${base}/components/status-indicator` },
        { label: 'Status Notification', href: `${base}/components/status-notification` },
        { label: 'Switch', href: `${base}/components/switch` },
        { label: 'Table', href: `${base}/components/table` },
        { label: 'Tabs', href: `${base}/components/tabs` },
        { label: 'Tag', href: `${base}/components/tag` },
        { label: 'Text Field', href: `${base}/components/text-field` },
        { label: 'Toggle Group', href: `${base}/components/toggle-group` },
        { label: 'Tooltip', href: `${base}/components/tooltip` },
        { label: 'Topbar', href: `${base}/components/topbar` },
      ],
    },
  ];
}
