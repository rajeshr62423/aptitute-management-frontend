'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/common/StatCard';
import Badge from '@/components/common/Badge';
import ActionIconButton from '@/components/common/ActionIconButton';
import { get_dashboard_stats_request } from '@/redux/dashboard/action';
import { set_selected_candidate } from '@/redux/candidates/action';

export default function AdminDashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { get_dashboard_stats_data: stats } = useSelector((state) => state.dashboard);
  const { get_candidates_data: candidates } = useSelector((state) => state.candidates);

  useEffect(() => {
    dispatch(get_dashboard_stats_request());
  }, [dispatch]);

  const totalCandidates = stats?.totalCandidates ?? (candidates?.length || 0);
  const passCandidates = stats?.passCount ?? (candidates ? candidates.filter((c) => c.status === 'Pass').length : 0);
  const failCandidates = stats?.failCount ?? (totalCandidates - passCandidates);
  const averageScore = stats?.averageScore ?? (totalCandidates ? Math.round(candidates.reduce((sum, c) => sum + (c.percent || 0), 0) / totalCandidates) : 0);
  const passRate = stats?.passRate ?? (totalCandidates ? Math.round((passCandidates / totalCandidates) * 100) : 0);

  const chartData = [
    { label: 'Apr', value: 35 },
    { label: 'May', value: 48 },
    { label: 'Jun', value: 42 },
    { label: 'Jul', value: 60 },
    { label: 'Aug', value: 54 },
    { label: 'Sep', value: 72 },
    { label: 'Oct', value: 65 },
    { label: 'Nov', value: 88 },
  ];

  const recentCandidates = stats?.recentActivity || (candidates ? candidates.slice(0, 5) : []);

  const handleViewCandidate = (candidate) => {
    dispatch(set_selected_candidate(candidate));
    router.push(`/admin/candidates/${encodeURIComponent(candidate.email)}`);
  };

  return (
    <AdminLayout>
      <div className="page-head">
        <div>
          <h1 className="page-title">Welcome, Admin!</h1>
          <p className="page-subtitle">Here’s what’s happening with AptitudePro.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Total Candidates"
          value={totalCandidates}
          note="Registered candidates"
        />
        <StatCard
          label="Tests Completed"
          value={totalCandidates}
          note="Completed submissions"
        />
        <StatCard
          label="Average Score"
          value={`${averageScore}%`}
          note="Across all submissions"
        />
        <StatCard
          label="Pass Rate"
          value={`${passRate}%`}
          note="Candidates who passed"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <h3 className="panel-title">Candidate performance</h3>
          <div className="chart">
            {chartData.map((d) => (
              <div
                key={d.label}
                className="bar"
                style={{ height: `${d.value}%` }}
                data-label={d.label}
              />
            ))}
          </div>
          <div className="chart-legend">
            <span>
              <i className="dot" />
              Completed assessments
            </span>
          </div>
        </section>

        <section className="panel">
          <h3 className="panel-title">Pass vs Fail</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <div
              className="donut"
              data-percent={`${passRate}%`}
              style={{
                background: `conic-gradient(var(--green) 0 ${passRate}%, #ef4444 ${passRate}% 100%)`,
              }}
            />
            <div className="small">
              <p style={{ margin: '6px 0' }}>
                <i className="dot" style={{ background: '#16a34a' }} />
                Pass: {passCandidates}
              </p>
              <p style={{ margin: '6px 0' }}>
                <i className="dot" style={{ background: '#ef4444' }} />
                Fail: {failCandidates}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="panel" style={{ marginTop: '17px' }}>
        <div className="page-head" style={{ marginBottom: '10px' }}>
          <h3 className="panel-title" style={{ margin: 0 }}>
            Recent candidate activity
          </h3>
          <Link href="/admin/candidates" className="small">
            View all
          </Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Email</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Attempt date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    No candidates found.
                  </td>
                </tr>
              ) : (
                recentCandidates.map((c) => (
                  <tr key={c.email}>
                    <td>
                      <b>{c.name}</b>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.score}/20</td>
                    <td>{c.percent}%</td>
                    <td>
                      <Badge variant={c.status === 'Pass' ? 'pass' : 'fail'}>
                        {c.status}
                      </Badge>
                    </td>
                    <td>{c.date}</td>
                    <td style={{ textAlign: 'center' }}>
                      <ActionIconButton
                        action="view"
                        tooltip={`View ${c.name}'s performance`}
                        ariaLabel={`View details for ${c.name}`}
                        onClick={() => handleViewCandidate(c)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
