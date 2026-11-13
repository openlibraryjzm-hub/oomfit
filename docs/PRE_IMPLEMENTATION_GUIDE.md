# Pre-Implementation Assessment & Planning Guide

This document defines how an AI agent must assess a batch of issues against active runtime constraints, determine whether multiple architectural strategies are required, and construct a deterministic pre-implementation plan.

---

## 🎛️ Active Execution & Capacity Profile
*(Edit this section whenever you alter your model, tooling, or workflow configuration. The AI skims this block to calibrate its execution strategy.)*

```yaml
# === CURRENT RUNTIME CONFIGURATION ===
active_model:
  name: "Gemini 3.8 Flash" # e.g. Flash, Pro, Claude Sonnet, etc.
  context_preference: "Bounded" # Bounded (frequent fresh context) | Deep Context

session_architecture:
  mode: "Single Session" # Options:
  # - "Single Session": Sequential execution within the current active chat.
  # - "Fresh Session Per Issue": Each issue branch tackled in a pristine, new conversation.
  # - "Subagent Delegation": Parent coordinator delegates branches to background workers.

autonomy_directive:
  loop_mode: "Autonomous Pipeline (Overnight / Unattended)" # Options:
  # - "Interactive Handoff": Propose diff/branch -> human tests & approves before next.
  # - "Autonomous Pipeline (Overnight / Unattended)": Coordinator sequences workers, auto-merges on clean build, halts on failure.
  # - "Goal-Seeking (/goal)": Autonomous loop until acceptance criteria or circuit breaker triggers.

verification_gate:
  command: "npm run build" # Local compilation/typecheck command to verify health.
  circuit_breaker_limit: 3 # Max consecutive failed build attempts before mandatory pause.
```

---

## ⚖️ The Deterministic Strategy Matrix: Fast-Track vs. Multi-Strategy

The AI **must never** subjectively decide whether to present multiple approaches based on a whim. It must evaluate the requested issues against this **Tri-Check Matrix**:

| Check | Litmus Condition | Result if Triggered |
|---|---|---|
| **1. File Collision** | Do 2 or more selected issues edit or refactor the **exact same source file(s)**? | **Mandatory Multi-Strategy** |
| **2. Combined Blast Radius** | Does the cumulative implementation exceed **~300 lines of estimated diff** or **> 4 files**? | **Mandatory Multi-Strategy** |
| **3. Architectural Ambiguity** | Are there 2+ viable, divergent implementation patterns (e.g., pure CSS vs. state engine, local state vs. persistent storage)? | **Mandatory Multi-Strategy** |
| **4. Fast-Track Pass** | **Single issue**, OR independent issues touching **completely distinct files** with **< 200 lines total diff** and zero architectural ambiguity. | **Fast-Track Direct Plan** |

* If **Checks 1, 2, or 3** trigger $\to$ The AI **must present at least 2 distinct approaches with tradeoffs**.
* If **Check 4** passes all conditions $\to$ The AI **skips the debate and provides a single, optimal implementation plan**.

---

## 📐 Standard Strategy Presentation Formats

### Format A: When Multi-Strategy Triggers

When multiple strategies are required, present them using this structure:

```markdown
### 🔍 Assessment Findings
- **Collision Check:** [e.g. Issues #2 and #3 both touch `src/app/page.tsx`]
- **Blast Radius Estimate:** [~X lines across Y files]
- **Triggered Matrix Rule:** [File Collision / Blast Radius / Architectural Ambiguity]

---

### Strategy 1: [Descriptive Name, e.g., Safe Sequential with Isolated PRs]
- **Concept:** [1-2 sentences on how it structures the work]
- **Branch Topology:** [Parallel from main vs. Stacked branch]
- **Tradeoffs:**
  - 🟢 **Pros:** [Why this approach is safe, performant, or clean]
  - 🔴 **Cons:** [What overhead, delay, or extra steps it introduces]

### Strategy 2: [Descriptive Name, e.g., Stacked Unified Foundation]
- **Concept:** [1-2 sentences on how it structures the work]
- **Branch Topology:** [e.g. `issue-2` branches off `main`; `issue-3` stacks on `issue-2`]
- **Tradeoffs:**
  - 🟢 **Pros:** [Direct reuse of newly refactored components]
  - 🔴 **Cons:** [Dependency risk; Issue #3 cannot merge until #2 merges]

---

### 💡 Recommendation & Required Decision
[AI states its top recommendation based on the Active Capacity Profile, and prompts the user to select Strategy 1 or Strategy 2.]
```

---

### Format B: When Fast-Track Passes

When all checks pass Check 4, present the direct plan:

```markdown
### ⚡ Fast-Track Execution Plan
- **Scope:** [Issue #X / Verified non-colliding batch]
- **Target Branch:** `issue-<number>-<slug>` (branched from `main`)
- **Key Files Touched:** [List 1-3 files]
- **Verification Plan:**
  1. [Specific code modification]
  2. [Passes verification command: `npm run build`]
  3. [Ready for human UI/UX testing]
```
