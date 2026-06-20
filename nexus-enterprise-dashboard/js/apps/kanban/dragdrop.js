let draggedId = null;

export function initDragDrop(onDrop) {
  document.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedId = card.dataset.id;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      draggedId = null;
    });
  });

  document.querySelectorAll('.kanban-cards').forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedId) {
        onDrop(draggedId, column.dataset.column);
        const card = document.querySelector(`[data-id="${draggedId}"]`);
        if (card) column.appendChild(card);
      }
    });
  });
}

export default initDragDrop;
