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
<!-- Explicit boundaries: related features or logical extensions deliberately deferred to keep this ticket atomic. Examples: -->
- Backend persistence or database schema changes (e.g. keeping to client state / mock data for this ticket).
- Secondary screens or downstream workflows (e.g. if adding a "bookmark" button, building a full "saved bookmarks" dashboard is out of scope).
- Visual redesigns or refactoring of adjacent components outside this feature's footprint.

## 🛡️ Autonomous Execution Contract
- **Rule:** 1 Issue = 1 Branch = 1 Pull Request
- **Branch:** `issue-<number>-<short-slug>`
- **Circuit Breaker:** Max 3 attempts on failed build/test before pausing dev and posting a blocker comment.
