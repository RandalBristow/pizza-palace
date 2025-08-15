/**
 * Utility to suppress ResizeObserver loop completed errors
 * and provide better error handling for resize operations
 */

const isResizeObserverError = (message: any): boolean => {
  if (typeof message !== 'string') return false;
  return (
    message.includes('ResizeObserver loop completed with undelivered notifications') ||
    message.includes('ResizeObserver loop limit exceeded') ||
    message.includes('ResizeObserver loop')
  );
};

// Suppress ResizeObserver errors and warnings globally
const originalError = window.console.error;
const originalWarn = window.console.warn;

window.console.error = (...args: any[]) => {
  if (args.length > 0 && isResizeObserverError(args[0])) {
    // Suppress this specific error as it's usually harmless
    return;
  }
  originalError.apply(console, args);
};

window.console.warn = (...args: any[]) => {
  if (args.length > 0 && isResizeObserverError(args[0])) {
    // Suppress this specific warning as it's usually harmless
    return;
  }
  originalWarn.apply(console, args);
};

// Handle error events on window
const handleResizeObserverError = (e: ErrorEvent) => {
  if (e.message && isResizeObserverError(e.message)) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
  return true;
};

window.addEventListener('error', handleResizeObserverError);

// Handle unhandled promise rejections that might contain ResizeObserver errors
window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
  if (e.reason && typeof e.reason === 'string' && isResizeObserverError(e.reason)) {
    e.preventDefault();
  }
});

/**
 * Debounced ResizeObserver wrapper to prevent rapid firing
 */
export class DebouncedResizeObserver {
  private observer: ResizeObserver;
  private timeoutId: number | null = null;
  private delay: number;

  constructor(callback: ResizeObserverCallback, delay = 100) {
    this.delay = delay;
    
    this.observer = new ResizeObserver((entries) => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      this.timeoutId = window.setTimeout(() => {
        try {
          callback(entries, this.observer);
        } catch (error) {
          // Silently handle resize observer errors
          console.debug('ResizeObserver callback error:', error);
        }
      }, this.delay);
    });
  }

  observe(target: Element, options?: ResizeObserverOptions) {
    this.observer.observe(target, options);
  }

  unobserve(target: Element) {
    this.observer.unobserve(target);
  }

  disconnect() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.observer.disconnect();
  }
}

/**
 * Hook for using debounced resize observer
 */
export const useDebouncedResizeObserver = (
  callback: ResizeObserverCallback,
  delay = 100
) => {
  let observer: DebouncedResizeObserver | null = null;

  const observe = (element: Element) => {
    if (observer) {
      observer.disconnect();
    }
    observer = new DebouncedResizeObserver(callback, delay);
    observer.observe(element);
  };

  const disconnect = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  return { observe, disconnect };
};
