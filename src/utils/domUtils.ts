/**
 * DOM utilities for popout window compatibility.
 *
 * Obsidian supports detaching views into separate popout windows.
 * In popout mode, `document` refers to the main window, not the popout.
 * Use `getActiveDocument()` to get the correct document for element creation.
 */

/**
 * Returns the correct Document for the current context, supporting
 * Obsidian popout windows. Falls back to global document when
 * `activeDocument` is unavailable (e.g., in tests).
 */
export function getActiveDocument(): Document {
  return (globalThis as any).activeDocument ?? document;
}
