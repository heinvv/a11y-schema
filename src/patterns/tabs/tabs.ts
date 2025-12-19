/**
 * Tabs Pattern Implementation
 * Based on WAI-ARIA Authoring Practices Guide
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */

import { generateId, moveFocus, getNextElement, announce } from '../../core/utils.js';

export interface TabsConfig {
  /** Activation behavior: auto or manual (default: manual) */
  activation?: 'auto' | 'manual';

  /** Orientation: horizontal or vertical (default: horizontal) */
  orientation?: 'horizontal' | 'vertical';

  /** Whether arrow keys should loop (default: true) */
  loop?: 'true' | 'false';

  /** Callback when tab changes */
  onChange?: (tabIndex: number, tabElement: HTMLElement) => void;

  /** ID prefix for generated IDs */
  idPrefix?: string;

  /** Whether to announce tab changes to screen readers */
  announceChanges?: boolean;
}

export class Tabs {
  private container: HTMLElement;
  private tablist: HTMLElement | null = null;
  private tabs: HTMLElement[] = [];
  private panels: HTMLElement[] = [];
  private currentIndex: number = 0;
  private config: Required<TabsConfig>;

  constructor(container: HTMLElement, userConfig: TabsConfig = {}) {
    this.container = container;

    // Merge config with defaults
    this.config = {
      activation: userConfig.activation || 'manual',
      orientation: userConfig.orientation || 'horizontal',
      loop: userConfig.loop || 'true',
      onChange: userConfig.onChange || (() => {}),
      idPrefix: userConfig.idPrefix || 'tab',
      announceChanges: userConfig.announceChanges !== false
    };

    this.init();
  }

  private init(): void {
    // Find tablist
    this.tablist = this.container.querySelector('[data-role="tablist"]');
    if (!this.tablist) {
      console.error('focus-patterns: No tablist found in container');
      return;
    }

    // Find all tabs and panels
    this.tabs = Array.from(this.container.querySelectorAll('[data-role="tab"]'));
    this.panels = Array.from(this.container.querySelectorAll('[data-role="tabpanel"]'));

    if (this.tabs.length === 0 || this.panels.length === 0) {
      console.error('focus-patterns: No tabs or panels found');
      return;
    }

    if (this.tabs.length !== this.panels.length) {
      console.warn('focus-patterns: Number of tabs and panels do not match');
    }

    // Set up ARIA attributes
    this.setupARIA();

    // Set up event listeners
    this.setupEvents();

    // Activate first tab
    this.selectTab(0, false);
  }

  private setupARIA(): void {
    if (!this.tablist) return;

    // Set tablist role and orientation
    if (!this.tablist.getAttribute('role')) {
      this.tablist.setAttribute('role', 'tablist');
    }
    this.tablist.setAttribute('aria-orientation', this.config.orientation);

    // Add vertical-tabs class for CSS styling
    if (this.config.orientation === 'vertical') {
      this.tablist.classList.add('vertical-tabs');
    }

    // Set up each tab and panel
    this.tabs.forEach((tab, index) => {
      const panel = this.panels[index];
      if (!panel) return;

      // Generate IDs if needed
      const tabId = tab.id || generateId(`${this.config.idPrefix}-${index}`);
      const panelId = panel.id || generateId(`${this.config.idPrefix}-panel-${index}`);

      tab.id = tabId;
      panel.id = panelId;

      // Set tab attributes
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panelId);
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');

      // Set panel attributes
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabId);
      panel.setAttribute('tabindex', '0');
      panel.hidden = true;
    });
  }

  private setupEvents(): void {
    this.tabs.forEach((tab, index) => {
      // Click handler
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectTab(index);
      });

      // Keyboard handler
      tab.addEventListener('keydown', (e) => this.handleKeydown(e, index));
    });
  }

  private handleKeydown(event: KeyboardEvent, currentIndex: number): void {
    const { orientation } = this.config;
    let handled = false;
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        if (
          (event.key === 'ArrowLeft' && orientation === 'horizontal') ||
          (event.key === 'ArrowUp' && orientation === 'vertical')
        ) {
          newIndex = getNextElement(this.tabs, currentIndex, -1, this.config.loop === 'true');
          handled = true;
        }
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        if (
          (event.key === 'ArrowRight' && orientation === 'horizontal') ||
          (event.key === 'ArrowDown' && orientation === 'vertical')
        ) {
          newIndex = getNextElement(this.tabs, currentIndex, 1, this.config.loop === 'true');
          handled = true;
        }
        break;

      case 'Home':
        newIndex = 0;
        handled = true;
        break;

      case 'End':
        newIndex = this.tabs.length - 1;
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();

      // Move focus to new tab
      moveFocus(this.tabs[newIndex]);

      // Auto-activate if configured
      if (this.config.activation === 'auto') {
        this.selectTab(newIndex);
      }
    }
  }

  /**
   * Select a tab by index
   */
  public selectTab(index: number, shouldAnnounce: boolean = true): void {
    if (index < 0 || index >= this.tabs.length) {
      console.warn(`focus-patterns: Invalid tab index ${index}`);
      return;
    }

    const previousIndex = this.currentIndex;
    this.currentIndex = index;

    // Deactivate all tabs
    this.tabs.forEach((tab, i) => {
      const panel = this.panels[i];
      const isSelected = i === index;

      tab.setAttribute('aria-selected', String(isSelected));
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');

      if (panel) {
        panel.hidden = !isSelected;
      }
    });

    // Announce change to screen readers
    if (shouldAnnounce && this.config.announceChanges && previousIndex !== index) {
      const tabText = this.tabs[index].textContent || `Tab ${index + 1}`;
      announce(`${tabText} selected`);
    }

    // Call onChange callback
    if (previousIndex !== index) {
      this.config.onChange(index, this.tabs[index]);
    }
  }

  /**
   * Get currently selected tab index
   */
  public getSelectedIndex(): number {
    return this.currentIndex;
  }

  /**
   * Destroy the tabs instance and clean up
   */
  public destroy(): void {
    // Remove event listeners (simplified - in production would track and remove specific listeners)
    this.tabs.forEach(tab => {
      const newTab = tab.cloneNode(true);
      tab.parentNode?.replaceChild(newTab, tab);
    });
  }

  /**
   * Initialize tabs from an element
   */
  public static init(element: HTMLElement, config?: TabsConfig): Tabs {
    return new Tabs(element, config);
  }
}
