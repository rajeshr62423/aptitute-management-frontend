'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import QuestionForm from '@/components/admin/QuestionForm';
import { ArrowLeft } from 'lucide-react';
import {
  post_question_request,
  post_question_response_clear,
} from '@/redux/questions/action';
import { showToast } from '@/utils/toast';

export default function NewQuestionPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { post_question_data } = useSelector((state) => state.questions);

  useEffect(() => {
    if (post_question_data) {
      showToast('Question created successfully');
      dispatch(post_question_response_clear());
      router.push('/admin/questions');
    }
  }, [post_question_data, dispatch, router]);

  const handleSave = (qData) => {
    dispatch(post_question_request(qData));
  };

  return (
    <AdminLayout>
      <div className="page-head">
        <div>
          <h1 className="page-title">Add New Question</h1>
          <p className="page-subtitle">Add a new question to the assessment pool.</p>
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
        <QuestionForm
          onSave={handleSave}
          onCancel={() => router.push('/admin/questions')}
        />
      </section>
    </AdminLayout>
  );
}
