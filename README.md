# Task Manager API — Take-Home Assignment

A small REST API for managing tasks.

## API Endpoints

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/tasks`                 | Get all tasks            |
| GET    | `/tasks?status=todo`     | Filter tasks by status   |
| GET    | `/tasks?page=1&limit=10` | Paginate tasks           |
| POST   | `/tasks`                 | Create a task            |
| PUT    | `/tasks/:id`             | Update a task            |
| DELETE | `/tasks/:id`             | Delete a task            |
| PATCH  | `/tasks/:id/complete`    | Mark a task as completed |
| PATCH  | `/tasks/:id/assign`      | Assign a task            |
| GET    | `/tasks/stats`           | Get task statistics      |

## Task Structure

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "todo | in_progress | done",
  "priority": "low | medium | high",
  "dueDate": "ISO string | null",
  "completedAt": "ISO string | null",
  "createdAt": "ISO string"
}
```

Assigned tasks additionally contain:

```json
{
  "assignee": "string"
}
```

## Installation

```bash
cd task-api
npm install
```

## Run the API

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

## Run Tests

```bash
npm test
```

## Run Tests with Coverage

```bash
npm run coverage
```

The coverage report is generated in:

```text
coverage/lcov-report/index.html
```

Open `index.html` in a browser to view the detailed coverage report.

## Testing

The test suite includes:

* Unit tests for `taskService.js`
* Integration tests for API routes using Supertest
* Validation tests
* Happy-path scenarios
* Missing-resource scenarios
* Invalid input scenarios
* Pagination edge cases
* Task assignment scenarios
* Already-assigned task handling

The target for the assignment is **80%+ test coverage**.

## Bug Found and Fixed

### Pagination Offset Bug

The original pagination logic calculated the offset as:

```js
const offset = page * limit;
```

This caused page 1 to skip the first set of tasks.

It was fixed to:

```js
const offset = (page - 1) * limit;
```

Now:

```text
?page=1&limit=2 → First 2 tasks
?page=2&limit=2 → Next 2 tasks
```

Additional issues discovered during testing are documented in `BUG_REPORT.md`.

## Task Assignment Feature

### Endpoint

```http
PATCH /tasks/:id/assign
```

### Request

```json
{
  "assignee": "Alice"
}
```

### Behavior

* `200` — task successfully assigned
* `400` — invalid or empty assignee
* `404` — task does not exist
* `409` — task is already assigned

## Project Structure

```text
task-api/
├── src/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── tests/
│   ├── taskService.test.js
│   ├── tasks.routes.test.js
│   └── validators.test.js
├── BUG_REPORT.md
├── SUBMISSION_NOTE.md
├── package.json
└── README.md
```

## Future Improvements

If more time were available, I would add:

* Tests for invalid pagination values
* Malformed JSON handling
* Larger dataset testing
* More API response schema validation
* Persistent database storage
* Authentication and authorization
* API documentation using Swagger/OpenAPI

## Production Considerations

Before shipping to production, I would clarify:

1. Whether task reassignment should be allowed.
2. Whether completing a task should preserve its priority.
3. Expected limits for pagination parameters.
4. Whether status and priority values should be case-sensitive.
5. Whether the in-memory store will be replaced with a persistent database.

## Author

**Deepanshu Lomas**
