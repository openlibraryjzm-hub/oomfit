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

## 🛑 Out of Scope
<!-- The electric fence: what the AI must explicitly NOT touch or build -->

## 🛡️ Autonomous Execution Contract
- **Rule:** 1 Issue = 1 Branch = 1 Pull Request
- **Branch:** `issue-<number>-<short-slug>`
- **Circuit Breaker:** Max 3 attempts on failed build/test before pausing dev and posting a blocker comment.
