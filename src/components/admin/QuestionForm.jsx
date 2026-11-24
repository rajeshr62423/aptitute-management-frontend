'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/common/Button';
import Input from '@/components/common/forms/Input';
import TextArea from '@/components/common/forms/TextArea';
import Select from '@/components/common/forms/Select';
import Checkbox from '@/components/common/forms/Checkbox';

const questionSchema = yup.object().shape({
  text: yup.string().trim().required('Question text is required'),
  option0: yup.string().trim().required('Option A is required'),
  option1: yup.string().trim().required('Option B is required'),
  option2: yup.string().trim().required('Option C is required'),
  option3: yup.string().trim().required('Option D is required'),
  correct: yup.number().typeError('Please select a correct option').required('Correct option is required'),
  category: yup.string().required('Category is required'),
  difficulty: yup.string().required('Difficulty is required'),
  active: yup.boolean(),
});

export default function QuestionForm({
  initialData = null,
  onSave,
  onCancel,
  isModal = false,
  formId = 'question-form',
  hideActions = false,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      text: initialData?.text || '',
      option0: initialData?.options?.[0] || '',
      option1: initialData?.options?.[1] || '',
      option2: initialData?.options?.[2] || '',
      option3: initialData?.options?.[3] || '',
      correct: Number(initialData?.correct) || 0,
      category: initialData?.category || 'Quantitative',
      difficulty: initialData?.difficulty || 'Easy',
      active: initialData?.active ?? true,
    },
    resolver: yupResolver(questionSchema),
  });

  const onSubmit = (values) => {
    const qData = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      text: values.text,
      options: [values.option0, values.option1, values.option2, values.option3],
      correct: Number(values.correct),
      category: values.category,
      difficulty: values.difficulty,
      active: Boolean(values.active),
    };
    onSave(qData);
  };

  const correctOptions = [
    { value: 0, label: 'Option A' },
    { value: 1, label: 'Option B' },
    { value: 2, label: 'Option C' },
    { value: 3, label: 'Option D' },
  ];

  const categories = [
    { value: 'Quantitative', label: 'Quantitative' },
    { value: 'Logical Reasoning', label: 'Logical Reasoning' },
    { value: 'Verbal', label: 'Verbal' },
  ];

  const difficulties = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
  ];

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginTop: '4px' }}>
        <TextArea
          full
          control={control}
          name="text"
          label="Question text"
          placeholder="Enter question text"
          required
          errors={errors}
        />
      </div>

      <div className="form-grid" style={{ marginTop: '14px' }}>
        <Input
          control={control}
          name="option0"
          label="Option A"
          placeholder="Option A text"
          required
          errors={errors}
        />

        <Input
          control={control}
          name="option1"
          label="Option B"
          placeholder="Option B text"
          required
          errors={errors}
        />

        <Input
          control={control}
          name="option2"
          label="Option C"
          placeholder="Option C text"
          required
          errors={errors}
        />

        <Input
          control={control}
          name="option3"
          label="Option D"
          placeholder="Option D text"
          required
          errors={errors}
        />

        <Select
          control={control}
          name="correct"
          label="Correct answer"
          options={correctOptions}
          errors={errors}
        />

        <Select
          control={control}
          name="category"
          label="Category"
          options={categories}
          errors={errors}
        />

        <Select
          control={control}
          name="difficulty"
          label="Difficulty"
          options={difficulties}
          errors={errors}
        />

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
          <Checkbox
            control={control}
            name="active"
            label="Active question"
            errors={errors}
          />
        </div>
      </div>

      {!hideActions && (
        <div
          className={isModal ? 'modal-actions' : ''}
          style={!isModal ? { marginTop: '22px', display: 'flex', gap: '10px' } : {}}
        >
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary">
            Save Question
          </Button>
        </div>
      )}
    </form>
  );
}
