const taskService = require('../src/services/taskService');

describe('taskService', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('create/find/getAll', () => {
    test('creates a task with defaults', () => {
      const task = taskService.create({ title: 'Learn Jest' });

      expect(task).toMatchObject({
        title: 'Learn Jest',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
        completedAt: null,
      });
      expect(task.id).toEqual(expect.any(String));
      expect(task.createdAt).toEqual(expect.any(String));
      expect(taskService.findById(task.id)).toEqual(task);
    });

    test('getAll returns a copy of the collection', () => {
      taskService.create({ title: 'A' });
      const all = taskService.getAll();

      expect(all).toHaveLength(1);
      all.pop();
      expect(taskService.getAll()).toHaveLength(1);
    });
  });

  describe('getByStatus', () => {
    test('returns tasks with the requested status', () => {
      taskService.create({ title: 'A', status: 'todo' });
      taskService.create({ title: 'B', status: 'done' });

      expect(taskService.getByStatus('todo')).toHaveLength(1);
      expect(taskService.getByStatus('todo')[0].title).toBe('A');
    });

    test('does not treat a partial status string as a valid status filter', () => {
      taskService.create({ title: 'A', status: 'in_progress' });

      expect(taskService.getByStatus('progress')).toEqual([]);
    });
  });

  describe('getPaginated', () => {
    beforeEach(() => {
      ['A', 'B', 'C', 'D', 'E'].forEach((title) => {
        taskService.create({ title });
      });
    });

    test('page 1 starts with the first task', () => {
      expect(taskService.getPaginated(1, 2).map(t => t.title)).toEqual(['A', 'B']);
    });

    test('page 2 returns the next page', () => {
      expect(taskService.getPaginated(2, 2).map(t => t.title)).toEqual(['C', 'D']);
    });

    test('returns an empty page beyond the end', () => {
      expect(taskService.getPaginated(10, 2)).toEqual([]);
    });
  });

  describe('stats', () => {
    test('counts statuses and overdue unfinished tasks', () => {
      taskService.create({
        title: 'Overdue',
        status: 'todo',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
      });
      taskService.create({ title: 'Progress', status: 'in_progress' });
      taskService.create({
        title: 'Done',
        status: 'done',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
      });

      expect(taskService.getStats()).toEqual({
        todo: 1,
        in_progress: 1,
        done: 1,
        overdue: 1,
      });
    });
  });

  describe('update/remove/complete/assign', () => {
    test('updates an existing task', () => {
      const task = taskService.create({ title: 'Old', priority: 'low' });
      const updated = taskService.update(task.id, { title: 'New' });

      expect(updated.title).toBe('New');
      expect(updated.priority).toBe('low');
    });

    test('returns null when updating a missing task', () => {
      expect(taskService.update('missing', { title: 'X' })).toBeNull();
    });

    test('removes an existing task', () => {
      const task = taskService.create({ title: 'Delete me' });

      expect(taskService.remove(task.id)).toBe(true);
      expect(taskService.findById(task.id)).toBeUndefined();
      expect(taskService.remove(task.id)).toBe(false);
    });

    test('completes an existing task', () => {
      const task = taskService.create({ title: 'Finish me', priority: 'high' });
      const completed = taskService.completeTask(task.id);

      expect(completed.status).toBe('done');
      expect(completed.completedAt).toEqual(expect.any(String));
    });

    test('returns null when completing a missing task', () => {
      expect(taskService.completeTask('missing')).toBeNull();
    });

    test('assigns an existing task', () => {
      const task = taskService.create({ title: 'Assign me' });
      const assigned = taskService.assignTask(task.id, 'Alice');

      expect(assigned.assignee).toBe('Alice');
    });

    test('returns null when assigning a missing task', () => {
      expect(taskService.assignTask('missing', 'Alice')).toBeNull();
    });
  });
});
