/**
 * CSV and text export utilities
 */

export function downloadFile(filename, content, mimeType = 'text/plain') {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportCandidatesToCSV(candidates) {
  const headers = ['Name', 'Email', 'Phone', 'Age', 'Gender', 'Qualification', 'City', 'Score', 'Percentage', 'Status', 'Date'];
  const rows = (candidates || []).map((c) => [
    c.name || '',
    c.email || '',
    c.phone || '',
    c.age || '',
    c.gender || '',
    c.qualification || '',
    c.city || '',
    `${c.score}/20`,
    `${c.percent}%`,
    c.status || '',
    c.date || '',
  ]);

  const csvRows = [headers, ...rows].map((row) =>
    row
      .map((cell) => {
        const str = String(cell ?? '');
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = csvRows.join('\r\n');
  downloadFile('aptitudepro-candidates.csv', csvContent, 'text/csv;charset=utf-8;');
}

export function exportSingleCandidateResult(candidate) {
  if (!candidate) return;

  const content = [
    '========================================',
    '       AptitudePro Assessment Result    ',
    '========================================',
    `Candidate Name:  ${candidate.name}`,
    `Email:           ${candidate.email}`,
    `Phone:           ${candidate.phone || 'N/A'}`,
    `Qualification:   ${candidate.qualification || 'N/A'}`,
    `City:            ${candidate.city || 'N/A'}`,
    `Date of Attempt: ${candidate.date || 'N/A'}`,
    `Time Taken:      ${candidate.time || 'N/A'}`,
    '----------------------------------------',
    `Score:           ${candidate.score}/20`,
    `Percentage:      ${candidate.percent}%`,
    `Status:          ${candidate.status}`,
    `Correct:         ${candidate.correct || 0}`,
    `Incorrect:       ${candidate.incorrect || 0}`,
    `Unattempted:     ${candidate.unattempted || 0}`,
    '========================================',
  ].join('\r\n');

  downloadFile(`aptitudepro-result-${candidate.name ? candidate.name.replace(/\s+/g, '_') : 'candidate'}.txt`, content, 'text/plain');
}
