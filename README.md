# Task Manager API

A RESTful Task Manager API. This project focuses on API functionality, automated testing, bug detection, bug fixing, and feature development.


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
  "createdAt": "ISO string",
  "assignee": "string"
}
```

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/dLomas26/Underpin.git
cd Underpin
npm install
```

## Run the Application

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

## Run Tests

Run the complete test suite:

```bash
npm test
```

## Run Tests with Coverage

```bash
npm run coverage
```

The detailed HTML coverage report is generated at:

```text
coverage/lcov-report/index.html
```

Open `index.html` in a browser to view line-by-line coverage.

## Testing

The project includes:

* Unit tests for the task service
* Integration tests for API routes using Supertest
* Validation tests
* Happy-path tests
* Error-handling tests
* Edge-case tests
* Pagination tests
* Task assignment tests
* Already-assigned task tests

The project targets **80%+ test coverage**.

## Bug Found and Fixed

### Pagination Offset Bug

The original pagination implementation used:

```js
const offset = page * limit;
```

This caused the first page to skip tasks.

It was fixed to:

```js
const offset = (page - 1) * limit;
```

Now:

```text
?page=1&limit=2 → First 2 tasks
?page=2&limit=2 → Next 2 tasks
```

Additional bugs and observations are documented in:

```text
BUG_REPORT.md
```

## Task Assignment

A new endpoint was added to assign a task to a user.

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

### Response Behavior

| Status | Description                |
| ------ | -------------------------- |
| 200    | Task successfully assigned |
| 400    | Invalid or empty assignee  |
| 404    | Task does not exist        |
| 409    | Task is already assigned   |

## Project Structure

```text
Underpin/
│
├── src/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
│
├── tests/
│   ├── taskService.test.js
│   ├── tasks.routes.test.js
│   └── validators.test.js
│
├── coverage/
│   └── lcov-report/
│
├── BUG_REPORT.md
├── SOLUTION_README.md
├── SUBMISSION_NOTE.md
├── jest.config.js
├── package.json
└── package-lock.json
```

## Documentation

| File                 | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `BUG_REPORT.md`      | Documents bugs discovered during testing               |
| `SUBMISSION_NOTE.md` | Final assignment observations and production questions |
| `SOLUTION_README.md` | Additional solution details                            |

## Future Improvements

* Add more validation for pagination parameters
* Improve API response schema validation
* Add malformed JSON handling
* Add persistent database storage
* Add authentication and authorization
* Add Swagger/OpenAPI documentation
* Add CI/CD pipeline with automated testing

## Production Considerations

Before deploying to production, I would clarify:

1. Whether task reassignment should be allowed.
2. Whether completing a task should preserve its priority.
3. Valid ranges for pagination parameters.
4. Whether status and priority values should be case-sensitive.
5. Whether the in-memory store should be replaced with a persistent database.

## Author

**Deepanshu Lomas**

GitHub: [@dLomas26](https://github.com/dLomas26)
