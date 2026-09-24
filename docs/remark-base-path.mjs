/**
 * Remark plugin to prepend the Astro base path to absolute internal links and images
 * in markdown files. This ensures paths like /docs/foo and /covers/img.png work
 * correctly when deployed under a sub-path (e.g., /assemble/).
 */
import { visit } from 'unist-util-visit';

const BASE = '/assemble';

export function remarkBasePath() {
  return (tree) => {
    visit(tree, (node) => {
      // Markdown links: [text](/docs/foo)
      if (node.type === 'link' && node.url && node.url.startsWith('/') && !node.url.startsWith(BASE)) {
        node.url = BASE + node.url;
      }
      // Markdown images: ![alt](/covers/img.png)
      if (node.type === 'image' && node.url && node.url.startsWith('/') && !node.url.startsWith(BASE)) {
        node.url = BASE + node.url;
      }
    });
  };
}
