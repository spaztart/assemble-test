/**
 * Shared utility functions for docs page scripts.
 */

export function showCopiedSnackbar() {
  const sb = document.getElementById('global-snackbar') as any;
  if (sb) {
    sb.message = 'Copied';
    sb.actionLabel = '';
    sb.leadingIcon = 'check';
    sb.duration = 2000;
    sb.open = true;
  }
}
