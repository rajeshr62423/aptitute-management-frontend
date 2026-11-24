'use client';

import React, { useState, useMemo, useEffect, Suspense, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import DataTable from '@/components/common/DataTable';
import ActionIconButton from '@/components/common/ActionIconButton';
import FilterDrawer from '@/components/common/FilterDrawer';
import Select from '@/components/common/Select';
import SearchBar from '@/components/common/SearchBar';
import QuestionForm from '@/components/admin/QuestionForm';
import { Plus, Filter } from 'lucide-react';
import {
  get_questions_request,
  post_question_request,
  put_question_request,
  delete_question_request,
  post_question_response_clear,
  put_question_response_clear,
  delete_question_response_clear,
} from '@/redux/questions/action';
import { showToast } from '@/utils/toast';

function QuestionsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const {
    get_questions_data: questions,
    post_question_data,
    put_question_data,
    delete_question_data,
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

  // Filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  // Handle post/put/delete responses from Redux
  useEffect(() => {
    if (post_question_data) {
      showToast('Question created successfully');
      const timer = setTimeout(() => {
        dispatch(post_question_response_clear());
        setIsEditModalOpen(false);
        setEditingQuestion(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [post_question_data, dispatch]);

  useEffect(() => {
    if (put_question_data) {
      showToast('Question updated successfully');
      const timer = setTimeout(() => {
        dispatch(put_question_response_clear());
        setIsEditModalOpen(false);
        setEditingQuestion(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [put_question_data, dispatch]);

  useEffect(() => {
    if (delete_question_data) {
      showToast('Question deleted');
      const timer = setTimeout(() => {
        dispatch(delete_question_response_clear());
        setDeletingId(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [delete_question_data, dispatch]);

  // Update URL helper
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

  // Filter Drawer handlers
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
        {/* Streamlined Toolbar */}
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
              id="questionSearch"
              name="questionSearch"
              placeholder="Search questions..."
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
            aria-label="Open question filters"
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

          {/* Active Questions Info Pill */}
          <span
            className="muted small"
            style={{
              marginLeft: 'auto',
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#fafaf9',
              border: '1px solid #f0eeeb',
            }}
          >
            <b style={{ color: '#16a34a' }}>{activeCount}</b> active questions
          </span>
        </div>

        {/* Questions Table with Enhanced Pagination */}
        <DataTable
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

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Questions"
        activeCount={activeFilterCount}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      >
        {/* Category Filter */}
        <Select
          label="Category"
          name="filterCategory"
          value={draftCategory}
          onChange={(e) => setDraftCategory(e.target.value)}
          placeholder="All categories"
          options={[
            { value: '', label: 'All categories' },
            { value: 'Quantitative', label: 'Quantitative' },
            { value: 'Logical Reasoning', label: 'Logical Reasoning' },
            { value: 'Verbal', label: 'Verbal' },
            { value: 'Technical', label: 'Technical' },
          ]}
        />

        {/* Difficulty Filter */}
        <Select
          label="Difficulty Level"
          name="filterDifficulty"
          value={draftDifficulty}
          onChange={(e) => setDraftDifficulty(e.target.value)}
          placeholder="All difficulty levels"
          options={[
            { value: '', label: 'All difficulty levels' },
            { value: 'Easy', label: 'Easy' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Hard', label: 'Hard' },
          ]}
        />

        {/* Status Filter */}
        <Select
          label="Question Status"
          name="filterStatus"
          value={draftStatus}
          onChange={(e) => setDraftStatus(e.target.value)}
          placeholder="All statuses"
          options={[
            { value: '', label: 'All statuses' },
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
        />
      </FilterDrawer>

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
