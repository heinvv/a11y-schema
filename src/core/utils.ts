/**
 * Utility functions for focus-patterns library
 */

/**
 * Generate unique ID with optional prefix
 */
export function generateId(prefix: string = 'fp'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

/**
 * Move focus to element safely
 */
export function moveFocus(element: HTMLElement | null): void {
  if (element) {
    element.focus();
  }
}

/**
 * Get next/previous element in array with wrapping
 */
export function getNextElement<T>(
  array: T[],
  currentIndex: number,
  direction: 1 | -1,
  loop: boolean = true
): number {
  const length = array.length;
  let nextIndex = currentIndex + direction;

  if (loop) {
    // Wrap around
    if (nextIndex < 0) nextIndex = length - 1;
    if (nextIndex >= length) nextIndex = 0;
  } else {
    // Clamp to bounds
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= length) nextIndex = length - 1;
  }

  return nextIndex;
}

/**
 * Announce message to screen readers
 */
export function announce(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', politeness);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'fp-sr-only';
  liveRegion.textContent = message;

  // Add visually hidden styles
  Object.assign(liveRegion.style, {
    position: 'absolute',
    left: '-10000px',
    width: '1px',
    height: '1px',
    overflow: 'hidden'
  });

  document.body.appendChild(liveRegion);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 1000);
}
