/**
 * Tabs Pattern Implementation
 * Based on WAI-ARIA Authoring Practices Guide
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */

import { generateId, moveFocus, getNextElement, announce } from '../../core/utils.js';

const SELECTORS = {
  TABLIST: '[data-role="tablist"]',
  TAB: '[data-role="tab"]',
  PANEL: '[data-role="tabpanel"]',
  FOCUSABLE_ELEMENTS: 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
} as const;

const ARIA_ATTRIBUTES = {
  ROLE: 'role',
  ORIENTATION: 'aria-orientation',
  SELECTED: 'aria-selected',
  CONTROLS: 'aria-controls',
  LABELLEDBY: 'aria-labelledby',
  TABINDEX: 'tabindex'
} as const;

const ROLES = {
  TABLIST: 'tablist',
  TAB: 'tab',
  PANEL: 'tabpanel'
} as const;

const CSS_CLASSES = {
  VERTICAL: 'vertical-tabs'
} as const;

const TABINDEX_VALUES = {
  FOCUSABLE: '0',
  NOT_FOCUSABLE: '-1'
} as const;

const ERROR_MESSAGES = {
  NO_TABLIST: 'focus-patterns: No tablist found in container',
  NO_TABS_OR_PANELS: 'focus-patterns: No tabs or panels found',
  MISMATCH_COUNT: 'focus-patterns: Number of tabs and panels do not match',
  INVALID_TAB_INDEX: 'focus-patterns: Invalid tab index',
  MISSING_TAB_ROLE: 'Missing role="tab" on tab element',
  MISSING_PANEL_ROLE: 'Missing role="tabpanel" on panel element',
  MISSING_TAB_ID: 'Missing ID on tab element',
  MISSING_PANEL_ID: 'Missing ID on panel element'
} as const;

export interface TabsConfig {
  strict?: boolean;
  activation?: 'auto' | 'manual';
  orientation?: 'horizontal' | 'vertical';
  loop?: 'true' | 'false';
  onChange?: (tabIndex: number, tabElement: HTMLElement) => void;
  idPrefix?: string;
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

    this.config = {
      strict: userConfig.strict ?? false,
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
    this.findElements();
    this.validateElements();
    this.setupARIA();
    this.setupEvents();
    this.selectInitialTab();
  }

  private findElements(): void {
    this.tablist = this.container.querySelector(SELECTORS.TABLIST);
    this.tabs = Array.from(this.container.querySelectorAll(SELECTORS.TAB));
    this.panels = Array.from(this.container.querySelectorAll(SELECTORS.PANEL));
  }

  private validateElements(): void {
    if (!this.tablist) {
      console.error(ERROR_MESSAGES.NO_TABLIST);
      return;
    }

    if (this.tabs.length === 0 || this.panels.length === 0) {
      console.error(ERROR_MESSAGES.NO_TABS_OR_PANELS);
      return;
    }

    if (this.tabs.length !== this.panels.length) {
      console.warn(ERROR_MESSAGES.MISMATCH_COUNT);
    }
  }

  private setupARIA(): void {
    if (!this.tablist) return;

    this.setTablistAttributes();
    this.applyOrientationStyling();

    if (this.config.strict) {
      this.setupStrictMode();
    } else {
      this.setupForgivingMode();
    }
  }

  private setTablistAttributes(): void {
    if (!this.tablist) return;

    if (!this.tablist.getAttribute(ARIA_ATTRIBUTES.ROLE)) {
      this.tablist.setAttribute(ARIA_ATTRIBUTES.ROLE, ROLES.TABLIST);
    }
    this.tablist.setAttribute(ARIA_ATTRIBUTES.ORIENTATION, this.config.orientation);
  }

  private applyOrientationStyling(): void {
    if (!this.tablist) return;

    if (this.config.orientation === 'vertical') {
      this.tablist.classList.add(CSS_CLASSES.VERTICAL);
    }
  }

  private setupForgivingMode(): void {
    this.tabs.forEach((tab, index) => {
      const panel = this.panels[index];
      if (!panel) return;

      const { tabId, panelId } = this.ensureElementIds(tab, panel, index);
      this.setStaticAriaAttributes(tab, panel, tabId, panelId);
      this.setIntelligentTabindex(panel);
      this.setInitialDynamicAttributes(tab, panel);
    });
  }

  private setupStrictMode(): void {
    this.tabs.forEach((tab, index) => {
      const panel = this.panels[index];
      if (!panel) return;

      this.validateRequiredAttributes(tab, panel);
      this.setInitialDynamicAttributes(tab, panel);
    });
  }

  private ensureElementIds(tab: HTMLElement, panel: HTMLElement, index: number): { tabId: string; panelId: string } {
    const tabId = tab.id || generateId(`${this.config.idPrefix}-${index}`);
    const panelId = panel.id || generateId(`${this.config.idPrefix}-panel-${index}`);

    tab.id = tabId;
    panel.id = panelId;

    return { tabId, panelId };
  }

