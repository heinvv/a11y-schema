/**
 * Tabs Pattern Implementation
 * Based on WAI-ARIA Authoring Practices Guide
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */
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
export declare class Tabs {
    private container;
    private tablist;
    private tabs;
    private panels;
    private currentIndex;
    private config;
    constructor(container: HTMLElement, userConfig?: TabsConfig);
    private init;
    private setupARIA;
    private setupEvents;
    private handleKeydown;
    /**
     * Select a tab by index
     */
    selectTab(index: number, shouldAnnounce?: boolean): void;
    /**
     * Get currently selected tab index
     */
    getSelectedIndex(): number;
    /**
     * Destroy the tabs instance and clean up
     */
    destroy(): void;
    /**
     * Initialize tabs from an element
     */
    static init(element: HTMLElement, config?: TabsConfig): Tabs;
}
//# sourceMappingURL=tabs.d.ts.map