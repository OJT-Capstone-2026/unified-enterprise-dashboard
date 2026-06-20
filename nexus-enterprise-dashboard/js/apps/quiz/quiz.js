import { questions } from './questions.js';
import { calculateResults } from './results.js';
import StorageManager from '../../modules/storageManager.js';
import NotificationManager from '../../modules/notificationManager.js';

let state = {
  currentIndex: 0,
  answers: [],
  finished: false,
  score: 0
};

const Quiz = {
  render() {
    if (state.finished) return this._renderResults();
    return this._renderQuestion();
  },

  _renderQuestion() {
    const q = questions[state.currentIndex];
    const progress = ((state.currentIndex) / questions.length) * 100;

    return `
      <div class="page-header">
        <h1>Knowledge Assessment</h1>
        <p>Question ${state.currentIndex + 1} of ${questions.length}</p>
      </div>

      <div class="quiz-progress">
        <div class="quiz-progress-bar" style="width: ${progress}%"></div>
      </div>

      <div class="card" style="max-width: 700px; margin: 0 auto;">
        <h2 style="font-size: 20px; margin-bottom: var(--space-5);">${q.question}</h2>
        <div id="quiz-options">
          ${q.options.map((opt, i) => `
            <div class="quiz-option" data-index="${i}">
              <span class="badge badge-primary">${String.fromCharCode(65 + i)}</span>
              <span>${opt}</span>
            </div>
          `).join('')}
        </div>
        <div class="flex justify-between mt-4">
          <button class="btn btn-secondary" id="quiz-prev" ${state.currentIndex === 0 ? 'disabled' : ''}>
            <i class="fas fa-arrow-left"></i> Previous
          </button>
          <button class="btn btn-primary" id="quiz-next" disabled>
            Next <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  _renderResults() {
    const result = calculateResults(state.answers, questions);
    return `
      <div class="page-header text-center">
        <h1 class="gradient-text">Quiz Complete!</h1>
        <p>You scored ${result.score}% — ${result.grade}</p>
      </div>

      <div class="card" style="max-width: 500px; margin: 0 auto; text-align: center;">
        <div style="font-size: 72px; font-weight: 900; color: var(--brand-primary); margin-bottom: var(--space-4);">
          ${result.score}%
        </div>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-5);">
          You answered ${result.correct} out of ${questions.length} questions correctly.
        </p>
        <button class="btn btn-primary" id="quiz-restart">
          <i class="fas fa-redo"></i> Try Again
        </button>
      </div>
    `;
  },

  onRoute() {
    const saved = StorageManager.get('quiz_state');
    if (saved) state = { ...state, ...saved };

    document.getElementById('quiz-options')?.addEventListener('click', (e) => {
      const option = e.target.closest('.quiz-option');
      if (!option) return;

      document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      state.answers[state.currentIndex] = parseInt(option.dataset.index);
      document.getElementById('quiz-next').disabled = false;
    });

    document.getElementById('quiz-next')?.addEventListener('click', () => {
      if (state.currentIndex < questions.length - 1) {
        state.currentIndex++;
        StorageManager.set('quiz_state', state);
        document.getElementById('page-content').innerHTML = this._renderQuestion();
        this.onRoute();
      } else {
        state.finished = true;
        const result = calculateResults(state.answers, questions);
        state.score = result.score;
        StorageManager.set('quiz_best', Math.max(StorageManager.get('quiz_best', 0), result.score));
        StorageManager.remove('quiz_state');
        document.getElementById('page-content').innerHTML = this._renderResults();
        this.onRoute();
        NotificationManager.success(`Quiz completed! Score: ${result.score}%`);
      }
    });

    document.getElementById('quiz-prev')?.addEventListener('click', () => {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        document.getElementById('page-content').innerHTML = this._renderQuestion();
        this.onRoute();
      }
    });

    document.getElementById('quiz-restart')?.addEventListener('click', () => {
      state = { currentIndex: 0, answers: [], finished: false, score: 0 };
      document.getElementById('page-content').innerHTML = this._renderQuestion();
      this.onRoute();
    });

    if (state.answers[state.currentIndex] !== undefined) {
      const selected = document.querySelector(`[data-index="${state.answers[state.currentIndex]}"]`);
      selected?.classList.add('selected');
      const nextBtn = document.getElementById('quiz-next');
      if (nextBtn) nextBtn.disabled = false;
    }
  }
};

export default Quiz;
