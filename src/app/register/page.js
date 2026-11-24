'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import CandidateLayout from '@/components/layout/CandidateLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/forms/Input';
import Select from '@/components/common/forms/Select';
import PhoneInput from '@/components/common/forms/PhoneInput';
import Modal from '@/components/common/Modal';
import { isValidPhoneNumber } from 'react-phone-number-input';
import {
  post_candidate_register_request,
  post_candidate_register_response_clear,
} from '@/redux/candidates/action';
import { get_settings_request } from '@/redux/assessment/action';
import { DEFAULT_TERMS, DEFAULT_PRIVACY } from '@/services/storageService';
import { showToast } from '@/utils/toast';
import { ArrowRight, Target, BarChart3, Briefcase, Sparkles } from 'lucide-react';

const registrationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .trim()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .trim()
    .required('Phone number is required')
    .test('is-valid-phone', 'Please enter a valid phone number', (value) => {
      if (!value) return false;
      return isValidPhoneNumber(value);
    }),
  age: yup
    .number()
    .typeError('Age must be a number')
    .required('Age is required')
    .min(16, 'Age must be at least 16')
    .max(100, 'Age must be at most 100'),
  gender: yup.string().nullable(),
  qualification: yup.string().required('Highest qualification is required'),
  city: yup.string().trim().required('City is required'),
});

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | null

  const {
    post_candidate_register_loading,
    post_candidate_register_data,
    post_candidate_register_error,
  } = useSelector((state) => state.candidates);

  const { get_settings_data: settings } = useSelector((state) => state.assessment);

  useEffect(() => {
    dispatch(get_settings_request());
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      qualification: '',
      city: '',
    },
    resolver: yupResolver(registrationSchema),
  });

  // Handle Redux registration response
  useEffect(() => {
    if (post_candidate_register_data) {
      dispatch(post_candidate_register_response_clear());
      router.push('/assessment/instructions');
    }
  }, [post_candidate_register_data, dispatch, router]);

  // Handle Redux registration error
  useEffect(() => {
    if (post_candidate_register_error) {
      showToast(post_candidate_register_error);
      dispatch(post_candidate_register_response_clear());
    }
  }, [post_candidate_register_error, dispatch]);

  const onSubmit = (values) => {
    dispatch(post_candidate_register_request(values));
  };

  const topbarRight = (
    <div className="header-nav-right">
      <Link href="/admin/login" className="header-admin-btn">
        Admin login
      </Link>
    </div>
  );

  const qualifications = [
    'High School',
    'Diploma',
    "Bachelor's Degree",
    "Master's Degree",
    'PhD',
    'Other',
  ];

  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  return (
    <CandidateLayout rightContent={topbarRight} fullWidth>
      {/* Decorative ambient background glows */}
      <div
        style={{
          position: 'fixed',
          top: '-100px',
          left: '-80px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 22, 0.08) 0%, rgba(255, 107, 22, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-80px',
          right: '5%',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(23, 32, 51, 0.06) 0%, rgba(23, 32, 51, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="registration-wrapper">
        <div className="registration-grid">
          {/* Left section – Branding and introduction */}
          <div className="registration-left">
            <div className="left-badge">
              <Sparkles size={14} style={{ color: '#FF6B16' }} />
              <span>Next-Gen Candidate Assessment</span>
            </div>

            <h1 className="left-headline">
              Your Journey to Career Success Starts Here.
            </h1>

            <p className="left-description">
              Benchmark your quantitative, logical, and verbal problem-solving skills with AptitudePro’s standardized assessment. Fast, objective, and trusted by top-tier hiring teams.
            </p>

            <div className="benefit-list">
              {/* Highlight 1: Assess Your Skills */}
              <div className="benefit-item">
                <div className="benefit-icon-box">
                  <Target size={22} style={{ color: '#FF6B16' }} />
                </div>
                <div>
                  <h3 className="benefit-title">Assess Your Skills</h3>
                  <p className="benefit-desc">
                    Comprehensive evaluation across quantitative, logical, and verbal reasoning calibrated against industry benchmarks.
                  </p>
                </div>
              </div>

              {/* Highlight 2: Discover Your Strengths */}
              <div className="benefit-item">
                <div className="benefit-icon-box">
                  <BarChart3 size={22} style={{ color: '#FF6B16' }} />
                </div>
                <div>
                  <h3 className="benefit-title">Discover Your Strengths</h3>
                  <p className="benefit-desc">
                    Instant score analytics, category metrics, and percentile rankings that highlight your unique analytical capabilities.
                  </p>
                </div>
              </div>

              {/* Highlight 3: Unlock Career Opportunities */}
              <div className="benefit-item">
                <div className="benefit-icon-box">
                  <Briefcase size={22} style={{ color: '#FF6B16' }} />
                </div>
                <div>
                  <h3 className="benefit-title">Unlock Career Opportunities</h3>
                  <p className="benefit-desc">
                    Gain verified credentials to stand out and fast-track your profile with premier corporate recruitment partners.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust and Social Proof Strip */}
            <div className="trust-strip">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex' }}>
                  <span className="trust-avatar" style={{ background: '#FFEDD5', color: '#EA580C' }}>RK</span>
                  <span className="trust-avatar" style={{ background: '#DBEAFE', color: '#2563EB', marginLeft: '-8px' }}>AS</span>
                  <span className="trust-avatar" style={{ background: '#DCFCE7', color: '#16A34A', marginLeft: '-8px' }}>KP</span>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#172033' }}>10,000+ Candidates</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Assessed &amp; Benchmarked</div>
                </div>
              </div>
              <div style={{ height: '26px', width: '1px', background: '#E2E8F0' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#FF6B16' }}>15 Mins</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Adaptive Test</div>
              </div>
            </div>
          </div>

          {/* Right section – Registration form card */}
          <div className="registration-right">
            <div className="registration-card">
              <div style={{ marginBottom: '22px' }}>
                <span className="tag" style={{
                  background: '#FFF7ED',
                  color: '#EA580C',
                  border: '1px solid #FFEDD5',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  display: 'inline-block'
                }}>
                  CANDIDATE REGISTRATION
                </span>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#172033',
                  letterSpacing: '-0.025em',
                  margin: '12px 0 6px 0'
                }}>
                  Start Your Assessment Journey
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#64748B',
                  margin: 0
                }}>
                  Register to begin your aptitude assessment.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-grid">
                  <Input
                    full
                    control={control}
                    name="name"
                    label="Full name"
                    placeholder="Enter your full name"
                    required
                    errors={errors}
                  />

                  <Input
                    control={control}
                    name="email"
                    type="email"
                    label="Email address"
                    placeholder="you@example.com"
                    required
                    errors={errors}
                  />

                  <PhoneInput
                    control={control}
                    name="phone"
                    label="Phone number"
                    placeholder="Enter phone number"
                    required
                    defaultCountry="IN"
                    errors={errors}
                  />

                  <Input
                    control={control}
                    name="age"
                    type="number"
                    label="Age"
                    placeholder="Your age"
                    required
                    errors={errors}
                  />

                  <Select
                    control={control}
                    name="gender"
                    label="Gender"
                    placeholder="Select gender"
                    options={genders}
                    errors={errors}
                  />

                  <Select
                    control={control}
                    name="qualification"
                    label="Highest qualification"
                    placeholder="Select qualification"
                    options={qualifications}
                    required
                    errors={errors}
                  />

                  <Input
                    control={control}
                    name="city"
                    label="City"
                    placeholder="Your city"
                    required
                    errors={errors}
                  />
                </div>

                <button
                  type="submit"
                  disabled={post_candidate_register_loading}
                  className="btn-register-continue"
                >
                  <span>{post_candidate_register_loading ? 'Registering...' : 'Register & Continue'}</span>
                  {!post_candidate_register_loading && (
                    <ArrowRight size={17} className="btn-arrow-icon" />
                  )}
                </button>

                <p className="tiny muted center" style={{ marginTop: '16px', fontSize: '12px', color: '#64748B' }}>
                  By registering, you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="disclaimer-link"
                  >
                    Terms of Service
                  </button>{' '}
                  &amp;{' '}
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="disclaimer-link"
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header-nav-right {
          display: flex;
          align-items: center;
        }
        .header-admin-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #172033;
          font-weight: 600;
          font-size: 13px;
          text-decoration: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          transition: all 0.15s ease;
        }
        .header-admin-btn:hover {
          background: #fff7ed;
          border-color: #fed7aa;
          color: #ea580c;
        }
        .registration-wrapper {
          position: relative;
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
          padding: 64px 24px 72px;
          z-index: 1;
        }
        .registration-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.15fr);
          gap: 56px;
          align-items: start;
        }
        .registration-left {
          padding-top: 10px;
          animation: fadeInLeft 0.4s ease-out;
        }
        .registration-right {
          animation: fadeInRight 0.4s ease-out;
        }
        .left-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: #fff7ed;
          border: 1px solid #ffedd5;
          color: #ea580c;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(255, 107, 22, 0.08);
        }
        .left-headline {
          font-size: clamp(28px, 3.4vw, 42px);
          font-weight: 800;
          color: #172033;
          line-height: 1.18;
          letter-spacing: -0.03em;
          margin: 0 0 16px 0;
        }
        .left-description {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 34px 0;
          max-width: 500px;
        }
        .benefit-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: transform 0.2s ease;
        }
        .benefit-item:hover {
          transform: translateX(3px);
        }
        .benefit-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border: 1px solid #fed7aa;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(255, 107, 22, 0.12);
        }
        .benefit-title {
          font-size: 15px;
          font-weight: 700;
          color: #172033;
          margin: 0 0 3px 0;
        }
        .benefit-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }
        .trust-strip {
          margin-top: 36px;
          padding: 16px 20px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 14px -2px rgba(23, 32, 51, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          max-width: 500px;
        }
        .trust-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 11px;
          font-weight: 800;
          border: 2px solid white;
        }
        .registration-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 34px 32px;
          box-shadow: 0 20px 45px -12px rgba(23, 32, 51, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .registration-card:hover {
          box-shadow: 0 24px 55px -12px rgba(23, 32, 51, 0.12), 0 3px 8px rgba(0, 0, 0, 0.04);
        }
        .registration-card :global(.field label) {
          font-size: 13px !important;
          font-weight: 600 !important;
          color: #172033 !important;
          margin-bottom: 6px !important;
          display: block !important;
        }
        .registration-card :global(.field input:not(.phone-number-field)) {
          height: 44px !important;
          border-radius: 8px !important;
          border: 1px solid #d1d5db !important;
          font-size: 14px !important;
          color: #172033 !important;
          background: #ffffff !important;
          transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
        }
        .registration-card :global(.field input:not(.phone-number-field):hover) {
          border-color: #94a3b8 !important;
        }
        .registration-card :global(.field input:not(.phone-number-field):focus) {
          border-color: #ff6500 !important;
          box-shadow: 0 0 0 3px rgba(255, 101, 0, 0.16) !important;
        }
        .registration-card :global(.field input::placeholder) {
          color: #94a3b8 !important;
        }
        .registration-card :global(.phone-number-field) {
          border: none !important;
          outline: none !important;
          background: transparent !important;
          box-shadow: none !important;
          height: 100% !important;
          padding: 0 12px 0 0 !important;
        }
        .btn-register-continue {
          width: 100%;
          margin-top: 24px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #ff6b16 0%, #ea580c 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 20px -4px rgba(255, 107, 22, 0.38);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-register-continue:hover:not(:disabled) {
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          box-shadow: 0 12px 26px -4px rgba(255, 107, 22, 0.48);
          transform: translateY(-1px);
        }
        .btn-register-continue:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-register-continue:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }
        .btn-arrow-icon {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-register-continue:hover:not(:disabled) .btn-arrow-icon {
          transform: translateX(4px);
        }
        .disclaimer-link {
          background: none;
          border: none;
          padding: 0;
          color: #ff6b16;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
          font: inherit;
        }
        .disclaimer-link:hover {
          color: #ea580c;
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 1024px) {
          .registration-wrapper {
            padding: 48px 20px 56px;
          }
          .registration-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .registration-left {
            padding-top: 0;
          }
        }
        @media (max-width: 640px) {
          .registration-wrapper {
            padding: 36px 16px 48px;
          }
          .registration-card {
            padding: 24px 18px;
            border-radius: 14px;
          }
        }
      `}</style>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
        title="Terms of Service"
        width="600px"
        actions={
          <Button variant="primary" onClick={() => setActiveModal(null)}>
            I Understand &amp; Agree
          </Button>
        }
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
          {(settings?.terms || DEFAULT_TERMS)
            .split('\n')
            .filter((p) => p.trim())
            .map((para, i) => (
              <p
                key={i}
                style={{
                  marginBottom: '12px',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#374151',
                }}
              >
                {para}
              </p>
            ))}
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
        title="Privacy Policy"
        width="600px"
        actions={
          <Button variant="primary" onClick={() => setActiveModal(null)}>
            Close
          </Button>
        }
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
          {(settings?.privacy || DEFAULT_PRIVACY)
            .split('\n')
            .filter((p) => p.trim())
            .map((para, i) => (
              <p
                key={i}
                style={{
                  marginBottom: '12px',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#374151',
                }}
              >
                {para}
              </p>
            ))}
        </div>
      </Modal>
    </CandidateLayout>
  );
}
