'use client';

import React, { Suspense, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import QuestionForm from '@/components/admin/QuestionForm';
import { ArrowLeft } from 'lucide-react';
import {
  put_question_request,
  put_question_response_clear,
  get_questions_request,
} from '@/redux/questions/action';
import { toast, showToast } from '@/utils/toast';

function EditQuestionContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const questionId = params?.id;

  const { get_questions_data: questions, put_question_data } = useSelector(
    (state) => state.questions
  );

  useEffect(() => {
    dispatch(get_questions_request());
  }, [dispatch]);

  useEffect(() => {
    if (put_question_data) {
      toast.success('Question details updated successfully.', { title: 'Updated' });
      dispatch(put_question_response_clear());
      router.push('/admin/questions');
    }
  }, [put_question_data, dispatch, router]);

  const question = (questions || []).find((q) => Number(q.id) === Number(questionId));

  const handleSave = (qData) => {
    dispatch(put_question_request(qData));
  };

  return (
    <AdminLayout>
      <div className="page-head">
        <div>
          <h1 className="page-title">Edit Question</h1>
          <p className="page-subtitle">Update question details and answers.</p>
        </div>
        <div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/admin/questions')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} />
            <span>Back to questions</span>
          </Button>
        </div>
      </div>

      <section className="panel" style={{ maxWidth: '800px' }}>
        {question ? (
          <QuestionForm
            key={question.id}
            initialData={question}
            onSave={handleSave}
            onCancel={() => router.push('/admin/questions')}
          />
        ) : (
          <div className="empty">Question not found.</div>
        )}
      </section>
    </AdminLayout>
  );
}

export default function EditQuestionPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="empty">Loading question...</div>
        </AdminLayout>
      }
    >
      <EditQuestionContent />
    </Suspense>
  );
}
