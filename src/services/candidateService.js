import { getStorage, setStorage, DEFAULT_CANDIDATES } from './storageService';

const KEY = 'candidates';

export function getCandidates() {
  return getStorage(KEY, DEFAULT_CANDIDATES);
}

export function saveCandidates(candidates) {
  setStorage(KEY, candidates);
}

export function addCandidate(candidate) {
  const current = getCandidates();
  const updated = [candidate, ...current];
  saveCandidates(updated);
  return updated;
}

export function isEmailRegistered(email) {
  if (!email) return false;
  const current = getCandidates();
  return current.some((c) => (c.email || '').toLowerCase() === email.trim().toLowerCase());
}

export function getCandidateByEmail(email) {
  if (!email) return null;
  const current = getCandidates();
  return current.find((c) => (c.email || '').toLowerCase() === decodeURIComponent(email).toLowerCase()) || null;
}
