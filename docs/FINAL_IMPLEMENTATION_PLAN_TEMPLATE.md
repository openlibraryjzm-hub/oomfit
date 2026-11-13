# 🗺️ Final Implementation Plan: [Milestone / Batch Name]

## 📋 Executive Summary
<!-- 2-4 sentences explaining what this plan achieves, why it's being built, and the desired end-state. Written so a fresh agent or human understands the full picture immediately. -->

---

## 🎯 Issues in Scope
- [ ] **Issue #[X]:** [Title]
- [ ] **Issue #[Y]:** [Title]

---

## 🔀 Merge Topology & Order Recommendation
<!-- The precise sequence of branches and merges to prevent conflicts. -->
1. **Branch 1:** `issue-[X]-[slug]` (Branched from: `main`)
   - Type: `Parallel`
   - Merge Target: `main`
2. **Branch 2:** `issue-[Y]-[slug]` (Branched from: `updated main` OR `stacked on issue-X`)
   - Type: `Sequential` / `Stacked`
   - Merge Target: `main`

---

## 🤖 Worker Delegation Manifest & Dispatch Standard

### 📋 Standard Dispatch Formula for Main Agent
When summoning each background worker (e.g. via `invoke_subagent`), the Main Agent must construct the worker prompt using this exact structure:
```text
You are [Worker ID]. Your mission is to implement Issue #[Issue #].
1. WORK ORDER: Run `gh issue view [Issue #]` to read your full specification.
2. IRONCLAD RULES OF ENGAGEMENT:
   - Your sole definition of success is satisfying every checkbox in `## ✅ Done When`.
   - The `## 🛑 Out of Scope` section is an electric fence: you are strictly forbidden from building those features or touching those files.
   - Circuit Breaker: You have a hard limit of 3 consecutive failed `npm run build` attempts. If you fail 3 times, immediately halt and report the blocker.
3. CONTEXT DOCS: Read [Assigned Context Docs] before editing.
4. GIT WORKFLOW:
   - Checkout base branch `[Base Branch]` and create working branch `[Working Branch]`.
   - Edit only: [Target Files].
   - Verify with: `npm run build`.
   - Submit PR titled `[TASK]: [Title]` closing Issue #[Issue #] and report back.
```

---

### Worker 1: `[worker-id-slug]`
- **Assigned Task:** Issue #[X] — [Short Title]
- **Base Branch:** `main`
- **Working Branch:** `issue-[X]-[slug]`
- **Workspace Isolation:** `branch` (isolated clone)
- **Target Files:** `[List of files]`
- **Assigned Context Docs:** `[docs/example.md]`
- **Done When:**
  - Satisfies all Issue #[X] acceptance criteria
  - Automated check passes: `npm run build`
  - Submits PR #[X] and notifies Lead Agent
- **Circuit Breaker:** Max 3 build attempts before pausing.

### Worker 2: `[worker-id-slug]`
- **Assigned Task:** Issue #[Y] — [Short Title]
- **Base Branch:** [e.g. waits for Issue #X merge]
- **Working Branch:** `issue-[Y]-[slug]`
- **Workspace Isolation:** `branch`
- **Target Files:** `[List of files]`
- **Assigned Context Docs:** `[docs/example.md]`
- **Done When:**
  - Satisfies all Issue #[Y] acceptance criteria
  - Automated check passes: `npm run build`
  - Submits PR #[Y] and notifies Lead Agent
- **Circuit Breaker:** Max 3 build attempts before pausing.

---

## 📚 Holistic Documentation Plan
<!-- Evaluated against the 3-Tier Documentation Standard:
     Tier 1: Incremental change -> Update existing doc
     Tier 2: Brand new route/page -> Create docs/<route>.md
     Tier 3: Platform subsystem -> Create docs/<subsystem>.md -->

### ✏️ Existing Docs to Update
- **`docs/[existing-doc].md`**: [Brief overview of what section needs updating]

### 📄 Brand New Docs to Create (3-Tier Standard)
- **`docs/[new-doc].md`**: [Reason: Triggered Tier 2 (New route) or Tier 3 (New subsystem). Overview of what it will document.]

### 📑 Master Index Sync
- [ ] Update `docs/README.md` to reference newly created documentation.

---

## 👤 Human Verification & Signoff Checklist
<!-- The manual visual/UI testing steps for the developer after all PRs are submitted. -->
- [ ] Checkout Branch 1 ──► verify UI/UX in browser ──► approve & merge.
- [ ] Checkout Branch 2 ──► verify UI/UX in browser ──► approve & merge.
- [ ] Verify production build: `npm run build` on merged `main`.