  private setStaticAriaAttributes(tab: HTMLElement, panel: HTMLElement, tabId: string, panelId: string): void {
    tab.setAttribute(ARIA_ATTRIBUTES.ROLE, ROLES.TAB);
    tab.setAttribute(ARIA_ATTRIBUTES.CONTROLS, panelId);
    panel.setAttribute(ARIA_ATTRIBUTES.ROLE, ROLES.PANEL);
    panel.setAttribute(ARIA_ATTRIBUTES.LABELLEDBY, tabId);
  }

  private setIntelligentTabindex(panel: HTMLElement): void {
    const hasFocusableContent = panel.querySelector(SELECTORS.FOCUSABLE_ELEMENTS);

    if (!hasFocusableContent) {
      panel.setAttribute(ARIA_ATTRIBUTES.TABINDEX, TABINDEX_VALUES.FOCUSABLE);
    }
  }

  private setInitialDynamicAttributes(tab: HTMLElement, panel: HTMLElement): void {
    tab.setAttribute(ARIA_ATTRIBUTES.SELECTED, 'false');
    tab.setAttribute(ARIA_ATTRIBUTES.TABINDEX, TABINDEX_VALUES.NOT_FOCUSABLE);
    panel.hidden = true;
  }

  private validateRequiredAttributes(tab: HTMLElement, panel: HTMLElement): void {
    if (!tab.getAttribute(ARIA_ATTRIBUTES.ROLE)) {
      throw new Error(ERROR_MESSAGES.MISSING_TAB_ROLE);
    }
    if (!panel.getAttribute(ARIA_ATTRIBUTES.ROLE)) {
      throw new Error(ERROR_MESSAGES.MISSING_PANEL_ROLE);
    }
    if (!tab.id) {
      throw new Error(ERROR_MESSAGES.MISSING_TAB_ID);
    }
    if (!panel.id) {
      throw new Error(ERROR_MESSAGES.MISSING_PANEL_ID);
    }
  }

  private setupEvents(): void {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => this.handleTabClick(e, index));
      tab.addEventListener('keydown', (e) => this.handleKeydown(e, index));
    });
  }

  private handleTabClick(event: Event, index: number): void {
    event.preventDefault();
    this.selectTab(index);
  }

  private selectInitialTab(): void {
    const preselectedIndex = this.tabs.findIndex(tab =>
      tab.getAttribute(ARIA_ATTRIBUTES.SELECTED) === 'true'
    );
    const initialIndex = preselectedIndex >= 0 ? preselectedIndex : 0;
    this.selectTab(initialIndex, false);
  }

  private handleKeydown(event: KeyboardEvent, currentIndex: number): void {
    const { orientation } = this.config;
    let handled = false;
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        if (this.isOrientationMatch(event.key, orientation)) {
          newIndex = getNextElement(this.tabs, currentIndex, -1, this.config.loop === 'true');
          handled = true;
        }
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        if (this.isOrientationMatch(event.key, orientation)) {
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
      moveFocus(this.tabs[newIndex]);

      if (this.config.activation === 'auto') {
        this.selectTab(newIndex);
      }
    }
  }

  private isOrientationMatch(key: string, orientation: string): boolean {
    return (
      (key === 'ArrowLeft' && orientation === 'horizontal') ||
      (key === 'ArrowUp' && orientation === 'vertical') ||
      (key === 'ArrowRight' && orientation === 'horizontal') ||
      (key === 'ArrowDown' && orientation === 'vertical')
    );
  }

  public selectTab(index: number, shouldAnnounce: boolean = true): void {
    if (!this.isValidTabIndex(index)) {
      console.warn(`${ERROR_MESSAGES.INVALID_TAB_INDEX} ${index}`);
      return;
    }

    const previousIndex = this.currentIndex;
    this.currentIndex = index;

    this.updateTabStates(index);
    this.announceTabChange(index, previousIndex, shouldAnnounce);
    this.notifyTabChange(index, previousIndex);
  }

  private isValidTabIndex(index: number): boolean {
    return index >= 0 && index < this.tabs.length;
  }

  private updateTabStates(selectedIndex: number): void {
    this.tabs.forEach((tab, i) => {
      const panel = this.panels[i];
      const isSelected = i === selectedIndex;

      tab.setAttribute(ARIA_ATTRIBUTES.SELECTED, String(isSelected));
      tab.setAttribute(ARIA_ATTRIBUTES.TABINDEX, isSelected ? TABINDEX_VALUES.FOCUSABLE : TABINDEX_VALUES.NOT_FOCUSABLE);

      if (panel) {
        panel.hidden = !isSelected;
      }
    });
  }

  private announceTabChange(index: number, previousIndex: number, shouldAnnounce: boolean): void {
    if (shouldAnnounce && this.config.announceChanges && previousIndex !== index) {
      const tabText = this.tabs[index].textContent || `Tab ${index + 1}`;
      announce(`${tabText} selected`);
    }
  }

  private notifyTabChange(index: number, previousIndex: number): void {
    if (previousIndex !== index) {
      this.config.onChange(index, this.tabs[index]);
    }
  }

  public getSelectedIndex(): number {
    return this.currentIndex;
  }

  public destroy(): void {
    this.tabs.forEach(tab => {
      const newTab = tab.cloneNode(true);
      tab.parentNode?.replaceChild(newTab, tab);
    });
  }

  public static init(element: HTMLElement, config?: TabsConfig): Tabs {
    return new Tabs(element, config);
  }
}
