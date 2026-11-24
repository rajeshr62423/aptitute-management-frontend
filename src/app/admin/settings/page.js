'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/forms/Input';
import Checkbox from '@/components/common/forms/Checkbox';
import TextArea from '@/components/common/forms/TextArea';
import { DEFAULT_TERMS, DEFAULT_PRIVACY } from '@/services/storageService';
import {
  get_settings_request,
  put_settings_request,
  put_settings_response_clear,
} from '@/redux/assessment/action';
import { get_questions_request } from '@/redux/questions/action';
import { showToast } from '@/utils/toast';

const settingsSchema = yup.object().shape({
  duration: yup
    .number()
    .typeError('Duration must be a number')
    .min(1, 'Must be at least 1 minute')
    .required('Duration is required'),
  pass: yup
    .number()
    .typeError('Passing percentage must be a number')
    .min(0, 'Min 0%')
    .max(100, 'Max 100%')
    .required('Passing percentage is required'),
  correct: yup
    .number()
    .typeError('Marks must be a number')
    .required('Correct answer marks are required'),
  wrong: yup
    .number()
    .typeError('Marks must be a number')
    .required('Wrong answer marks are required'),
  unattempted: yup
    .number()
    .typeError('Marks must be a number')
    .required('Unattempted marks are required'),
  total: yup
    .number()
    .typeError('Total questions must be a number')
    .min(1, 'At least 1 question required')
    .required('Total questions is required'),
  active: yup.boolean(),
  terms: yup.string().nullable(),
  privacy: yup.string().nullable(),
});

function SettingsForm({ settings, activeQuestionsCount }) {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      duration: Number(settings?.duration) || 15,
      pass: Number(settings?.pass) || 60,
      correct: Number(settings?.correct) || 2,
      wrong: Number(settings?.wrong) || -1,
      unattempted: Number(settings?.unattempted) || 0,
      total: Number(settings?.total) || 10,
      active: settings?.active ?? true,
      terms: settings?.terms ?? DEFAULT_TERMS,
      privacy: settings?.privacy ?? DEFAULT_PRIVACY,
    },
    resolver: yupResolver(settingsSchema),
  });

  const onSubmit = (values) => {
    dispatch(
      put_settings_request({
        duration: Number(values.duration),
        pass: Number(values.pass),
        correct: Number(values.correct),
        wrong: Number(values.wrong),
        unattempted: Number(values.unattempted),
        total: Number(values.total),
        active: Boolean(values.active),
        terms: values.terms || '',
        privacy: values.privacy || '',
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <Input
          control={control}
          name="duration"
          type="number"
          label="Test duration (minutes)"
          required
          errors={errors}
        />

        <Input
          control={control}
          name="pass"
          type="number"
          label="Passing percentage"
          required
          errors={errors}
        />

        <Input
          control={control}
          name="correct"
          type="number"
          step="0.5"
          label="Correct answer marks"
          required
          errors={errors}
        />

        <Input
          control={control}
          name="wrong"
          type="number"
          step="0.5"
          label="Wrong answer marks"
          required
          errors={errors}
        />

        <Input
          control={control}
          name="unattempted"
          type="number"
          step="0.5"
          label="Unattempted marks"
          required
          errors={errors}
        />

        <Input
          control={control}
          name="total"
          type="number"
          label={`Total questions (max ${activeQuestionsCount || 100})`}
          required
          errors={errors}
        />

        <div style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
          <Checkbox
            control={control}
            name="active"
            label="Assessment active and accepting candidates"
            errors={errors}
          />
        </div>

        <div className="divider" style={{ gridColumn: '1 / -1', margin: '14px 0 6px 0' }} />

        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1c1917', marginBottom: '4px' }}>
            Candidate Terms &amp; Privacy Policy
          </h3>
          <p style={{ fontSize: '13px', color: '#78716c', marginBottom: '14px' }}>
            These terms are displayed to candidates on the registration page when they click the Terms &amp; Privacy Policy links.
          </p>
        </div>

        <TextArea
          full
          control={control}
          name="terms"
          label="Terms of Service"
          placeholder="Enter terms of service..."
          rows={5}
          errors={errors}
        />

        <TextArea
          full
          control={control}
          name="privacy"
          label="Privacy Policy"
          placeholder="Enter privacy policy..."
          rows={5}
          errors={errors}
        />
      </div>

      <div className="divider" />

      <Button type="submit" variant="primary">
        Save Settings
      </Button>
    </form>
  );
}

export default function AssessmentSettingsPage() {
  const dispatch = useDispatch();

  const { get_settings_data: settings, put_settings_data } = useSelector(
    (state) => state.assessment
  );
  const { get_questions_data: questions } = useSelector((state) => state.questions);

  useEffect(() => {
    dispatch(get_settings_request());
    dispatch(get_questions_request());
  }, [dispatch]);

  useEffect(() => {
    if (put_settings_data) {
      showToast('Assessment settings saved');
      dispatch(put_settings_response_clear());
    }
  }, [put_settings_data, dispatch]);

  const activeQuestionsCount = (questions || []).filter((q) => q.active).length;

  return (
    <AdminLayout>
      <div className="page-head">
        <div>
          <h1 className="page-title">Assessment Settings</h1>
          <p className="page-subtitle">Configure scoring rules and test availability.</p>
        </div>
      </div>

      <section className="panel" style={{ maxWidth: '850px' }}>
        <SettingsForm
          key={settings ? `${settings._id || 'loaded'}-${settings.duration}-${settings.pass}-${settings.terms ? settings.terms.length : 0}` : 'loading'}
          settings={settings}
          activeQuestionsCount={activeQuestionsCount}
        />
      </section>
    </AdminLayout>
  );
}
