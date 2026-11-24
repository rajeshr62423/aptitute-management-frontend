'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_QUESTIONS,
  DEFAULT_SETTINGS,
  DEFAULT_CANDIDATES,
} from '@/services/storageService';
import {
  getCandidates,
  addCandidate as saveNewCandidate,
} from '@/services/candidateService';
import {
  getQuestions,
  saveQuestion as persistQuestion,
  deleteQuestion as removeQuestion,
} from '@/services/questionService';
import {
  getSettings,
  saveSettings as persistSettings,
  getCurrentCandidate,
  setCurrentCandidate as persistCurrentCandidate,
  getSelectedCandidate,
  setSelectedCandidate as persistSelectedCandidate,
} from '@/services/assessmentService';

const AssessmentContext = createContext(null);

export function AssessmentProvider({ children }) {
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [candidates, setCandidates] = useState(DEFAULT_CANDIDATES);
  const [currentCandidate, setCurrentCandidateState] = useState(null);
  const [selectedCandidate, setSelectedCandidateState] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Safe client-side hydration in macro-task to avoid cascading render lint warning
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuestions(getQuestions());
      setSettings(getSettings());
      setCandidates(getCandidates());
      setCurrentCandidateState(getCurrentCandidate());
      setSelectedCandidateState(getSelectedCandidate());
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage('');
  }, []);

  const setCurrentCandidate = useCallback((cand) => {
    setCurrentCandidateState(cand);
    persistCurrentCandidate(cand);
  }, []);

  const setSelectedCandidate = useCallback((cand) => {
    setSelectedCandidateState(cand);
    persistSelectedCandidate(cand);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    persistSettings(newSettings);
    setSettings(newSettings);
    showToast('Assessment settings saved');
  }, [showToast]);

  const addQuestion = useCallback((qData) => {
    const updated = persistQuestion(qData);
    setQuestions(updated);
    showToast('Question saved successfully');
  }, [showToast]);

  const deleteQuestion = useCallback((id) => {
    const updated = removeQuestion(id);
    setQuestions(updated);
    showToast('Question deleted');
  }, [showToast]);

  const addCandidateSubmission = useCallback((cand) => {
    const updated = saveNewCandidate(cand);
    setCandidates(updated);
    setSelectedCandidate(cand);
  }, [setSelectedCandidate]);

  return (
    <AssessmentContext.Provider
      value={{
        questions,
        settings,
        candidates,
        currentCandidate,
        selectedCandidate,
        toastMessage,
        isHydrated,
        showToast,
        hideToast,
        setCurrentCandidate,
        setSelectedCandidate,
        updateSettings,
        addQuestion,
        deleteQuestion,
        addCandidateSubmission,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
