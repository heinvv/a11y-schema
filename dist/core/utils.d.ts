/**
 * Utility functions for focus-patterns library
 */
/**
 * Generate unique ID with optional prefix
 */
export declare function generateId(prefix?: string): string;
/**
 * Get all focusable elements within a container
 */
export declare function getFocusableElements(container: HTMLElement): HTMLElement[];
/**
 * Move focus to element safely
 */
export declare function moveFocus(element: HTMLElement | null): void;
/**
 * Get next/previous element in array with wrapping
 */
export declare function getNextElement<T>(array: T[], currentIndex: number, direction: 1 | -1, loop?: boolean): number;
/**
 * Announce message to screen readers
 */
export declare function announce(message: string, politeness?: 'polite' | 'assertive'): void;
//# sourceMappingURL=utils.d.ts.map