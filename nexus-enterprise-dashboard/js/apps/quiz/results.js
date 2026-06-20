export function calculateResults(answers, questions) {
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correct) correct++;
  });

  const score = Math.round((correct / questions.length) * 100);
  let grade = 'Needs Improvement';

  if (score >= 90) grade = 'Outstanding!';
  else if (score >= 75) grade = 'Great Job!';
  else if (score >= 60) grade = 'Good Effort';
  else if (score >= 40) grade = 'Keep Learning';

  return { score, correct, total: questions.length, grade };
}

export default calculateResults;
