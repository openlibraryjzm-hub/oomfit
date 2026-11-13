# Autonomous Coding Workflow Guide

This document defines the official standard operating procedure for autonomous, agent-assisted development in **oomfit**. Any AI assistant or developer working on this codebase must follow this workflow.

---

## 🏛️ The 4 Core Principles

1. **1 Issue = 1 Branch = 1 Pull Request:** Never bundle multiple issues into a single branch or PR unless explicitly approved in a multi-issue plan.
2. **Binary "Done When" Criteria:** Acceptance criteria must have indisputable pass/fail answers. No subjective or vague targets.
3. **Mandatory Build Verification:** Every branch must pass `npm run build` cleanly before being submitted for review.
4. **Strict Circuit Breaker:** An AI agent is permitted a maximum of **3 consecutive failed build/test attempts** before it must halt development, revert dangerous edits, and post a diagnostic blocker comment.

---

## 🔄 The 4-Stage Lifecycle

```
[Messy Prompt] 
       │
       ▼
┌───────────────────────────────┐
│ Stage 1: Issue Ingestion      │ ──► Run 4 Litmus Tests (Split if needed)
│          & Template Spec      │ ──► Approve & push via `gh issue create`
└───────────────────────────────┘
       │
       ▼
┌───────────────────────────────┐
│ Stage 2: Backlog & Constraint │ ──► Evaluate model limits, capacity & scope
│          Assessment           │ ──► Present approaches with tradeoffs
└───────────────────────────────┘
       │
       ▼
┌───────────────────────────────┐
│ Stage 3: Refined Plan &       │ ──► Define branch topology (Parallel vs Stacked)
│          Merge Order          │ ──► Set exact sequence: issue-<num>-<slug>
└───────────────────────────────┘
       │
       ▼
┌───────────────────────────────┐
│ Stage 4: Autonomous Execution │ ──► Agent codes & runs `npm run build` (Max 3 tries)
│          & UI/UX Review       │ ──► PR submitted ──► Human tests & merges
└───────────────────────────────┘
```

---

## ✂️ Stage 1: Issue Ingestion & The 4 "Split" Litmus Tests

When a developer provides raw, messy thoughts or feature requests, the AI must evaluate the request against these **4 Litmus Tests** before creating an issue. If any test fails, the AI **must propose splitting the request into multiple atomic issues**.

### 1. Independent Deployability Test
* *Can Feature A be merged into `main` and provide value without Feature B?*
* If yes, **split them**.
* *Example:* "Add catalog card hover animations" and "Add search debounce" are independent $\rightarrow$ Split into two issues.

### 2. Architectural Layer Test
* *Does the request cross major architectural boundaries (e.g., Supabase PostgreSQL schema vs. Next.js 16 UI components vs. Bot engine)?*
* If yes, **split them**.
* *Example:* "Add post spoiler blur" $\rightarrow$ 
  * Issue 1: Database column / API payload support (`is_spoiler: boolean`).
  * Issue 2: Frontend catalog card & thread inlining blur UI.

### 3. Verification Cohesion Test
* *Can the acceptance criteria be validated in a single coherent manual or automated test pass?*
* If the verification requires testing completely separate pages or environments, **split them**.

### 4. Blast Radius (Diff Budget) Test
* *Will the implementation touch more than 4–5 files or exceed ~200–300 lines of diff?*
* If yes, **split them**. Smaller PRs reduce agent hallucination and make human review effortless.

### Publishing the Issue
Once atomic boundaries are confirmed and the user approves the spec, the issue is published to GitHub via:
```bash
gh issue create --title "[TASK]: <Short Title>" --body-file spec.md
```

---

## ⚖️ Stage 2: Backlog & Constraint Assessment

Once issues exist on GitHub, the AI performs an architectural assessment of the requested scope against active constraints:

1. **Model & Context Capacity:** Evaluate whether the task complexity fits the active model (e.g., Gemini Flash vs. Pro) and context window.
2. **Tradeoff Analysis:** Offer 2–3 viable architectural approaches with transparent pros, cons, and performance/maintenance tradeoffs.
3. **Capacity Realism:** If the user presents a large wishlist, explicitly state which items can be done cleanly together vs. what should be deferred.

---

## 🗺️ Stage 3: Refined Implementation Plan & Merge Order

Before a single line of code is written:

1. **Branch Topology (Parallel vs. Stacked):**
   * **Parallel Branches:** Independent features branched directly off `main`.
   * **Stacked Branches:** Dependent features (e.g., Issue #2 branched off `issue-1-db-schema`).
2. **Merge Order Recommendation:** A numbered sequence for merging pull requests to prevent conflicts or broken builds.
3. **Approved Naming Standard:**
   ```text
   issue-<number>-<short-descriptive-slug>
   ```

---

## 🚀 Stage 4: Autonomous Execution & Human Review

During implementation:

1. **Clean Branch Creation:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b issue-<number>-<slug>
   ```
2. **Execution Circuit Breaker:**
   * After writing code, run automated verification:
     ```bash
     npm run build
     ```
   * If the build fails, the agent may attempt a fix up to **3 times maximum**.
   * On the 3rd failure, the agent must **pause**, revert breaking changes, and post a diagnostic comment detailing the failure.
3. **Pull Request Submission:**
   Once `npm run build` succeeds cleanly, open the PR:
   ```bash
   gh pr create --title "[TASK]: <Title>" --body "Closes #<number>. Automated verification passed."
   ```
4. **Human-in-the-Loop Verification:**
   * The developer checks out the branch, verifies the UI/UX visually, and merges following the approved merge order.
