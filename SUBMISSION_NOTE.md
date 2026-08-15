# Submission Note

## What I would test next

I would add tests for malformed JSON, unusual pagination values (negative/zero page and limit), very large datasets, concurrent updates, and the behavior of invalid/expired due dates. I would also add tests around API error handling and the exact response schema.

## What surprised me

The API is small and easy to follow, but a couple of subtle behavior issues are easy to miss without tests. In particular, pagination used an off-by-one offset and status filtering used partial matching instead of exact status matching.

## Questions before shipping to production

1. Should assigning an already-assigned task be rejected, or should reassignment be allowed?
2. Should completing a task preserve its priority, or intentionally reset it to `medium`?
3. What are the expected bounds and error responses for invalid `page` and `limit` values?
4. Should status and priority values be case-sensitive?
5. Will the in-memory store be replaced by a persistent database before production?
