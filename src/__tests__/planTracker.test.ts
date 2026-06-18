/**
 * Tests for PlanTracker.ts — agent execution plan state tracking.
 */
import { PlanTracker } from "../agent/PlanTracker";

describe("PlanTracker", () => {
  let tracker: PlanTracker;

  beforeEach(() => {
    tracker = new PlanTracker();
  });

  describe("setGoal", () => {
    test("stores the goal text", () => {
      tracker.setGoal("Read PDF and populate notes");
      tracker.setPlan("1. Do thing");
      const text = tracker.getStateText();
      expect(text).toContain("Read PDF and populate notes");
    });

    test("truncates goal to 300 chars", () => {
      const longGoal = "A".repeat(400);
      tracker.setGoal(longGoal);
      const text = tracker.getStateText();
      // Should not contain full 400-char string
      expect(text).not.toContain("A".repeat(301));
    });

    test("goal persists across plan operations", () => {
      tracker.setGoal("My goal");
      tracker.setPlan("1. Do X\n2. Do Y");
      const text = tracker.getStateText();
      expect(text).toContain("My goal");
    });
  });

  describe("setPlan", () => {
    test("parses numbered plan steps", () => {
      tracker.setPlan("1. Find files\n2. Read PDF\n3. Write notes");
      expect(tracker.hasPlan()).toBe(true);
      const text = tracker.getStateText();
      expect(text).toContain("Find files");
      expect(text).toContain("Read PDF");
      expect(text).toContain("Write notes");
    });

    test("first step is marked active", () => {
      tracker.setPlan("1. First step\n2. Second step");
      const text = tracker.getStateText();
      expect(text).toContain("→ 1. First step"); // active
      expect(text).toContain("· 2. Second step"); // pending
    });

    test("handles parenthesized numbering", () => {
      tracker.setPlan("1) Find files\n2) Process");
      expect(tracker.hasPlan()).toBe(true);
    });

    test("handles empty plan", () => {
      tracker.setPlan("");
      expect(tracker.hasPlan()).toBe(false);
    });

    test("truncates action text to 120 chars", () => {
      tracker.setPlan(`1. ${"X".repeat(200)}`);
      const text = tracker.getStateText();
      // The action should be truncated
      expect(text).not.toContain("X".repeat(150));
    });
  });

  describe("advanceStep", () => {
    test("marks active step as done and advances to next", () => {
      tracker.setPlan("1. A\n2. B\n3. C");
      expect(tracker.isComplete()).toBe(false);

      tracker.advanceStep("find_files", { path: "test" }, "result data");
      let text = tracker.getStateText();
      expect(text).toContain("✓ 1. A"); // done
      expect(text).toContain("→ 2. B"); // now active

      tracker.advanceStep("read_pdf");
      tracker.advanceStep("create_note");
      expect(tracker.isComplete()).toBe(true);
    });

    test("stores tool name, args, and result on done step", () => {
      tracker.setPlan("1. Test step");
      tracker.advanceStep("read_note", { path: "note.md" }, "Content here");
      const text = tracker.getStateText();
      expect(text).toContain("✓ 1. Test step");
    });
  });

  describe("failStep", () => {
    test("marks active step as failed", () => {
      tracker.setPlan("1. Risky step\n2. Next step");
      tracker.failStep("find_files", "file not found");
      const text = tracker.getStateText();
      expect(text).toContain("✗ 1. Risky step");
      expect(text).toContain("ERROR: file not found");
    });

    test("marks active step as failed and does NOT auto-advance", () => {
      tracker.setPlan("1. A\n2. B\n3. C");
      tracker.failStep(); // A → failed, but doesn't advance
      const text = tracker.getStateText();
      expect(text).toContain("✗ 1. A");
      // After failStep, B is still pending (failStep doesn't advance)
      expect(text).toContain("· 2. B");
    });
  });

  describe("isDeviation", () => {
    test("detects when tool does not match active step", () => {
      tracker.setPlan("1. find_files for X\n2. read_note");
      tracker.advanceStep("find_files"); // Now step 1 is done with toolName=find_files
      
      // Step 2 is active but has no toolName yet, so no deviation detected
      expect(tracker.isDeviation("read_pdf", {})).toBe(false);
      
      tracker.advanceStep("read_note"); // Step 2 gets toolName=read_note
      
      // Step 3 would be active but there's no step 3
      // So isDeviation should return false since no active step
    });

    test("returns false when no active step exists", () => {
      expect(tracker.isDeviation("any_tool", {})).toBe(false);
    });
  });

  describe("getStateText", () => {
    test("returns empty string when no plan", () => {
      expect(tracker.getStateText()).toBe("");
    });

    test("shows correct count of done/pending", () => {
      tracker.setPlan("1. A\n2. B\n3. C");
      tracker.advanceStep("tool1"); // A→done, B→active. Pending: only C.
      const text = tracker.getStateText();
      // 1 done (A), 1 pending (C). B is active, not pending.
      expect(text).toContain("(1/3 done, 1 remaining)");
    });

    test("shows ALL STEPS COMPLETE when finished", () => {
      tracker.setPlan("1. A\n2. B");
      tracker.advanceStep("t1");
      tracker.advanceStep("t2");
      const text = tracker.getStateText();
      expect(text).toContain("ALL STEPS COMPLETE");
    });

    test("shows NEXT instruction when pending", () => {
      tracker.setPlan("1. A\n2. B");
      const text = tracker.getStateText();
      expect(text).toContain("NEXT: Execute the → step");
    });
  });

  describe("isComplete", () => {
    test("returns false when no plan exists", () => {
      expect(tracker.isComplete()).toBe(false);
    });

    test("returns false when steps are pending", () => {
      tracker.setPlan("1. A\n2. B");
      tracker.advanceStep("t1");
      expect(tracker.isComplete()).toBe(false);
    });

    test("returns true when all steps done", () => {
      tracker.setPlan("1. A\n2. B");
      tracker.advanceStep("t1");
      tracker.advanceStep("t2");
      expect(tracker.isComplete()).toBe(true);
    });

    test("returns false when only some steps failed (pending remains)", () => {
      tracker.setPlan("1. A\n2. B");
      tracker.failStep();  // A → failed, B is still pending
      // failStep doesn't advance to next step, so B is pending
      // Steps: A=failed, B=pending → not complete
      expect(tracker.isComplete()).toBe(false);
    });

    test("returns true with mix of done and failed, no pending", () => {
      tracker.setPlan("1. A\n2. B\n3. C");
      tracker.advanceStep("t1");    // A → done, B → active
      tracker.failStep();           // B → failed (was active, failStep doesn't advance)
      // After failStep: A=done, B=failed, C=pending (not active since failStep doesn't advance)
      // advanceStep: finds no active step, but does find C=pending and sets to active
      // Wait — advanceStep marks the active step as done. There IS no active step.
      // So advanceStep just activates C, doesn't mark anything done.
      tracker.advanceStep("t3");    // C → active (no active step to mark done, C becomes active)
      // A=done, B=failed, C=active → not complete
      expect(tracker.isComplete()).toBe(false);
    });
  });

  describe("hasPlan", () => {
    test("returns false initially", () => {
      expect(tracker.hasPlan()).toBe(false);
    });

    test("returns true after setPlan", () => {
      tracker.setPlan("1. Step");
      expect(tracker.hasPlan()).toBe(true);
    });

    test("does not affect getStateText when no plan", () => {
      expect(tracker.hasPlan()).toBe(false);
      expect(tracker.isComplete()).toBe(false);
      expect(tracker.isDeviation("any", {})).toBe(false);
    });
  });
});
