'use client';

import React, { useState, useMemo, useEffect, Suspense, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import DataTable from '@/components/common/DataTable';
import ActionIconButton from '@/components/common/ActionIconButton';
import FilterDrawer from '@/components/common/FilterDrawer';
import Select from '@/components/common/Select';
import DatePicker from '@/components/common/DatePicker';
import SearchBar from '@/components/common/SearchBar';
import { Download, Filter } from 'lucide-react';
import { get_candidates_request, set_selected_candidate } from '@/redux/candidates/action';
import { exportCandidatesToCSV } from '@/utils/csvExport';
import { showToast } from '@/utils/toast';

function CandidatesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const { get_candidates_data: candidates } = useSelector((state) => state.candidates);

  // URL-driven state
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const rawCount = parseInt(searchParams.get('count') || '10', 10);
  const count = [10, 20, 50, 100].includes(rawCount) ? rawCount : 10;

  const searchParam = searchParams.get('search') || '';
  const statusParam = searchParams.get('status') || '';
  const dateParam = searchParams.get('date') || '';

  // Local search input for immediate typing responsiveness
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);

  // Filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState(statusParam);
  const [draftDate, setDraftDate] = useState(dateParam);

  // Sync state if URL changes externally (e.g. back/forward navigation)
  if (prevSearchParam !== searchParam) {
    setPrevSearchParam(searchParam);
    setSearchTerm(searchParam);
  }

  useEffect(() => {
    dispatch(get_candidates_request());
  }, [dispatch]);

  // Update URL helper preserving query parameters
  const updateUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  // Open drawer and synchronize draft state with active URL filters
  const handleOpenFilters = () => {
    setDraftStatus(statusParam);
    setDraftDate(dateParam);
    setIsFilterOpen(true);
  };

  const handleApplyFilters = () => {
    updateUrl({
      status: draftStatus,
      date: draftDate,
      page: 1, // reset page to 1 when filters change
    });
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setDraftStatus('');
    setDraftDate('');
    updateUrl({
      status: '',
      date: '',
      page: 1, // reset page to 1
    });
    setIsFilterOpen(false);
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

  // Active filter count (excluding pagination and search)
  const activeFilterCount = (statusParam ? 1 : 0) + (dateParam ? 1 : 0);

  // Filter candidates based on URL parameters
  const filteredCandidates = useMemo(() => {
    const q = (searchParam || '').toLowerCase().trim();
    return (candidates || []).filter((c) => {
      const matchSearch =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q));
      const matchStatus = !statusParam || c.status === statusParam;
      const matchDate = !dateParam || c.date === dateParam;
      return matchSearch && matchStatus && matchDate;
    });
  }, [candidates, searchParam, statusParam, dateParam]);

  // Paginate records
  const pagedCandidates = useMemo(() => {
    const start = (page - 1) * count;
    return filteredCandidates.slice(start, start + count);
  }, [filteredCandidates, page, count]);

  const handleExportCSV = () => {
    exportCandidatesToCSV(filteredCandidates);
    showToast('CSV export downloaded');
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
      render: (c) => `${c.score}/20`,
    },
    {
      key: 'percent',
      header: 'Percentage',
      render: (c) => `${c.percent}%`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => (
        <Badge variant={c.status === 'Pass' ? 'pass' : 'fail'}>
          {c.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Attempt date',
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
        <div>
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      <section className="panel">
        {/* Streamlined Toolbar: Search + Single Filter Button */}
        <div
          className="toolbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Modern SearchBar */}
          <div style={{ flex: 1, minWidth: '260px', maxWidth: '380px' }}>
            <SearchBar
              id="candidateSearch"
              name="candidateSearch"
              placeholder="Search candidate or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClear={() => {
                setSearchTerm('');
                updateUrl({ search: '', page: 1 });
              }}
            />
          </div>

          {/* Filter Drawer Trigger Button */}
          <button
            type="button"
            onClick={handleOpenFilters}
            aria-label="Open filter drawer"
            style={{
              height: '42px',
              padding: '0 16px',
              borderRadius: '8px',
              border: activeFilterCount > 0 ? '1px solid #f97316' : '1px solid #e7e5e4',
              backgroundColor: activeFilterCount > 0 ? '#fff7ed' : '#ffffff',
              color: activeFilterCount > 0 ? '#ea580c' : '#292524',
              fontSize: '13px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            className="hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            {/* Lucide Filter Icon */}
            <Filter size={15} />
            <span>Filters</span>

            {/* Active Filter Count Badge */}
            {activeFilterCount > 0 && (
              <span
                style={{
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '10px',
                  backgroundColor: '#ea580c',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 6px',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Candidate Table with Enhanced Pagination */}
        <DataTable
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

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Candidates"
        activeCount={activeFilterCount}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      >
        {/* Status Filter */}
        <Select
          label="Candidate Status"
          name="filterStatus"
          value={draftStatus}
          onChange={(e) => setDraftStatus(e.target.value)}
          placeholder="All statuses"
          options={[
            { value: '', label: 'All statuses' },
            { value: 'Pass', label: 'Pass' },
            { value: 'Fail', label: 'Fail' },
          ]}
        />

        {/* Modern DatePicker Filter */}
        <DatePicker
          label="Attempt Date"
          name="filterDate"
          value={draftDate}
          onChange={(e) => setDraftDate(e.target.value)}
          placeholder="Filter by attempt date"
        />
      </FilterDrawer>
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
