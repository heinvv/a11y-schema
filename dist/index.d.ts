/**
 * focus-patterns - Accessible UI patterns library
 * Version 0.1.0 (POC)
 */
import { Tabs, TabsConfig } from './patterns/tabs/tabs.js';
/**
 * Global API
 */
declare const FocusPatterns: {
    Tabs: typeof Tabs;
    version: string;
    /**
     * Manually initialize a specific element
     */
    init(element: HTMLElement, config?: TabsConfig): Tabs | null;
    /**
     * Re-scan and initialize any new elements
     */
    refresh(): void;
};
export { Tabs, TabsConfig };
export default FocusPatterns;
//# sourceMappingURL=index.d.ts.map