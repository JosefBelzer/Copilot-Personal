/**
 * Tests for domUtils.ts — getActiveDocument() popout safety.
 *
 * Implements `declare const activeDocument: Document | undefined` pattern.
 * In Node/V8, `typeof` on a bare name resolves through globalThis even in
 * strict mode modules, so setting `(globalThis as any).activeDocument = fakeDoc`
 * makes `typeof activeDocument ` return `"object"`.
 *
 * The fallback `document` is accessed only when activeDocument is absent.
 * In Node, `document` is not defined, so calling getActiveDocument() without
 * setting activeDocument first will throw at the `document` reference.
 */
import { getActiveDocument } from "../utils/domUtils";

describe("getActiveDocument", () => {
  afterEach(() => {
    // Always clean up after each test
    delete (globalThis as any).activeDocument;
  });

  test("returns activeDocument when it is set on globalThis", () => {
    const fakeDoc = { title: "Popout Window", createElement: () => ({ tagName: "DIV" }) };
    (globalThis as any).activeDocument = fakeDoc;

    const doc = getActiveDocument();
    expect(doc).toBe(fakeDoc);
  });

  test("typeof resolves globalThis properties in Node strict mode", () => {
    (globalThis as any).activeDocument = { createElement: () => ({}) };
    // This confirms that `typeof activeDocument` in the compiled function
    // resolves through globalThis, not just through local scope
    const doc = getActiveDocument();
    expect(doc).toBeTruthy();
    expect(typeof doc).toBe("object");
  });

  test("consecutive calls return same reference", () => {
    const fakeDoc = { createElement: () => ({}) };
    (globalThis as any).activeDocument = fakeDoc;

    const doc1 = getActiveDocument();
    const doc2 = getActiveDocument();
    expect(doc1).toBe(doc2);
  });

  test("resolves correctly when activeDocument is set after being absent", () => {
    // Ensure activeDocument is NOT set
    delete (globalThis as any).activeDocument;
    expect((globalThis as any).activeDocument).toBeUndefined();

    // Now set it
    const fakeDoc = { createElement: () => ({}) };
    (globalThis as any).activeDocument = fakeDoc;

    const doc = getActiveDocument();
    expect(doc).toBe(fakeDoc);
  });

  test("throws in Node when activeDocument is absent (document is unavailable)", () => {
    // Ensure activeDocument is NOT set
    delete (globalThis as any).activeDocument;

    // In Node, accessing bare `document` throws ReferenceError
    // The typeof check correctly falls through to document, which fails
    expect(() => getActiveDocument()).toThrow();
  });

  test("function signature is correct", () => {
    expect(typeof getActiveDocument).toBe("function");
    // Must return a Document-compatible object
    (globalThis as any).activeDocument = { createElement: () => ({}) };
    const doc = getActiveDocument();
    expect(typeof doc.createElement).toBe("function");
  });
});
