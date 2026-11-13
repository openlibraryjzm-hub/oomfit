---
name: Autonomous Task Spec
about: Task specification for autonomous AI agent implementation
title: "[TASK]: "
labels: ["autonomous-task"]
---

## 🎯 Objective
<!-- Brief summary of what this issue solves or builds -->

## 📝 Raw Intent / Context
<!-- What prompted this change, user story, or messy thought snippet -->

## ✅ "Done When" (Acceptance Criteria)
<!-- Concrete, verifiable conditions. The AI agent stops when all of these are satisfied -->
- [ ] 
- [ ] Automated verification passes (`npm run build`)

## 🛑 Out of Scope
<!-- What should the AI explicitly NOT touch or build in this issue -->

## ⚠️ Known Constraints & Fragile Areas
<!-- Next.js 16 conventions, database schemas, or existing patterns to respect -->

## 🛡️ Circuit Breaker & Execution Rules
- **Rule:** 1 Issue = 1 Branch = 1 Pull Request
- **Target Branch Name:** `issue-<number>-<short-slug>`
- **Max Attempts:** 3 failed build/test cycles before pausing dev and posting a diagnostic comment.
