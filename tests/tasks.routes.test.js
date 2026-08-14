const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task API routes', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('POST /tasks', () => {
    test('creates a task', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Build API', priority: 'high' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: 'Build API',
        priority: 'high',
        status: 'todo',
      });
      expect(res.body.id).toEqual(expect.any(String));
    });

    test('rejects a missing title', async () => {
      const res = await request(app).post('/tasks').send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/title is required/i);
    });

    test('rejects an invalid status', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'X', status: 'blocked' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /tasks', () => {
    test('lists all tasks', async () => {
      await request(app).post('/tasks').send({ title: 'A' });
      await request(app).post('/tasks').send({ title: 'B' });

      const res = await request(app).get('/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    test('filters by status', async () => {
      await request(app).post('/tasks').send({ title: 'A', status: 'todo' });
      await request(app).post('/tasks').send({ title: 'B', status: 'done' });

      const res = await request(app).get('/tasks?status=done');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].status).toBe('done');
    });

    test('does not accept a partial status as an exact status filter', async () => {
      await request(app).post('/tasks').send({ title: 'A', status: 'in_progress' });

      const res = await request(app).get('/tasks?status=progress');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test('paginates page 1 correctly', async () => {
      for (const title of ['A', 'B', 'C']) {
        await request(app).post('/tasks').send({ title });
      }

      const res = await request(app).get('/tasks?page=1&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.map(t => t.title)).toEqual(['A', 'B']);
    });

    test('paginates page 2 correctly', async () => {
      for (const title of ['A', 'B', 'C']) {
        await request(app).post('/tasks').send({ title });
      }

      const res = await request(app).get('/tasks?page=2&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.map(t => t.title)).toEqual(['C']);
    });

    test('returns stats', async () => {
      await request(app).post('/tasks').send({ title: 'A' });
      await request(app).post('/tasks').send({ title: 'B', status: 'done' });

      const res = await request(app).get('/tasks/stats');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        todo: 1,
        in_progress: 0,
        done: 1,
        overdue: 0,
      });
    });
  });

  describe('PUT /tasks/:id', () => {
    test('updates a task', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'Old' });

      const res = await request(app)
        .put(`/tasks/${created.body.id}`)
        .send({ title: 'New', priority: 'high' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('New');
      expect(res.body.priority).toBe('high');
    });

    test('returns 404 for a missing task', async () => {
      const res = await request(app)
        .put('/tasks/not-found')
        .send({ title: 'New' });

      expect(res.status).toBe(404);
    });

    test('rejects an invalid update', async () => {
      const created = await request(app).post('/tasks').send({ title: 'A' });

      const res = await request(app)
        .put(`/tasks/${created.body.id}`)
        .send({ priority: 'urgent' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('deletes a task', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Delete' });

      const res = await request(app).delete(`/tasks/${created.body.id}`);

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });

    test('returns 404 for a missing task', async () => {
      const res = await request(app).delete('/tasks/not-found');

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    test('marks a task complete', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'Complete me' });

      const res = await request(app)
        .patch(`/tasks/${created.body.id}/complete`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('done');
      expect(res.body.completedAt).toEqual(expect.any(String));
    });

    test('returns 404 for a missing task', async () => {
      const res = await request(app)
        .patch('/tasks/not-found/complete');

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /tasks/:id/assign', () => {
    test('assigns a task and returns the updated task', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'Assign me' });

      const res = await request(app)
        .patch(`/tasks/${created.body.id}/assign`)
        .send({ assignee: 'Alice' });

      expect(res.status).toBe(200);
      expect(res.body.assignee).toBe('Alice');
    });

    test('returns 404 when the task does not exist', async () => {
      const res = await request(app)
        .patch('/tasks/not-found/assign')
        .send({ assignee: 'Alice' });

      expect(res.status).toBe(404);
    });

    test('rejects an empty assignee', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Assign me' });

      const res = await request(app)
        .patch(`/tasks/${created.body.id}/assign`)
        .send({ assignee: '   ' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/assignee is required/i);
    });

    test('rejects a non-string assignee', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Assign me' });

      const res = await request(app)
        .patch(`/tasks/${created.body.id}/assign`)
        .send({ assignee: 123 });

      expect(res.status).toBe(400);
    });

    test('returns 409 when the task is already assigned', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Assign me' });

      await request(app)
        .patch(`/tasks/${created.body.id}/assign`)
        .send({ assignee: 'Alice' });

      const res = await request(app)
        .patch(`/tasks/${created.body.id}/assign`)
        .send({ assignee: 'Bob' });

      expect(res.status).toBe(409);
    });
  });
});
