# Issue Ingestion Guide: Parsing Messy Prompts into Atomic Issues

This guide defines the universal heuristics for parsing unstructured, messy developer prompts into clean, atomic GitHub issues. It is completely project-agnostic and can be dropped into any software repository.

---

## 🏛️ The Golden Contract

1. **1 Issue = 1 Branch = 1 Pull Request:** Every issue must represent a single, bounded deliverable.
2. **Binary "Done When" Criteria:** Every acceptance criterion must be an indisputable Yes/No test.
3. **Out of Scope Electric Fence:** Every issue must define what is explicitly deferred to protect against scope creep.
4. **Autonomous Circuit Breaker:** Max 3 attempts on failed build/tests before pausing and asking for human guidance.

---

## ✂️ The 4 Litmus Tests: When to Split a Prompt into Multiple Issues

When an AI receives a long, stream-of-consciousness prompt, it must evaluate the request against these 4 tests. If **any** test triggers, the prompt **must be split into separate issues**.

### 1. The Independent Deployability Test
* **Question:** *Can Feature A be shipped to production and provide value on its own, without Feature B?*
* **Rule:** If Feature A and Feature B can exist independently, **split them into separate issues**.
* **Example:** *"I want a search bar with auto-complete and also a dark mode toggle."* $\rightarrow$ Two separate issues.

### 2. The Architectural Layer Test
* **Question:** *Does this prompt touch multiple distinct architectural layers (e.g. Database / Data Schema vs. API / Backend Logic vs. Frontend UI)?*
* **Rule:** Cross-layer work should be split so the underlying data layer is established and verified before UI layers consume it.
* **Example:** *"Add user bookmarks."* $\rightarrow$
  * Issue A: Data model / storage persistence for bookmarks.
  * Issue B: User-facing bookmark UI button and display view.

### 3. The Verification Cohesion Test
* **Question:** *Can all "Done When" criteria be tested and verified in a single coherent flow?*
* **Rule:** If verifying the changes requires navigating to completely different parts of the application or running unrelated testing suites, **split them**.
* **Example:** *"Fix the checkout validation and update the footer copyright links."* $\rightarrow$ Two separate issues.

### 4. The Blast Radius (Diff Budget) Test
* **Question:** *Will the implementation likely touch more than 4–5 files or exceed ~200–300 lines of changed code?*
* **Rule:** If the estimated footprint exceeds this budget, **split it into smaller sequential slices**.
* **Why:** Smaller diffs keep AI models focused, prevent hallucinated refactors, and make human review effortless.

---

## 🤝 The AI Ingestion Protocol

When an AI receives a messy prompt, it must **never** silently assume a monolithic issue if multiple concerns exist. It must follow this protocol:

1. **Analyze:** Run the 4 Litmus Tests against the prompt.
2. **Propose the Split:** If multiple issues are detected, present the proposed breakdown to the developer first:
   * **Issue 1:** [Title + 1-sentence Objective]
   * **Issue 2:** [Title + 1-sentence Objective (and note if it depends on Issue 1)]
3. **Wait for Approval:** Once the developer approves the split (or adjusts it), format each issue using the repository's issue template (`.github/ISSUE_TEMPLATE/autonomous_task.md`) and publish via GitHub CLI (`gh issue create`).
