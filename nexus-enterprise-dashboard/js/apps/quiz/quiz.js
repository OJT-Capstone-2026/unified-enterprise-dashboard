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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const Quiz = {
  render() {
    if (state.finished) return this._renderResults();
    return this._renderQuestion();
  },

  _renderQuestion() {
    const q = questions[state.currentIndex];
    const progress = (state.currentIndex / questions.length) * 100;

    return `
      <style>
        .qm-card {
          background: var(--surface-primary, white);
          border-radius: 24px;
          padding: 35px;
          box-shadow: 0 20px 50px rgba(0,0,0,.15);
          max-width: 850px;
          margin: 0 auto;
        }
        .qm-header { text-align: center; margin-bottom: 25px; }
        .qm-header h1 { color: var(--text-primary, #333); font-size: 1.6rem; }
        .qm-header p { color: var(--text-secondary, #777); }
        .qm-progress-wrapper { height: 10px; background: var(--surface-secondary, #eee); border-radius: 20px; overflow: hidden; margin-bottom: 20px; }
        .qm-progress-bar { height: 100%; background: linear-gradient(90deg, #00c853, #64dd17); transition: width .4s; }
        .qm-stats { display: flex; justify-content: space-between; margin-bottom: 25px; font-weight: 600; color: var(--text-primary, #333); }
        .qm-question { margin-bottom: 25px; color: var(--text-primary, #222); line-height: 1.5; font-size: 1.1rem; font-weight: 600; white-space: normal; overflow: visible; text-overflow: unset; display: block; width: 100%; }
        .qm-options { display: grid; gap: 15px; }
        .qm-option {
          border: 2px solid var(--border-color, #ddd);
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          transition: .3s;
          font-weight: 500;
          color: var(--text-primary, #333);
          background: var(--surface-primary, white);
        }
        .qm-option:hover { transform: translateY(-2px); border-color: #667eea; }
        .qm-option.correct { background: #d4edda; border-color: #28a745; }
        .qm-option.wrong { background: #f8d7da; border-color: #dc3545; }
        .qm-option.disabled { pointer-events: none; }
        .qm-next-btn {
          width: 100%;
          margin-top: 25px;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background-color: #667eea;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: background .2s;
        }
        .qm-next-btn:hover { background: #4f63d8; }
        .qm-result { text-align: center; }
        .qm-result h2 { margin-bottom: 20px; color: var(--text-primary, #333); }
        .qm-result p { margin: 10px; font-size: 1.2rem; color: var(--text-secondary, #555); }
        .qm-restart-btn {
          margin-top: 20px;
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          background: #667eea;
          color: white;
          cursor: pointer;
          font-size: 1rem;
        }
        .qm-restart-btn:hover { background: #4f63d8; }
      </style>

      <div class="qm-card">
        <div class="qm-header">
          <h1>JavaScript Quiz Master</h1>
          <p>Advanced JS Assessment</p>
        </div>
        <div class="qm-progress-wrapper">
          <div class="qm-progress-bar" style="width: ${progress}%"></div>
        </div>
        <div class="qm-stats">
          <span id="qm-counter">Question ${state.currentIndex + 1} / ${questions.length}</span>
          <span id="qm-score">Score: ${state.score}</span>
        </div>
        <div class="qm-question" id="qm-question-text">${escapeHtml(q.question)}</div>
        <div class="qm-options" id="qm-options">
          ${q.options.map((opt, i) => `
            <div class="qm-option${state.answers[state.currentIndex] !== undefined ? ' disabled' + (i === q.correct ? ' correct' : (i === state.answers[state.currentIndex] ? ' wrong' : '')) : ''}" data-index="${i}">
              ${escapeHtml(opt)}
            </div>
          `).join('')}
        </div>
        <button class="qm-next-btn" id="qm-next-btn">Next Question</button>
      </div>
    `;
  },

  _renderResults() {
    const result = calculateResults(state.answers, questions);
    return `
      <style>
        .qm-card {
          background: var(--surface-primary, white);
          border-radius: 24px;
          padding: 35px;
          box-shadow: 0 20px 50px rgba(0,0,0,.15);
          max-width: 850px;
          margin: 0 auto;
        }
        .qm-result { text-align: center; }
        .qm-result h2 { margin-bottom: 20px; color: var(--text-primary, #333); font-size: 1.8rem; }
        .qm-result p { margin: 10px; font-size: 1.2rem; color: var(--text-secondary, #555); }
        .qm-restart-btn {
          margin-top: 20px;
          padding: 12px 28px;
          border: none;
          border-radius: 10px;
          background: #667eea;
          color: white;
          cursor: pointer;
          font-size: 1rem;
        }
        .qm-restart-btn:hover { background: #4f63d8; }
      </style>
      <div class="qm-card">
        <div class="qm-result">
          <h2>🎉 Quiz Completed</h2>
          <p>Score: ${result.correct}/${result.total}</p>
          <p>Percentage: ${((result.correct / result.total) * 100).toFixed(1)}%</p>
          <p>${result.grade}</p>
          <button class="qm-restart-btn" id="qm-restart-btn">Restart Quiz</button>
        </div>
      </div>
    `;
  },

  onRoute() {
    const saved = StorageManager.get('quiz_state');
    if (saved) state = { ...state, ...saved };

    const optionsContainer = document.getElementById('qm-options');
    if (optionsContainer) {
      optionsContainer.addEventListener('click', (e) => {
        const option = e.target.closest('.qm-option');
        if (!option || option.classList.contains('disabled')) return;

        const selected = parseInt(option.dataset.index);
        const correct = questions[state.currentIndex].correct;

        // Disable all options
        document.querySelectorAll('.qm-option').forEach(o => {
          o.classList.add('disabled');
          if (parseInt(o.dataset.index) === correct) {
            o.classList.add('correct');
          }
        });

        if (selected !== correct) {
          option.classList.add('wrong');
        } else {
          state.score++;
          const scoreEl = document.getElementById('qm-score');
          if (scoreEl) scoreEl.textContent = `Score: ${state.score}`;
        }

        state.answers[state.currentIndex] = selected;
        StorageManager.set('quiz_state', state);
      });
    }

    document.getElementById('qm-next-btn')?.addEventListener('click', () => {
      if (state.answers[state.currentIndex] === undefined) {
        alert('Select an answer first!');
        return;
      }
      state.currentIndex++;
      StorageManager.set('quiz_state', state);

      if (state.currentIndex >= questions.length) {
        state.finished = true;
        const result = calculateResults(state.answers, questions);
        state.score = result.correct;
        StorageManager.set('quiz_best', Math.max(StorageManager.get('quiz_best') || 0, result.score));
        StorageManager.remove('quiz_state');
        document.getElementById('page-content').innerHTML = this._renderResults();
        this.onRoute();
        NotificationManager.success(`Quiz completed! Score: ${result.correct}/${result.total}`);
      } else {
        document.getElementById('page-content').innerHTML = this._renderQuestion();
        this.onRoute();
      }
    });

    document.getElementById('qm-restart-btn')?.addEventListener('click', () => {
      state = { currentIndex: 0, answers: [], finished: false, score: 0 };
      StorageManager.remove('quiz_state');
      document.getElementById('page-content').innerHTML = this._renderQuestion();
      this.onRoute();
    });
  }
};

export default Quiz;
