'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/common/Button';
import Input from '@/components/common/forms/Input';
import PasswordInput from '@/components/common/forms/PasswordInput';
import Checkbox from '@/components/common/forms/Checkbox';
import {
  post_admin_login_request,
  post_admin_login_response_clear,
} from '@/redux/auth/action';
import { showToast } from '@/utils/toast';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Enter a valid email'),
  password: yup.string().required('Password is required'),
  rememberMe: yup.boolean(),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    isAuthenticated,
    post_admin_loading,
    post_admin_error,
  } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (post_admin_error) {
      showToast(post_admin_error);
      dispatch(post_admin_login_response_clear());
    }
  }, [post_admin_error, dispatch]);

  const onSubmit = (values) => {
    dispatch(post_admin_login_request(values));
  };

  return (
    <div className="login-shell">
      <section className="login-hero">
        <div className="hero-copy">
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '8px' }}>
            <div className="brand">
              <span className="brand-mark">A</span>
              <span>AptitudePro</span>
            </div>
            <span className="tag">ADMIN</span>
          </div>

          <h1>
            Welcome back<br />
            to <span>AptitudePro</span>
          </h1>
          <p>Manage assessments, candidates and performance in one place.</p>
        </div>
      </section>

      <section className="login-side">
        <div className="login-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div className="brand">
              <span className="brand-mark">A</span>
              <span>AptitudePro</span>
            </div>
            <span className="tag">ADMIN</span>
          </div>

          <h2>Sign in</h2>
          <p className="muted">Manage your assessment platform.</p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '10px' }}>
            <Input
              control={control}
              name="email"
              type="email"
              label="Email"
              placeholder="you@company.com"
              required
              errors={errors}
            />

            <PasswordInput
              control={control}
              name="password"
              label="Password"
              placeholder="Your password"
              required
              errors={errors}
            />

            <div className="remember-row">
              <Checkbox
                control={control}
                name="rememberMe"
                label="Remember me"
                errors={errors}
              />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Password reset: contact your administrator');
                }}
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={post_admin_loading}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {post_admin_loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="login-foot">
            ♙ Secured session · Signs out automatically after 8 hours
            <div style={{ marginTop: '10px' }}>
              <Link href="/register" className="small">
                ← Go to Candidate Registration
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
