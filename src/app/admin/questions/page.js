'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import DataTable from '@/components/common/DataTable';
import ActionIconButton from '@/components/common/ActionIconButton';
import SearchBar from '@/components/common/SearchBar';
import QuestionForm from '@/components/admin/QuestionForm';
import { Plus, SlidersHorizontal, X } from 'lucide-react';
import {
  get_questions_request,
  post_question_request,
  put_question_request,
  delete_question_request,
  post_question_response_clear,
  put_question_response_clear,
  delete_question_response_clear,
} from '@/redux/questions/action';
import { toast } from '@/utils/toast';

function QuestionsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const {
    get_questions_data: questions,
    get_questions_loading: questionsLoading,
    post_question_data,
    post_question_error,
    put_question_data,
    put_question_error,
    delete_question_data,
    delete_question_error,
  } = useSelector((state) => state.questions);

  // URL-driven query parameters
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const rawCount = parseInt(searchParams.get('count') || '10', 10);
  const count = [10, 20, 50, 100].includes(rawCount) ? rawCount : 10;

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const difficultyParam = searchParams.get('difficulty') || '';
  const statusParam = searchParams.get('status') || '';

  // Local state for smooth typing
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);

  // Sync state if URL changes externally (e.g. back/forward navigation)
  if (prevSearchParam !== searchParam) {
    setPrevSearchParam(searchParam);
    setSearchTerm(searchParam);
  }

  // Filter Popover state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const popoverRef = useRef(null);
  const [draftCategory, setDraftCategory] = useState(categoryParam);
  const [draftDifficulty, setDraftDifficulty] = useState(difficultyParam);
  const [draftStatus, setDraftStatus] = useState(statusParam);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(get_questions_request());
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

  // Handle post/put/delete responses from Redux
  useEffect(() => {
    if (post_question_data) {
      toast.success('Question added to question bank.', { title: 'Created' });
      const timer = setTimeout(() => {
        dispatch(post_question_response_clear());
        setIsEditModalOpen(false);
        setEditingQuestion(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [post_question_data, dispatch]);

  useEffect(() => {
    if (post_question_error) {
      toast.error(post_question_error, { title: 'Creation Failed' });
      dispatch(post_question_response_clear());
    }
  }, [post_question_error, dispatch]);

  useEffect(() => {
    if (put_question_data) {
      toast.success('Question details updated successfully.', { title: 'Updated' });
      const timer = setTimeout(() => {
        dispatch(put_question_response_clear());
        setIsEditModalOpen(false);
        setEditingQuestion(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [put_question_data, dispatch]);

  useEffect(() => {
    if (put_question_error) {
      toast.error(put_question_error, { title: 'Update Failed' });
      dispatch(put_question_response_clear());
    }
  }, [put_question_error, dispatch]);

  useEffect(() => {
    if (delete_question_data) {
      toast.success('Question removed from question bank.', { title: 'Deleted' });
      const timer = setTimeout(() => {
        dispatch(delete_question_response_clear());
        setDeletingId(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [delete_question_data, dispatch]);

  useEffect(() => {
    if (delete_question_error) {
      toast.error(delete_question_error, { title: 'Delete Failed' });
      dispatch(delete_question_response_clear());
    }
  }, [delete_question_error, dispatch]);

  // Update URL helper
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

  // Filter Popover handlers
  const handleOpenFilters = () => {
    setDraftCategory(categoryParam);
    setDraftDifficulty(difficultyParam);
    setDraftStatus(statusParam);
    setIsFilterOpen(true);
  };

  const handleApplyFilters = () => {
    updateUrl({
      category: draftCategory,
      difficulty: draftDifficulty,
      status: draftStatus,
      page: 1, // reset page to 1
    });
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setDraftCategory('');
    setDraftDifficulty('');
    setDraftStatus('');
    updateUrl({
      category: '',
      difficulty: '',
      status: '',
      page: 1, // reset page to 1
    });
    setIsFilterOpen(false);
  };

  const handleRemoveCategory = () => {
    setDraftCategory('');
    updateUrl({ category: '', page: 1 });
  };

  const handleRemoveDifficulty = () => {
    setDraftDifficulty('');
    updateUrl({ difficulty: '', page: 1 });
  };

  const handleRemoveStatus = () => {
    setDraftStatus('');
    updateUrl({ status: '', page: 1 });
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

  // Active filter count
  const activeFilterCount =
    (categoryParam ? 1 : 0) + (difficultyParam ? 1 : 0) + (statusParam ? 1 : 0);

  // Filtered questions based on URL params
  const filteredQuestions = useMemo(() => {
    const q = (searchParam || '').toLowerCase().trim();
    return (questions || []).filter((item) => {
      const matchSearch = !q || (item.text && item.text.toLowerCase().includes(q));
      const matchCategory = !categoryParam || item.category === categoryParam;
      const matchDifficulty = !difficultyParam || item.difficulty === difficultyParam;
      const matchStatus =
        !statusParam ||
        (statusParam === 'Active' && item.active) ||
        (statusParam === 'Inactive' && !item.active);
      return matchSearch && matchCategory && matchDifficulty && matchStatus;
    });
  }, [questions, searchParam, categoryParam, difficultyParam, statusParam]);

  // Paginated slice
  const pagedQuestions = useMemo(() => {
    const start = (page - 1) * count;
    return filteredQuestions.slice(start, start + count);
  }, [filteredQuestions, page, count]);

  const activeCount = (questions || []).filter((q) => q.active).length;

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setIsEditModalOpen(true);
  };

  const handleSaveQuestion = (qData) => {
    if (qData.id) {
      dispatch(put_question_request(qData));
    } else {
      dispatch(post_question_request(qData));
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      dispatch(delete_question_request(deletingId));
    }
  };

  const columns = [
    {
      key: 'id',
      header: '#',
      cellStyle: { width: '40px' },
    },
    {
      key: 'text',
      header: 'Question',
      cellStyle: { maxWidth: '340px', whiteSpace: 'normal' },
      render: (q) => q.text,
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
    },
    {
      key: 'correct',
      header: 'Correct option',
      render: (q) => 'ABCD'[q.correct] || 'A',
    },
    {
      key: 'active',
      header: 'Status',
      render: (q) => (
        <Badge variant={q.active ? 'active' : 'inactive'}>
          {q.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cellStyle: { width: '100px', textAlign: 'center' },
      render: (q) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <ActionIconButton
            action="edit"
            tooltip="Edit question"
            ariaLabel={`Edit question #${q.id}`}
            onClick={() => handleOpenEdit(q)}
          />
          <ActionIconButton
            action="delete"
            tooltip="Delete question"
            ariaLabel={`Delete question #${q.id}`}
            onClick={() => setDeletingId(q.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Question Management</h1>
          <p className="page-subtitle">Create and maintain the question bank.</p>
        </div>
        <div>
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Add New Question</span>
          </Button>
        </div>
      </div>

      <section className="panel">
        {/* Redesigned Search and Filter Toolbar (Candidate style, without CSV export) */}
        <div className="questions-toolbar-container">
          <div className="questions-toolbar-main">
            {/* Left Section: Search Input + Filter Button */}
            <div className="questions-toolbar-left">
              <div className="questions-search-wrapper">
                <SearchBar
                  id="questionSearch"
                  name="questionSearch"
                  placeholder="Search questions by text..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClear={() => {
                    setSearchTerm('');
                    updateUrl({ search: '', page: 1 });
                  }}
                />
              </div>

              {/* Filter Popover Anchor */}
              <div className="questions-filter-anchor" ref={popoverRef}>
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
                  aria-label="Filter questions"
                  className={`questions-filter-btn ${activeFilterCount > 0 ? 'active' : ''} ${isFilterOpen ? 'open' : ''}`}
                >
                  <SlidersHorizontal size={15} />
                  <span>Filters</span>

                  {activeFilterCount > 0 && (
                    <span className="questions-filter-badge">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Filter Popover Dialog */}
                {isFilterOpen && (
                  <div
                    className="filter-popover"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Filter questions"
                    style={{ width: '380px' }}
                  >
                    {/* Popover Header */}
                    <div className="filter-popover-header">
                      <div className="filter-popover-title">
                        <SlidersHorizontal size={15} style={{ color: '#ff6b0a' }} />
                        <span>Filter Questions</span>
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

                    {/* Filter 1: Category */}
                    <div className="filter-section">
                      <label className="filter-section-label">Category</label>
                      <div className="filter-pills-wrap">
                        {['All', 'Quantitative', 'Logical Reasoning', 'Verbal', 'Technical'].map((cat) => {
                          const isSelected =
                            cat === 'All'
                              ? !draftCategory || draftCategory.toLowerCase() === 'all'
                              : draftCategory.toLowerCase() === cat.toLowerCase();

                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setDraftCategory(cat === 'All' ? '' : cat)}
                              className={`filter-status-pill ${isSelected ? 'selected' : ''}`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Filter 2: Difficulty Level */}
                    <div className="filter-section">
                      <label className="filter-section-label">Difficulty Level</label>
                      <div className="filter-status-pills">
                        {['All', 'Easy', 'Medium', 'Hard'].map((diff) => {
                          const isSelected =
                            diff === 'All'
                              ? !draftDifficulty || draftDifficulty.toLowerCase() === 'all'
                              : draftDifficulty.toLowerCase() === diff.toLowerCase();

                          return (
                            <button
                              key={diff}
                              type="button"
                              onClick={() => setDraftDifficulty(diff === 'All' ? '' : diff)}
                              className={`filter-status-pill ${isSelected ? 'selected' : ''}`}
                            >
                              {diff}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Filter 3: Question Status */}
                    <div className="filter-section">
                      <label className="filter-section-label">Question Status</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {['All', 'Active', 'Inactive'].map((st) => {
                          const isSelected =
                            st === 'All'
                              ? !draftStatus || draftStatus.toLowerCase() === 'all'
                              : draftStatus.toLowerCase() === st.toLowerCase();

                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setDraftStatus(st === 'All' ? '' : st)}
                              className={`filter-status-pill ${isSelected ? 'selected' : ''}`}
                            >
                              {st}
                            </button>
                          );
                        })}
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

            {/* Right Section: Question Counts (No CSV Export) */}
            <div className="questions-toolbar-right">
              <div className="questions-result-count" aria-live="polite">
                <span className="questions-count-dot" />
                <span>
                  <strong className="questions-count-num">{filteredQuestions.length}</strong>{' '}
                  {filteredQuestions.length === 1 ? 'question' : 'questions'} found
                </span>
              </div>

              <div
                className="questions-result-count"
                style={{
                  backgroundColor: '#f0fdf4',
                  borderColor: '#bbf7d0',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                  }}
                />
                <span style={{ color: '#166534', fontSize: '13px' }}>
                  <strong style={{ color: '#14532d' }}>{activeCount}</strong> active
                </span>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Indicator Row */}
          {activeFilterCount > 0 && (
            <div className="active-filters-bar" role="region" aria-label="Active filters">
              <span className="active-filters-label">Active filters:</span>

              {categoryParam && categoryParam.toLowerCase() !== 'all' && (
                <span className="active-filter-chip">
                  Category: <strong>{categoryParam}</strong>
                  <button
                    type="button"
                    onClick={handleRemoveCategory}
                    className="active-filter-chip-remove"
                    title="Remove category filter"
                    aria-label={`Remove category filter ${categoryParam}`}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </span>
              )}

              {difficultyParam && difficultyParam.toLowerCase() !== 'all' && (
                <span className="active-filter-chip">
                  Difficulty: <strong>{difficultyParam}</strong>
                  <button
                    type="button"
                    onClick={handleRemoveDifficulty}
                    className="active-filter-chip-remove"
                    title="Remove difficulty filter"
                    aria-label={`Remove difficulty filter ${difficultyParam}`}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </span>
              )}

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

        {/* Questions Table with Enhanced Pagination */}
        <DataTable
          loading={questionsLoading && (!questions || questions.length === 0)}
          columns={columns}
          data={pagedQuestions}
          totalItems={filteredQuestions.length}
          page={page}
          pageSize={count}
          pageSizeOptions={[10, 20, 50, 100]}
          onPageChange={handlePageChange}
          onPageSizeChange={handleCountChange}
          emptyMessage="No questions found matching criteria."
        />
      </section>

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingQuestion(null);
        }}
        title={editingQuestion ? 'Edit Question' : 'Add New Question'}
        width="640px"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingQuestion(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="question-modal-form"
              variant="primary"
            >
              Save Question
            </Button>
          </>
        }
      >
        <QuestionForm
          key={editingQuestion ? editingQuestion.id : 'new'}
          formId="question-modal-form"
          initialData={editingQuestion}
          onSave={handleSaveQuestion}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingQuestion(null);
          }}
          isModal
          hideActions
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Delete this question?"
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete question
            </Button>
          </>
        }
      >
        <p className="muted" style={{ margin: 0 }}>
          This action cannot be undone. Are you sure you want to permanently remove this question from the bank?
        </p>
      </Modal>
    </>
  );
}

export default function QuestionsPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="panel" style={{ padding: '30px', textAlign: 'center' }}>Loading questions...</div>}>
        <QuestionsContent />
      </Suspense>
    </AdminLayout>
  );
}
