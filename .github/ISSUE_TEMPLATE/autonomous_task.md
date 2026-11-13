---
name: Autonomous Task Spec
about: Atomic task specification for autonomous coding
title: "[TASK]: "
labels: ["autonomous-task"]
---

## 🎯 Objective
<!-- 1-2 sentence summary of what this issue solves or builds -->

## 📝 Raw Intent & Context
<!-- The user story, problem snippet, or messy thought that inspired this -->

## 🔗 Prerequisites & Dependencies
<!-- Does this require another issue to be completed first? (e.g. "None", or "Requires #12") -->

## ✅ "Done When" (Acceptance Criteria)
<!-- Concrete, testable checklist. When all are checked, dev halts -->
- [ ] 
- [ ] Automated check passes: `npm run build`

## 🛑 Out of Scope
<!-- What should definitely NOT be touched or built in this task -->

## 🔒 Invariants & Guardrails
<!-- User experience or product rules that must not be broken (e.g. "Preserve classic Yotsuba beige theme") -->

## 🛡️ Autonomous Execution Contract
- **Rule:** 1 Issue = 1 Branch = 1 Pull Request
- **Branch:** `issue-<number>-<short-slug>`
- **Circuit Breaker:** Max 3 attempts on failed build/test before pausing dev and posting a blocker comment.
