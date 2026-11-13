---
name: Autonomous Task Spec
about: Atomic task specification for autonomous coding
title: "[TASK]: "
labels: ["autonomous-task"]
---

## 🎯 Objective
<!-- 1-2 sentence summary of what to build or fix and why -->

## ✅ "Done When" (Acceptance Criteria)
<!-- Concrete, binary checklist. AI stops when these are satisfied -->
- [ ] 
- [ ] Automated check passes: `npm run build`

## 🛑 What NOT to Do
<!-- Replace/overwrite with task-specific boundaries (scope fences & code anti-patterns). Examples: -->
- Do not build extra features or touch files outside the direct task footprint.
- Do not introduce new external npm packages when native Tailwind / standard APIs suffice.
- Do not modify database schemas or backend APIs unless explicitly requested in the Objective.

## 🛡️ Autonomous Execution Contract
- **Rule:** 1 Issue = 1 Branch = 1 Pull Request
- **Branch:** `issue-<number>-<short-slug>`
- **Circuit Breaker:** Max 3 attempts on failed build/test before pausing dev and posting a blocker comment.
