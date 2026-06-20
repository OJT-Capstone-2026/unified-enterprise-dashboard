import StorageManager from '../../modules/storageManager.js';
import NotificationManager from '../../modules/notificationManager.js';
import { initDragDrop } from './dragdrop.js';
import { getDefaultBoard } from './board.js';

const COLUMN_LABELS = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done'
};

const Kanban = {
  getBoard() {
    return StorageManager.get('kanban_board', getDefaultBoard());
  },

  render() {
    const board = this.getBoard();
    return `
      <div class="page-header">
        <h1>Kanban Board</h1>
        <p>Organize tasks and track project progress with drag-and-drop workflow.</p>
      </div>

      <div class="flex justify-between mb-6">
        <button class="btn btn-primary" id="add-task-btn"><i class="fas fa-plus"></i> Add Task</button>
        <div class="flex gap-3">
          <span class="badge badge-primary">${board.tasks.length} tasks</span>
          <span class="badge badge-success">${board.tasks.filter(t => t.column === 'done').length} done</span>
        </div>
      </div>

      <div class="kanban-board" id="kanban-board">
        ${Object.entries(COLUMN_LABELS).map(([key, label]) => `
          <div class="kanban-column" data-column="${key}">
            <div class="kanban-column-header">
              <span>${label}</span>
              <span class="badge badge-primary">${board.tasks.filter(t => t.column === key).length}</span>
            </div>
            <div class="kanban-cards" data-column="${key}">
              ${board.tasks.filter(t => t.column === key).map(t => this._renderCard(t)).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="modal" id="task-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">New Task</h3>
            <button class="modal-close" id="modal-close">✕</button>
          </div>
          <form id="task-form">
            <div class="form-group">
              <label>Title</label>
              <input type="text" id="task-title" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select id="task-priority" class="form-control">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Create Task</button>
          </form>
        </div>
      </div>
    `;
  },

  _renderCard(task) {
    const priorityColors = { low: 'badge-primary', medium: 'badge-warning', high: 'badge-danger' };
    return `
      <div class="kanban-card" draggable="true" data-id="${task.id}">
        <div class="kanban-card-title">${task.title}</div>
        <div class="kanban-card-meta">
          <span class="badge ${priorityColors[task.priority]}">${task.priority}</span>
          <button class="btn btn-sm" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:0;" data-delete="${task.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  },

  onRoute() {
    initDragDrop((taskId, newColumn) => {
      const board = this.getBoard();
      const task = board.tasks.find(t => t.id === taskId);
      if (task) {
        task.column = newColumn;
        StorageManager.set('kanban_board', board);
        NotificationManager.info(`Moved "${task.title}" to ${COLUMN_LABELS[newColumn]}`);
      }
    });

    document.getElementById('add-task-btn')?.addEventListener('click', () => {
      document.getElementById('task-modal').classList.add('active');
    });

    document.getElementById('modal-close')?.addEventListener('click', () => {
      document.getElementById('task-modal').classList.remove('active');
    });

    document.getElementById('task-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('task-title').value.trim();
      const priority = document.getElementById('task-priority').value;
      if (!title) return;

      const board = this.getBoard();
      board.tasks.push({
        id: Date.now().toString(),
        title, priority,
        column: 'todo',
        createdAt: new Date().toISOString()
      });
      StorageManager.set('kanban_board', board);
      document.getElementById('task-modal').classList.remove('active');
      NotificationManager.success('Task created');
      document.getElementById('page-content').innerHTML = this.render();
      this.onRoute();
    });

    document.getElementById('kanban-board')?.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[data-delete]');
      if (!deleteBtn) return;
      const id = deleteBtn.dataset.delete;
      const board = this.getBoard();
      board.tasks = board.tasks.filter(t => t.id !== id);
      StorageManager.set('kanban_board', board);
      document.getElementById('page-content').innerHTML = this.render();
      this.onRoute();
    });
  }
};

export default Kanban;
