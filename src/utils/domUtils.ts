/**
 * DOM utilities for popout window compatibility.
 *
 * Obsidian supports detaching views into separate popout windows.
 * In popout mode, `document` refers to the main window, not the popout.
 * Use `getActiveDocument()` to get the correct document for element creation.
 */

declare const activeDocument: Document | undefined;

/**
 * Returns the correct Document for the current context, supporting
 * Obsidian popout windows. In Obsidian >=1.13, activeDocument is defined
 * globally and points to the correct window's document (main or popout).
 * Falls back to document only in test environments (JSDOM) where Obsidian
 * globals are unavailable.
 */
export function getActiveDocument(): Document {
  return typeof activeDocument !== 'undefined' ? activeDocument : document;
}
