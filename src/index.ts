/**
 * focus-patterns - Accessible UI patterns library
 * Version 0.1.0 (POC)
 */

import { Tabs, TabsConfig } from './patterns/tabs/tabs.js';

// Store all initialized instances
const instances = new WeakMap<HTMLElement, Tabs>();

/**
 * Initialize all patterns found in the DOM
 */
function initializeAll(): void {
  // Find all elements with data-focus attribute
  const elements = document.querySelectorAll<HTMLElement>('[data-focus]');

  elements.forEach((element) => {
    const pattern = element.getAttribute('data-focus');

    if (!pattern) return;

    // Skip if already initialized
    if (instances.has(element)) return;

    // Extract configuration from data attributes
    const config: TabsConfig = {
      activation: element.getAttribute('data-activation') as 'auto' | 'manual' || undefined,
      orientation: element.getAttribute('data-orientation') as 'horizontal' | 'vertical' || undefined,
      loop: element.getAttribute('data-loop') as 'true' | 'false' || undefined,
    };

    switch (pattern) {
      case 'tabs':
        const tabs = new Tabs(element, config);
        instances.set(element, tabs);
        break;

      default:
        console.warn(`focus-patterns: Unknown pattern "${pattern}"`);
    }
  });
}

/**
 * Initialize on DOM ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAll);
} else {
  // DOM is already ready
  initializeAll();
}

/**
 * Global API
 */
const FocusPatterns = {
  Tabs,
  version: '0.1.0',

  /**
   * Manually initialize a specific element
   */
  init(element: HTMLElement, config?: TabsConfig): Tabs | null {
    const pattern = element.getAttribute('data-focus');

    if (pattern === 'tabs') {
      const tabs = new Tabs(element, config);
      instances.set(element, tabs);
      return tabs;
    }

    console.warn(`focus-patterns: Cannot initialize pattern "${pattern}"`);
    return null;
  },

  /**
   * Re-scan and initialize any new elements
   */
  refresh(): void {
    initializeAll();
  }
};

// Export for module usage
export { Tabs, TabsConfig };
export default FocusPatterns;

// Attach to window for CDN usage
if (typeof window !== 'undefined') {
  (window as any).FocusPatterns = FocusPatterns;
}
