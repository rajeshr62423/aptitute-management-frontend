export function showToast(message) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app_toast', { detail: message }));
  }
}
