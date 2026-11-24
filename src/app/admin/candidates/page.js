'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import DataTable from '@/components/common/DataTable';
import ActionIconButton from '@/components/common/ActionIconButton';
import SearchBar from '@/components/common/SearchBar';
import { Download, SlidersHorizontal, X } from 'lucide-react';
import { get_candidates_request, set_selected_candidate } from '@/redux/candidates/action';
import { exportCandidatesToCSV } from '@/utils/csvExport';
import { toast } from '@/utils/toast';

function CandidatesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const { get_candidates_data: candidates, get_candidates_loading: candidatesLoading } = useSelector(
    (state) => state.candidates
  );

  // URL-driven state
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const rawCount = parseInt(searchParams.get('count') || '10', 10);
  const count = [10, 20, 50, 100].includes(rawCount) ? rawCount : 10;

  const searchParam = searchParams.get('search') || '';
  const statusParam = searchParams.get('status') || '';
  const minScoreParam = searchParams.get('minScore') || '';
  const maxScoreParam = searchParams.get('maxScore') || '';
  const startDateParam = searchParams.get('startDate') || '';
  const endDateParam = searchParams.get('endDate') || '';
  const dateParam = searchParams.get('date') || ''; // Support legacy or single date param

  // Local search input for immediate typing responsiveness
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);

  // Filter Popover state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const popoverRef = useRef(null);

  // Draft filter states inside popover
  const [draftStatus, setDraftStatus] = useState(statusParam);
  const [draftMinScore, setDraftMinScore] = useState(minScoreParam);
  const [draftMaxScore, setDraftMaxScore] = useState(maxScoreParam);
  const [draftStartDate, setDraftStartDate] = useState(startDateParam || dateParam);
  const [draftEndDate, setDraftEndDate] = useState(endDateParam);

  // Sync state if URL changes externally (e.g. back/forward navigation)
  if (prevSearchParam !== searchParam) {
    setPrevSearchParam(searchParam);
    setSearchTerm(searchParam);
  }

  useEffect(() => {
    dispatch(get_candidates_request());
  }, [dispatch]);

  // Close filter popover on outside click or Escape key
  useEffect(() => {
    if (!isFilterOpen) return;

    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterOpen]);

  // Update URL helper preserving query parameters
  const updateUrl = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === null || val === '') {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Open popover and synchronize draft state with active URL filters
  const handleOpenFilters = () => {
    setDraftStatus(statusParam);
    setDraftMinScore(minScoreParam);
    setDraftMaxScore(maxScoreParam);
    setDraftStartDate(startDateParam || dateParam);
    setDraftEndDate(endDateParam);
    setIsFilterOpen(true);
  };

  const handleApplyFilters = () => {
    updateUrl({
      status: draftStatus,
      minScore: draftMinScore,
      maxScore: draftMaxScore,
      startDate: draftStartDate,
      endDate: draftEndDate,
      date: '', // Clear legacy single date
      page: 1, // Reset page to 1
    });
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setDraftStatus('');
    setDraftMinScore('');
    setDraftMaxScore('');
    setDraftStartDate('');
    setDraftEndDate('');
    updateUrl({
      status: '',
      minScore: '',
      maxScore: '',
      startDate: '',
      endDate: '',
      date: '',
      page: 1,
    });
    setIsFilterOpen(false);
  };

  const handleRemoveStatus = () => {
    setDraftStatus('');
    updateUrl({ status: '', page: 1 });
  };

  const handleRemoveScore = () => {
    setDraftMinScore('');
    setDraftMaxScore('');
    updateUrl({ minScore: '', maxScore: '', page: 1 });
  };

  const handleRemoveDate = () => {
    setDraftStartDate('');
    setDraftEndDate('');
    updateUrl({ startDate: '', endDate: '', date: '', page: 1 });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    updateUrl({ search: val, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateUrl({ page: newPage });
  };

  const handleCountChange = (newCount) => {
    updateUrl({ count: newCount, page: 1 });
  };

  // Active filter count (Status, Score Range, Date Range)
  const activeFilterCount =
    (statusParam && statusParam.toLowerCase() !== 'all' ? 1 : 0) +
    (minScoreParam !== '' || maxScoreParam !== '' ? 1 : 0) +
    (startDateParam || endDateParam || dateParam ? 1 : 0);

  // Filter candidates based on URL parameters
  const filteredCandidates = useMemo(() => {
    const q = (searchParam || '').toLowerCase().trim();
    const minScoreNum = minScoreParam !== '' && !isNaN(Number(minScoreParam)) ? Number(minScoreParam) : null;
    const maxScoreNum = maxScoreParam !== '' && !isNaN(Number(maxScoreParam)) ? Number(maxScoreParam) : null;

    return (candidates || []).filter((c) => {
      // 1. Search filter: matches candidate name or email
      const matchSearch =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q));

      // 2. Status filter: 'All' or empty matches all; otherwise case-insensitive match
      const matchStatus =
        !statusParam ||
        statusParam.toLowerCase() === 'all' ||
        (c.status && c.status.toLowerCase() === statusParam.toLowerCase());

      // 3. Score Range matching
      const candidateScore = Number(c.score ?? 0);
      const matchMinScore = minScoreNum === null || candidateScore >= minScoreNum;
      const matchMaxScore = maxScoreNum === null || candidateScore <= maxScoreNum;

      // 4. Date matching (YYYY-MM-DD)
      const cDate = c.date ? String(c.date).substring(0, 10) : '';
      let matchDate = true;
      if (startDateParam && cDate) {
        matchDate = matchDate && cDate >= startDateParam;
      } else if (startDateParam && !cDate) {
        matchDate = false;
      }
      if (endDateParam && cDate) {
        matchDate = matchDate && cDate <= endDateParam;
      } else if (endDateParam && !cDate) {
        matchDate = false;
      }
      if (dateParam && cDate) {
        matchDate = matchDate && cDate.startsWith(dateParam);
      }

      return matchSearch && matchStatus && matchMinScore && matchMaxScore && matchDate;
    });
  }, [candidates, searchParam, statusParam, minScoreParam, maxScoreParam, startDateParam, endDateParam, dateParam]);

  // Paginate records
  const pagedCandidates = useMemo(() => {
    const start = (page - 1) * count;
    return filteredCandidates.slice(start, start + count);
  }, [filteredCandidates, page, count]);

  const handleExportCSV = () => {
    exportCandidatesToCSV(filteredCandidates);
    toast.success('Candidate list exported to CSV successfully.', {
      title: 'Export Complete',
    });
  };

  const handleViewCandidate = (candidate) => {
    dispatch(set_selected_candidate(candidate));
    router.push(`/admin/candidates/${encodeURIComponent(candidate.email)}`);
  };

  const columns = [
    {
      key: 'name',
      header: 'Candidate',
      render: (c) => <b>{c.name}</b>,
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'score',
      header: 'Score',
      render: (c) => `${c.score ?? 0}/20`,
    },
    {
      key: 'percent',
      header: 'Percentage',
      render: (c) => `${c.percent ?? 0}%`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => (
        <Badge
          variant={
            c.status === 'Pass'
              ? 'pass'
              : c.status === 'Fail'
              ? 'fail'
              : 'pending'
          }
        >
          {c.status || 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Attempt date',
      render: (c) => c.date || '—',
    },
    {
      key: 'actions',
      header: 'Actions',
      cellStyle: { width: '80px', textAlign: 'center' },
      render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ActionIconButton
            action="view"
            tooltip={`View ${c.name}'s performance`}
            ariaLabel={`View details for ${c.name}`}
            onClick={() => handleViewCandidate(c)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Candidate Management</h1>
          <p className="page-subtitle">
            Review candidate submissions, scores and assessment status.
          </p>
        </div>
      </div>

      <section className="panel">
        {/* Redesigned Search and Filter Toolbar */}
        <div className="candidate-toolbar-container">
          <div className="candidate-toolbar-main">
            {/* Left Section: Search Input + Filter Button */}
            <div className="candidate-toolbar-left">
              <div className="candidate-search-wrapper">
                <SearchBar
                  id="candidateSearch"
                  name="candidateSearch"
                  placeholder="Search by candidate name or email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClear={() => {
                    setSearchTerm('');
                    updateUrl({ search: '', page: 1 });
                  }}
                />
              </div>

              {/* Filter Popover Anchor */}
              <div className="candidate-filter-anchor" ref={popoverRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (isFilterOpen) {
                      setIsFilterOpen(false);
                    } else {
                      handleOpenFilters();
                    }
                  }}
                  aria-expanded={isFilterOpen}
                  aria-label="Filter candidates"
                  className={`candidate-filter-btn ${activeFilterCount > 0 ? 'active' : ''} ${isFilterOpen ? 'open' : ''}`}
                >
                  <SlidersHorizontal size={15} />
                  <span>Filters</span>

                  {activeFilterCount > 0 && (
                    <span className="candidate-filter-badge">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Filter Popover Dialog */}
                {isFilterOpen && (
                  <div className="filter-popover" role="dialog" aria-modal="true" aria-label="Filter candidates">
                    {/* Popover Header */}
                    <div className="filter-popover-header">
                      <div className="filter-popover-title">
                        <SlidersHorizontal size={15} style={{ color: '#ff6b0a' }} />
                        <span>Filter Options</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="filter-popover-close"
                        aria-label="Close filters"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {/* Filter 1: Assessment Status */}
                    <div className="filter-section">
                      <label className="filter-section-label">Assessment Status</label>
                      <div className="filter-status-pills">
                        {['All', 'Pass', 'Fail', 'Pending'].map((statusOption) => {
                          const isSelected =
                            statusOption === 'All'
                              ? !draftStatus || draftStatus.toLowerCase() === 'all'
                              : draftStatus.toLowerCase() === statusOption.toLowerCase();

                          return (
                            <button
                              key={statusOption}
                              type="button"
                              onClick={() => setDraftStatus(statusOption === 'All' ? '' : statusOption)}
                              className={`filter-status-pill ${isSelected ? 'selected' : ''}`}
                            >
                              {statusOption}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Filter 2: Score Range */}
                    <div className="filter-section">
                      <label className="filter-section-label">Score Range (0 – 20)</label>
                      <div className="filter-range-inputs">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          placeholder="Min score (0)"
                          value={draftMinScore}
                          onChange={(e) => setDraftMinScore(e.target.value)}
                          className="filter-number-input"
                          aria-label="Minimum score"
                        />
                        <span className="filter-range-separator">to</span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          placeholder="Max score (20)"
                          value={draftMaxScore}
                          onChange={(e) => setDraftMaxScore(e.target.value)}
                          className="filter-number-input"
                          aria-label="Maximum score"
                        />
                      </div>
                    </div>

                    {/* Filter 3: Attempt Date Range */}
                    <div className="filter-section">
                      <label className="filter-section-label">Attempt Date Range</label>
                      <div className="filter-range-inputs">
                        <div className="filter-date-col">
                          <span className="filter-date-sublabel">From</span>
                          <input
                            type="date"
                            value={draftStartDate}
                            onChange={(e) => setDraftStartDate(e.target.value)}
                            className="filter-date-input"
                            aria-label="Start date"
                          />
                        </div>
                        <span className="filter-range-separator" style={{ alignSelf: 'flex-end', marginBottom: '8px' }}>
                          –
                        </span>
                        <div className="filter-date-col">
                          <span className="filter-date-sublabel">To</span>
                          <input
                            type="date"
                            value={draftEndDate}
                            onChange={(e) => setDraftEndDate(e.target.value)}
                            className="filter-date-input"
                            aria-label="End date"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Popover Action Buttons */}
                    <div className="filter-popover-actions">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="filter-btn-clear"
                      >
                        Clear All
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyFilters}
                        className="filter-btn-apply"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: Candidate Result Count + Export CSV Button */}
            <div className="candidate-toolbar-right">
              <div className="candidate-result-count" aria-live="polite">
                <span className="candidate-count-dot" />
                <span>
                  <strong className="candidate-count-num">{filteredCandidates.length}</strong>{' '}
                  {filteredCandidates.length === 1 ? 'candidate' : 'candidates'} found
                </span>
              </div>

              <Button
                variant="secondary"
                onClick={handleExportCSV}
                className="candidate-export-btn"
                disabled={filteredCandidates.length === 0}
                style={{ height: '42px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={15} />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>

          {/* Active Filter Chips Indicator Row */}
          {activeFilterCount > 0 && (
            <div className="active-filters-bar" role="region" aria-label="Active filters">
              <span className="active-filters-label">
                Active filters:
              </span>

              {statusParam && statusParam.toLowerCase() !== 'all' && (
                <span className="active-filter-chip">
                  Status: <strong>{statusParam}</strong>
                  <button
                    type="button"
                    onClick={handleRemoveStatus}
                    className="active-filter-chip-remove"
                    title="Remove status filter"
                    aria-label={`Remove status filter ${statusParam}`}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </span>
              )}

              {(minScoreParam !== '' || maxScoreParam !== '') && (
                <span className="active-filter-chip">
                  Score:{' '}
                  <strong>
                    {minScoreParam !== '' && maxScoreParam !== ''
                      ? `${minScoreParam} – ${maxScoreParam}`
                      : minScoreParam !== ''
                      ? `≥ ${minScoreParam}`
                      : `≤ ${maxScoreParam}`}
                  </strong>
                  <button
                    type="button"
                    onClick={handleRemoveScore}
                    className="active-filter-chip-remove"
                    title="Remove score filter"
                    aria-label="Remove score filter"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </span>
              )}

              {(startDateParam || endDateParam || dateParam) && (
                <span className="active-filter-chip">
                  Date:{' '}
                  <strong>
                    {startDateParam && endDateParam
                      ? `${startDateParam} to ${endDateParam}`
                      : startDateParam
                      ? `from ${startDateParam}`
                      : endDateParam
                      ? `until ${endDateParam}`
                      : dateParam}
                  </strong>
                  <button
                    type="button"
                    onClick={handleRemoveDate}
                    className="active-filter-chip-remove"
                    title="Remove date filter"
                    aria-label="Remove date filter"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="active-filters-clear-all"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Candidate Table with Enhanced Pagination */}
        <DataTable
          loading={candidatesLoading && (!candidates || candidates.length === 0)}
          columns={columns}
          data={pagedCandidates}
          totalItems={filteredCandidates.length}
          page={page}
          pageSize={count}
          pageSizeOptions={[10, 20, 50, 100]}
          onPageChange={handlePageChange}
          onPageSizeChange={handleCountChange}
          emptyMessage="No candidates found matching criteria."
        />
      </section>
    </>
  );
}

export default function CandidatesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="panel" style={{ padding: '30px', textAlign: 'center' }}>Loading candidates...</div>}>
        <CandidatesContent />
      </Suspense>
    </AdminLayout>
  );
}
