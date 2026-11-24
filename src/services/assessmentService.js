import { getStorage, setStorage, removeStorage, DEFAULT_SETTINGS } from './storageService';

const SETTINGS_KEY = 'settings';
const RECOVERY_KEY = 'testRecovery';
const CURRENT_CANDIDATE_KEY = 'candidate';
const SELECTED_CANDIDATE_KEY = 'selectedCandidate';

export function getSettings() {
  return getStorage(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveSettings(settings) {
  setStorage(SETTINGS_KEY, settings);
  return settings;
}

export function getTestRecovery() {
  return getStorage(RECOVERY_KEY, null);
}

export function saveTestRecovery(data) {
  setStorage(RECOVERY_KEY, data);
}

export function clearTestRecovery() {
  removeStorage(RECOVERY_KEY);
}

export function getCurrentCandidate() {
  return getStorage(CURRENT_CANDIDATE_KEY, null);
}

export function setCurrentCandidate(candidate) {
  setStorage(CURRENT_CANDIDATE_KEY, candidate);
}

export function clearCurrentCandidate() {
  removeStorage(CURRENT_CANDIDATE_KEY);
}

export function getSelectedCandidate() {
  return getStorage(SELECTED_CANDIDATE_KEY, null);
}

export function setSelectedCandidate(candidate) {
  setStorage(SELECTED_CANDIDATE_KEY, candidate);
}
