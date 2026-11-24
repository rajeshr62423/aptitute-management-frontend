import { getStorage, setStorage, DEFAULT_QUESTIONS } from './storageService';

const KEY = 'questions';

export function getQuestions() {
  return getStorage(KEY, DEFAULT_QUESTIONS);
}

export function saveQuestions(questions) {
  setStorage(KEY, questions);
}

export function getQuestionById(id) {
  const questions = getQuestions();
  return questions.find((q) => Number(q.id) === Number(id)) || null;
}

export function saveQuestion(questionData) {
  const questions = getQuestions();
  let updated;

  if (questionData.id) {
    const exists = questions.some((q) => Number(q.id) === Number(questionData.id));
    if (exists) {
      updated = questions.map((q) =>
        Number(q.id) === Number(questionData.id) ? { ...q, ...questionData } : q
      );
    } else {
      updated = [...questions, questionData];
    }
  } else {
    const nextId = Math.max(0, ...questions.map((q) => Number(q.id) || 0)) + 1;
    const newQuestion = { ...questionData, id: nextId };
    updated = [...questions, newQuestion];
  }

  saveQuestions(updated);
  return updated;
}

export function deleteQuestion(id) {
  const questions = getQuestions();
  const updated = questions.filter((q) => Number(q.id) !== Number(id));
  saveQuestions(updated);
  return updated;
}
