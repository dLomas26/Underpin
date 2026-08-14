const {
  validateCreateTask,
  validateUpdateTask,
  validateAssignTask,
} = require('../src/utils/validators');

describe('validators', () => {
  describe('validateCreateTask', () => {
    test('accepts valid input', () => {
      expect(validateCreateTask({
        title: 'Task',
        status: 'todo',
        priority: 'high',
        dueDate: new Date().toISOString(),
      })).toBeNull();
    });

    test.each([
      [{ title: '' }, /title/],
      [{ title: 123 }, /title/],
      [{ title: 'A', status: 'bad' }, /status/],
      [{ title: 'A', priority: 'bad' }, /priority/],
      [{ title: 'A', dueDate: 'not-a-date' }, /dueDate/],
    ])('rejects invalid create input %#', (body, message) => {
      expect(validateCreateTask(body)).toMatch(message);
    });
  });

  describe('validateUpdateTask', () => {
    test('accepts an empty partial update', () => {
      expect(validateUpdateTask({})).toBeNull();
    });

    test('rejects invalid fields', () => {
      expect(validateUpdateTask({ title: ' ', status: 'bad' })).toMatch(/title/);
      expect(validateUpdateTask({ priority: 'bad' })).toMatch(/priority/);
      expect(validateUpdateTask({ dueDate: 'bad' })).toMatch(/dueDate/);
    });
  });

  describe('validateAssignTask', () => {
    test('accepts a non-empty string', () => {
      expect(validateAssignTask({ assignee: 'Alice' })).toBeNull();
    });

    test('rejects missing, empty and non-string assignees', () => {
      expect(validateAssignTask({})).toMatch(/assignee/);
      expect(validateAssignTask({ assignee: ' ' })).toMatch(/assignee/);
      expect(validateAssignTask({ assignee: 42 })).toMatch(/assignee/);
    });
  });
});
