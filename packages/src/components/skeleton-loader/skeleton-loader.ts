import AsmSkeletonLoader from './skeleton-loader.component.js';

export * from './skeleton-loader.component.js';
export default AsmSkeletonLoader;

customElements.define('asm-skeleton-loader', AsmSkeletonLoader);

declare global {
  interface HTMLElementTagNameMap {
    'asm-skeleton-loader': AsmSkeletonLoader;
  }
}
