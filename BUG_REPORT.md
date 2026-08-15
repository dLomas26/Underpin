# Bug Report

## Bug 1 — Pagination starts from the wrong offset

**Expected behavior:** `GET /tasks?page=1&limit=2` should return the first two tasks, and page 2 should return the next two.

**Actual behavior:** The service calculated `offset = page * limit`, so page 1 started at index 2 and skipped the first page.

**How discovered:** The pagination unit/integration tests expected page 1 to contain the first two created tasks. The original implementation returned later tasks instead.

**Fix:** Changed the calculation to:
```js
const offset = (page - 1) * limit;
```

## Bug 2 — Status filtering performs partial matching

**Expected behavior:** The documented `status` filter should match one of the task statuses (`todo`, `in_progress`, or `done`) exactly.

**Actual behavior:** `getByStatus()` used `t.status.includes(status)`, meaning a query such as `status=progress` could match `in_progress`.

**How discovered:** An edge-case test requested `status=progress` and expected no results.

**Suggested fix:** Use exact equality:
```js
const getByStatus = (status) => tasks.filter((t) => t.status === status);
```

This fix is intentionally left as a second reported bug so the assignment's requirement to fix one bug is demonstrated separately.

## Observation — Completing a task changes priority

`completeTask()` currently forces `priority` to `medium`. The API description says the endpoint marks a task as complete; it does not state that completion should alter priority. I would clarify this requirement with the product owner before changing it. If priority is meant to remain unchanged, this should be covered by a regression test and fixed.
