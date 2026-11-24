'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/forms/Input';
import { post_admin_logout_request } from '@/redux/auth/action';
import { showToast } from '@/utils/toast';

const profileSchema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().trim().required('Email is required').email('Enter a valid email'),
});

export default function AdminProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { adminUser } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({
    name: adminUser?.name || 'Administrator',
    email: adminUser?.email || 'admin@aptitudepro.com',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentProfile.name,
      email: currentProfile.email,
    },
    resolver: yupResolver(profileSchema),
  });

  const handleSignOut = () => {
    dispatch(post_admin_logout_request());
    router.push('/admin/login');
  };

  const onSubmit = (values) => {
    setCurrentProfile(values);
    setIsEditing(false);
    showToast('Admin profile updated successfully');
  };

  return (
    <AdminLayout>
      <div className="page-head">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Administrator account information.</p>
        </div>
      </div>

      <section className="panel" style={{ maxWidth: '600px' }}>
        <div
          className="avatar"
          style={{ width: '60px', height: '60px', fontSize: '22px' }}
        >
          {currentProfile.name ? currentProfile.name[0] : 'A'}
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '14px 0 2px' }}>
          {currentProfile.name}
        </h2>
        <p className="muted" style={{ margin: '0 0 16px' }}>
          {currentProfile.email}
        </p>

        <div className="divider" />

        {!isEditing ? (
          <div>
            <p style={{ margin: '8px 0' }}>
              <b>Role:</b> Super Administrator
            </p>
            <p style={{ margin: '8px 0' }}>
              <b>Session:</b> Secure · 8 hours
            </p>
            <div style={{ marginTop: '22px', display: 'flex', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
              <Button variant="secondary" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Input
                control={control}
                name="name"
                label="Full name"
                required
                errors={errors}
              />
              <Input
                control={control}
                name="email"
                type="email"
                label="Email address"
                required
                errors={errors}
              />
            </div>

            <div style={{ marginTop: '22px', display: 'flex', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Profile
              </Button>
            </div>
          </form>
        )}
      </section>
    </AdminLayout>
  );
}
