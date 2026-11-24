/**
 * AptitudePro Centralized Toast Notification System
 * Inspired by Linear, Stripe, and modern SaaS design systems.
 */

let toastCounter = 0;

function generateToastId() {
  toastCounter += 1;
  return `aptitudepro-toast-${Date.now()}-${toastCounter}`;
}

function dispatchToastAction(action, payload) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app_toast_action', {
        detail: { action, payload },
      })
    );
  }
}

/**
 * Main toast dispatcher object
 */
export const toast = (message, options = {}) => {
  const id = options.id || generateToastId();
  const type = options.type || 'info';
  const duration = options.duration !== undefined ? options.duration : 4000;
  const title = options.title || '';

  dispatchToastAction('ADD', {
    id,
    type,
    title,
    message,
    duration,
    ...options,
  });

  return id;
};

toast.success = (message, options = {}) => {
  return toast(message, { ...options, type: 'success' });
};

toast.error = (message, options = {}) => {
  return toast(message, {
    ...options,
    type: 'error',
    duration: options.duration !== undefined ? options.duration : 5500,
  });
};

toast.warning = (message, options = {}) => {
  return toast(message, {
    ...options,
    type: 'warning',
    duration: options.duration !== undefined ? options.duration : 5000,
  });
};

toast.info = (message, options = {}) => {
  return toast(message, { ...options, type: 'info' });
};

toast.loading = (message, options = {}) => {
  return toast(message, {
    ...options,
    type: 'loading',
    duration: 0, // Persistent until explicitly updated or dismissed
  });
};

toast.update = (id, options = {}) => {
  dispatchToastAction('UPDATE', {
    id,
    ...options,
  });
  return id;
};

toast.dismiss = (id = null) => {
  if (id) {
    dispatchToastAction('DISMISS', { id });
  } else {
    dispatchToastAction('CLEAR', {});
  }
};

/**
 * Backward-compatible showToast helper with smart type auto-detection
 */
export function showToast(message, typeOrOptions = null, maybeDuration = undefined) {
  if (!message) return;

  let options = {};

  if (typeof typeOrOptions === 'string') {
    options.type = typeOrOptions;
    if (maybeDuration !== undefined) {
      options.duration = maybeDuration;
    }
  } else if (typeOrOptions && typeof typeOrOptions === 'object') {
    options = { ...typeOrOptions };
  }

  // Auto-detect type if not explicitly passed
  if (!options.type) {
    const lower = String(message).toLowerCase();
    if (
      lower.includes('error') ||
      lower.includes('failed') ||
      lower.includes('invalid') ||
      lower.includes('wrong') ||
      lower.includes('cannot')
    ) {
      options.type = 'error';
    } else if (
      lower.includes('accept') ||
      lower.includes('required') ||
      lower.includes('please') ||
      lower.includes('warning') ||
      lower.includes('running out')
    ) {
      options.type = 'warning';
    } else if (
      lower.includes('success') ||
      lower.includes('saved') ||
      lower.includes('created') ||
      lower.includes('updated') ||
      lower.includes('downloaded') ||
      lower.includes('completed') ||
      lower.includes('verified')
    ) {
      options.type = 'success';
    } else {
      options.type = 'info';
    }
  }

  return toast(message, options);
}

export default toast;
