/**
 * Scoring utility for AptitudePro assessments
 * Scoring formula:
 *  - Correct = configured positive marks (default: +2)
 *  - Incorrect = configured negative marks (default: -1)
 *  - Unattempted = configured unattempted marks (default: 0)
 *  - Percentage = Math.max(0, Math.round(score / maxPossible * 100))
 *  - Status = percent >= passingPercent ? 'Pass' : 'Fail'
 */

export function calculateScore(answers, questions, settings) {
  const activeQuestions = questions.filter((q) => q.active).slice(0, settings.total || questions.length);
  
  let correct = 0;
  let incorrect = 0;
  let unattempted = 0;

  activeQuestions.forEach((q) => {
    const selectedAnswer = answers[q.id];
    if (selectedAnswer === undefined || selectedAnswer === null) {
      unattempted++;
    } else if (Number(selectedAnswer) === Number(q.correct)) {
      correct++;
    } else {
      incorrect++;
    }
  });

  const correctMarks = Number(settings.correct) || 2;
  const wrongMarks = Number(settings.wrong) || 0;
  const unattemptedMarks = Number(settings.unattempted) || 0;
  const passPercent = Number(settings.pass) || 60;

  const score = correct * correctMarks + incorrect * wrongMarks + unattempted * unattemptedMarks;
  const maxScore = activeQuestions.length * correctMarks;
  const percent = maxScore > 0 ? Math.max(0, Math.round((score / maxScore) * 100)) : 0;
  const status = percent >= passPercent ? 'Pass' : 'Fail';
  const marksDeducted = Math.max(0, incorrect * Math.abs(wrongMarks));

  return {
    correct,
    incorrect,
    unattempted,
    totalQuestions: activeQuestions.length,
    score,
    maxScore,
    percent,
    status,
    marksDeducted,
  };
}

export function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const m = String(Math.floor(safeSeconds / 60)).padStart(2, '0');
  const s = String(safeSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
