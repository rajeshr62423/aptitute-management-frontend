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
import Badge from '@/components/common/Badge';
import LogoutConfirmModal from '@/components/common/LogoutConfirmModal';
import { post_admin_logout_request } from '@/redux/auth/action';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/utils/toast';
import {
  User,
  Mail,
  ShieldCheck,
  KeyRound,
  Clock,
  CheckCircle2,
  Edit3,
  LogOut,
  Building,
  Calendar,
} from 'lucide-react';

const profileSchema = yup.object().shape({
  name: yup.string().trim().required('Full name is required'),
  email: yup.string().trim().required('Email address is required').email('Enter a valid email address'),
});

export default function AdminProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAuth();
  const { adminUser } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({
    name: adminUser?.name || 'Administrator',
    email: adminUser?.email || 'admin@aptitudepro.com',
    role: adminUser?.role || 'Super Administrator',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: currentProfile.name,
      email: currentProfile.email,
    },
    resolver: yupResolver(profileSchema),
  });

  const handleSignOut = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      if (auth?.logout) {
        auth.logout();
      }
      dispatch(post_admin_logout_request());
      setShowLogoutModal(false);
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  const onSubmit = (values) => {
    setCurrentProfile((prev) => ({
      ...prev,
      name: values.name,
      email: values.email,
    }));
    setIsEditing(false);
    toast.success('Administrator profile updated successfully.', {
      title: 'Profile Updated',
    });
  };

  const handleCancelEdit = () => {
    reset({
      name: currentProfile.name,
      email: currentProfile.email,
    });
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="page-head">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">
            View and manage your administrator credentials, role access, and account settings.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', maxWidth: '1000px' }}>
        {/* Profile Card Summary */}
        <section className="panel" style={{ padding: '0', overflow: 'hidden', height: 'fit-content' }}>
          {/* Top Banner Gradient */}
          <div
            style={{
              height: '100px',
              background: 'linear-gradient(135deg, #ff6b0a 0%, #ea580c 50%, #c2410c 100%)',
              position: 'relative',
            }}
          />

          <div style={{ padding: '0 24px 24px', position: 'relative' }}>
            {/* Avatar with Elevation Ring */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b0a 0%, #ea580c 100%)',
                color: '#ffffff',
                fontSize: '32px',
                fontWeight: 800,
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
                border: '4px solid #ffffff',
                marginTop: '-42px',
                marginBottom: '14px',
              }}
            >
              {currentProfile.name ? currentProfile.name[0].toUpperCase() : 'A'}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
                  {currentProfile.name}
                </h2>
                <p style={{ margin: '0 0 10px', color: '#6b7280', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} className="text-stone-400" />
                  <span>{currentProfile.email}</span>
                </p>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#ea580c',
                  backgroundColor: '#fff7ed',
                  border: '1px solid #fed7aa',
                  padding: '4px 10px',
                  borderRadius: '16px',
                }}
              >
                <ShieldCheck size={13} />
                <span>{currentProfile.role}</span>
              </div>
            </div>

            <div className="divider" style={{ margin: '18px 0' }} />

            {!isEditing ? (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Account Status</span>
                    <Badge variant="pass">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} />
                        Active
                      </span>
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Session Timeout</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>7 Days (Auto-renew)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Organization</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>AptitudePro Core</span>
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Edit3 size={15} />
                    <span>Edit Profile</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleSignOut}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#dc2626' }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <Input
                    control={control}
                    name="name"
                    label="Full Name"
                    placeholder="Enter full name"
                    required
                    errors={errors}
                  />
                  <Input
                    control={control}
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter email address"
                    required
                    errors={errors}
                  />
                </div>

                <div style={{ marginTop: '22px', display: 'flex', gap: '10px' }}>
                  <Button variant="secondary" onClick={handleCancelEdit} style={{ flex: 1 }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={isSubmitting} loadingText="Saving..." style={{ flex: 1 }}>
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Detailed Account Information Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Security & Access Section */}
          <section className="panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound size={17} style={{ color: '#ff6b0a' }} />
              <span>Security & Access Rights</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fafaf9', border: '1px solid #f0eeeb' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937', marginBottom: '4px' }}>
                  Full Platform Administration
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>
                  Granted permission to create, update, delete questions, review candidate assessment scores, export CSV records, and configure system scoring rules.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#6b7280' }}>
                <Clock size={15} style={{ color: '#16a34a' }} />
                <span>Session state is secured using JWT bearer tokens with cryptographic signing.</span>
              </div>
            </div>
          </section>

          {/* System Environment */}
          <section className="panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={17} style={{ color: '#ff6b0a' }} />
              <span>Platform Context</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ display: 'block', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Environment
                </span>
                <span style={{ fontWeight: 600, color: '#111827' }}>AptitudePro SaaS Core</span>
              </div>
              <div>
                <span style={{ display: 'block', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Deployment Region
                </span>
                <span style={{ fontWeight: 600, color: '#111827' }}>Global (ap-south-1)</span>
              </div>
              <div>
                <span style={{ display: 'block', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Account Level
                </span>
                <span style={{ fontWeight: 600, color: '#111827' }}>Level 1 Administrator</span>
              </div>
              <div>
                <span style={{ display: 'block', color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Assessment Engine
                </span>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>v1.0 Online</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isAssessmentActive={false}
        role="admin"
      />
    </AdminLayout>
  );
}
