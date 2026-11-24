/**
 * Safe LocalStorage Service for AptitudePro Demo Persistence
 */

export const DEFAULT_QUESTIONS = [
  { id: 1, category: 'Quantitative', difficulty: 'Easy', text: 'What is 15% of 200?', options: ['20', '25', '30', '35'], correct: 2, active: true },
  { id: 2, category: 'Logical Reasoning', difficulty: 'Medium', text: 'Find the odd number: 2, 4, 8, 16, 31', options: ['2', '8', '16', '31'], correct: 3, active: true },
  { id: 3, category: 'Verbal', difficulty: 'Easy', text: 'Choose the synonym of “Happy”.', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correct: 1, active: true },
  { id: 4, category: 'Quantitative', difficulty: 'Medium', text: 'A company increases its product price by 20%. If customers decrease by 10%, what happens to revenue?', options: ['Decreases by 10%', 'Increases by 8%', 'Increases by 10%', 'Remains unchanged'], correct: 1, active: true },
  { id: 5, category: 'Logical Reasoning', difficulty: 'Easy', text: 'What number comes next: 1, 4, 9, 16, ...?', options: ['20', '24', '25', '36'], correct: 2, active: true },
  { id: 6, category: 'Verbal', difficulty: 'Medium', text: 'Select the correctly spelled word.', options: ['Accomodate', 'Acommodate', 'Accommodate', 'Acomodate'], correct: 2, active: true },
  { id: 7, category: 'Quantitative', difficulty: 'Hard', text: 'If x + 5 = 17, what is x?', options: ['10', '11', '12', '13'], correct: 2, active: true },
  { id: 8, category: 'Logical Reasoning', difficulty: 'Medium', text: 'Which shape has three sides?', options: ['Square', 'Triangle', 'Pentagon', 'Circle'], correct: 1, active: true },
  { id: 9, category: 'Verbal', difficulty: 'Easy', text: 'What is the opposite of “expand”?', options: ['Extend', 'Increase', 'Contract', 'Enlarge'], correct: 2, active: true },
  { id: 10, category: 'Quantitative', difficulty: 'Hard', text: 'A train travels 120 km in 2 hours. What is its average speed?', options: ['40 km/h', '50 km/h', '60 km/h', '80 km/h'], correct: 2, active: true }
];

export const DEFAULT_TERMS = `1. Assessment Integrity: You agree to complete this assessment independently without external assistance, unauthorized materials, or automated aids.
2. Confidentiality: All test questions, problem sets, and scoring rubrics are proprietary to AptitudePro. Sharing, copying, or distributing test content is strictly prohibited.
3. Candidate Information: You confirm that all personal details provided during registration are accurate, truthful, and belong to you.
4. Monitoring & Compliance: AptitudePro reserves the right to review assessment logs, submission timestamps, and flagged events. Any academic dishonesty will result in immediate disqualification.`;

export const DEFAULT_PRIVACY = `1. Data Collection: We collect candidate personal details (name, email, phone number, age, qualification, city) and test response metrics (chosen options, scores, time taken).
2. Purpose of Use: Your information is processed exclusively for candidate evaluation, aptitude benchmarking, and recruitment communication.
3. Data Protection: All candidate records and assessment data are stored securely and never sold or shared with third-party advertisers.
4. Candidate Rights: You may request access to your test results or request data removal through our support administration.`;

export const DEFAULT_SETTINGS = {
  duration: 15,
  pass: 60,
  correct: 2,
  wrong: -1,
  unattempted: 0,
  total: 10,
  active: true,
  terms: DEFAULT_TERMS,
  privacy: DEFAULT_PRIVACY,
};

export const DEFAULT_CANDIDATES = [
  { name: 'Rajesh Kumar', email: 'rajesh@gmail.com', phone: '9876543210', age: 23, gender: 'Male', qualification: 'BE', city: 'Chennai', score: 16, percent: 80, status: 'Pass', date: '2026-11-21', correct: 8, incorrect: 1, unattempted: 1, time: '12:35' },
  { name: 'Anu Sharma', email: 'anu@gmail.com', phone: '9876543211', age: 22, gender: 'Female', qualification: 'BSc', city: 'Coimbatore', score: 14, percent: 70, status: 'Pass', date: '2026-11-20', correct: 7, incorrect: 1, unattempted: 2, time: '13:02' },
  { name: 'Kumar Patel', email: 'kumar@gmail.com', phone: '9876543212', age: 24, gender: 'Male', qualification: 'BCom', city: 'Bengaluru', score: 8, percent: 40, status: 'Fail', date: '2026-11-19', correct: 5, incorrect: 2, unattempted: 3, time: '14:10' },
  { name: 'Vijay Singh', email: 'vijay@gmail.com', phone: '9876543213', age: 25, gender: 'Male', qualification: 'MCA', city: 'Chennai', score: 18, percent: 90, status: 'Pass', date: '2026-11-18', correct: 9, incorrect: 0, unattempted: 1, time: '10:48' }
];

const PREFIX = 'ap_';

export function getStorage(key, defaultValue) {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${PREFIX + key} from localStorage:`, err);
    return defaultValue;
  }
}

export function setStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${PREFIX + key} to localStorage:`, err);
  }
}

export function removeStorage(key) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.error(`Error removing ${PREFIX + key} from localStorage:`, err);
  }
}
