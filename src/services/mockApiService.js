/**
 * Mock API Service Layer
 * Simulates backend responses for AptitudePro demo persistence.
 * Dispatches through Axios interceptors so Redux-Saga calls Axios directly.
 */

import {
  DEFAULT_QUESTIONS,
  DEFAULT_SETTINGS,
  DEFAULT_CANDIDATES,
  getStorage,
  setStorage,
} from './storageService';
import { calculateScore, formatTime } from '@/utils/scoring';

export function handleMockRequest(config) {
  const { url, method, data } = config;
  const parsedData = typeof data === 'string' ? JSON.parse(data || '{}') : data || {};
  const cleanUrl = (url || '').split('?')[0];

  // 1. Admin Login
  if (cleanUrl.endsWith('/api/admin/login') && method.toLowerCase() === 'post') {
    const { email, password } = parsedData;
    if (email === 'admin@aptitudepro.com' && password === 'Admin@123') {
      const responseData = {
        token: 'mock-jwt-admin-token-12345',
        user: {
          name: 'Administrator',
          email: 'admin@aptitudepro.com',
          role: 'Super Administrator',
        },
        message: 'Login successful',
      };
      setStorage('admin', true);
      return { status: 200, data: responseData };
    }
    const error = new Error('Invalid email or password');
    error.response = { status: 401, data: { message: 'Invalid email or password' } };
    throw error;
  }

  // 2. Candidate Registration
  if (cleanUrl.endsWith('/api/candidate/register') && method.toLowerCase() === 'post') {
    const currentCandidates = getStorage('candidates', DEFAULT_CANDIDATES);
    const exists = currentCandidates.some(
      (c) => (c.email || '').toLowerCase() === (parsedData.email || '').trim().toLowerCase()
    );
    if (exists) {
      const error = new Error('This email has already submitted an assessment.');
      error.response = { status: 409, data: { message: 'This email has already submitted an assessment.' } };
      throw error;
    }
    setStorage('candidate', parsedData);
    return { status: 200, data: { candidate: parsedData, message: 'Candidate registered successfully' } };
  }

  // 3. Candidates List (GET) & Detail (GET by email/id)
  if (cleanUrl.includes('/api/candidates') && method.toLowerCase() === 'get') {
    const currentCandidates = getStorage('candidates', DEFAULT_CANDIDATES);
    // Detail lookup
    const segments = cleanUrl.split('/');
    const lastSegment = segments[segments.length - 1];
    if (lastSegment !== 'candidates' && lastSegment) {
      const decoded = decodeURIComponent(lastSegment).toLowerCase();
      const found = currentCandidates.find(
        (c) => (c.email && c.email.toLowerCase() === decoded) || (c.name && c.name.toLowerCase() === decoded)
      );
      if (found) {
        return { status: 200, data: found };
      }
      const error = new Error('Candidate not found');
      error.response = { status: 404, data: { message: 'Candidate not found' } };
      throw error;
    }
    return { status: 200, data: currentCandidates };
  }

  // 4. Questions List (GET), Create (POST), Update (PUT), Delete (DELETE)
  if (cleanUrl.includes('/api/questions')) {
    const currentQuestions = getStorage('questions', DEFAULT_QUESTIONS);

    if (method.toLowerCase() === 'get') {
      return { status: 200, data: currentQuestions };
    }

    if (method.toLowerCase() === 'post') {
      const nextId = Math.max(0, ...currentQuestions.map((q) => Number(q.id) || 0)) + 1;
      const newQuestion = { ...parsedData, id: nextId };
      const updated = [...currentQuestions, newQuestion];
      setStorage('questions', updated);
      return { status: 201, data: newQuestion };
    }

    if (method.toLowerCase() === 'put') {
      const updated = currentQuestions.map((q) =>
        Number(q.id) === Number(parsedData.id) ? { ...q, ...parsedData } : q
      );
      setStorage('questions', updated);
      return { status: 200, data: parsedData };
    }

    if (method.toLowerCase() === 'delete') {
      const segments = cleanUrl.split('/');
      const idToDelete = Number(segments[segments.length - 1]);
      const updated = currentQuestions.filter((q) => Number(q.id) !== idToDelete);
      setStorage('questions', updated);
      return { status: 200, data: { success: true, id: idToDelete } };
    }
  }

  // 5. Assessment Settings (GET, PUT)
  if (cleanUrl.endsWith('/api/assessment/settings')) {
    if (method.toLowerCase() === 'get') {
      const settings = getStorage('settings', DEFAULT_SETTINGS);
      return { status: 200, data: settings };
    }
    if (method.toLowerCase() === 'put') {
      setStorage('settings', parsedData);
      return { status: 200, data: parsedData };
    }
  }

  // 6. Assessment Submission (POST)
  if (cleanUrl.endsWith('/api/assessment/submit') && method.toLowerCase() === 'post') {
    const { candidate, answers, timeSpent } = parsedData;
    const settings = getStorage('settings', DEFAULT_SETTINGS);
    const questions = getStorage('questions', DEFAULT_QUESTIONS);

    const scoreResult = calculateScore(answers, questions, settings);
    const candidateResult = {
      ...candidate,
      score: scoreResult.score,
      percent: scoreResult.percent,
      status: scoreResult.status,
      date: new Date().toISOString().slice(0, 10),
      correct: scoreResult.correct,
      incorrect: scoreResult.incorrect,
      unattempted: scoreResult.unattempted,
      marksDeducted: scoreResult.marksDeducted,
      time: formatTime(timeSpent || 0),
      maxScore: scoreResult.maxScore,
    };

    const currentCandidates = getStorage('candidates', DEFAULT_CANDIDATES);
    const updated = [candidateResult, ...currentCandidates];
    setStorage('candidates', updated);
    setStorage('selectedCandidate', candidateResult);
    return { status: 200, data: candidateResult };
  }

  // 7. Dashboard Stats (GET)
  if (cleanUrl.endsWith('/api/dashboard/stats') && method.toLowerCase() === 'get') {
    const currentCandidates = getStorage('candidates', DEFAULT_CANDIDATES);
    const total = currentCandidates.length;
    const pass = currentCandidates.filter((c) => c.status === 'Pass').length;
    const fail = total - pass;
    const avg = total
      ? Math.round(currentCandidates.reduce((acc, c) => acc + (c.percent || 0), 0) / total)
      : 0;
    const passRate = total ? Math.round((pass / total) * 100) : 0;

    return {
      status: 200,
      data: {
        totalCandidates: total,
        testsCompleted: total,
        averageScore: avg,
        passRate,
        passCount: pass,
        failCount: fail,
        recentActivity: currentCandidates.slice(0, 5),
      },
    };
  }

  // Fallback for unhandled endpoints
  return { status: 200, data: parsedData };
}
