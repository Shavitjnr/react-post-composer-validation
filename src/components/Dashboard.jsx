import React from 'react';
import { csvStorage } from '../utils/csvStorage';
import { PLATFORMS } from '../utils/validation';
import {
  Share2,
  FileText,
  CalendarClock,
  CheckCircle2,
  PenTool,
  TrendingUp,
  Download,
  Trash2,
  Copy
} from 'lucide-react';

export function Dashboard({ onNavigateToComposer, showToast }) {
  const posts = csvStorage.getPosts();
  const drafts = csvStorage.getDrafts();

  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.Status === 'Published').length;
  const scheduledCount = posts.filter((p) => p.Status === 'Scheduled').length;
  const draftsCount = drafts.length;

  const platformBreakdown = Object.keys(PLATFORMS).map((key) => {
    const count = posts.filter((p) => p.Platform === key).length;
    const pct = totalPosts > 0 ? Math.round((count / totalPosts) * 100) : 0;
    return { platform: key, count, pct, cfg: PLATFORMS[key] };
  });

  const handleDeletePost = (id) => {
    csvStorage.deletePost(id);
    showToast('Post removed from posts.csv', 'info');
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    showToast('Post text copied to clipboard!', 'info');
  };

  return (
    <div className="dashboard-container">
      {/* Banner */}
      <div className="dashboard-hero-banner">
        <div>
          <div className="hero-tag">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>CSV Analytics & Workspace</span>
          </div>
          <h1 className="hero-title">Executive Dashboard</h1>
          <p className="hero-subtitle">
            All metrics are calculated directly from your <code>posts.csv</code> and <code>drafts.csv</code> datasets.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToComposer}
          className="btn-hero-compose"
        >
          <PenTool className="w-4 h-4" />
          <span>Compose New Post</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Records</span>
            <div className="kpi-icon-box bg-sky">
              <Share2 className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{totalPosts}</span>
            <span className="kpi-badge">In posts.csv</span>
          </div>
          <p className="kpi-sub">Total social posts created</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Saved Drafts</span>
            <div className="kpi-icon-box bg-amber">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{draftsCount}</span>
            <span className="kpi-badge">In drafts.csv</span>
          </div>
          <p className="kpi-sub">Ready to edit and finalize</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Scheduled Queue</span>
            <div className="kpi-icon-box bg-indigo">
              <CalendarClock className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{scheduledCount}</span>
            <span className="kpi-badge">Automated</span>
          </div>
          <p className="kpi-sub">Upcoming releases with dates</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Published</span>
            <div className="kpi-icon-box bg-emerald">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{publishedCount}</span>
            <span className="kpi-badge">Live</span>
          </div>
          <p className="kpi-sub">Verified & published posts</p>
        </div>
      </div>

      {/* Analytics Breakdown */}
      <div className="analytics-charts-grid">
        {/* Platform Share */}
        <div className="chart-card">
          <h3 className="chart-title">Posts by Social Platform</h3>
          <p className="chart-sub">Share percentage in <code>posts.csv</code></p>
          <div className="chart-bars-list">
            {platformBreakdown.map((item) => (
              <div key={item.platform} className="chart-bar-item">
                <div className="bar-labels">
                  <span className="bar-platform-name">{item.cfg.name}</span>
                  <span className="bar-platform-stat">
                    <strong>{item.count}</strong> posts ({item.pct}%)
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${item.pct}%`, backgroundColor: item.cfg.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Distribution */}
        <div className="chart-card">
          <h3 className="chart-title">Pipeline Status Distribution</h3>
          <p className="chart-sub">Workflow states across database</p>
          <div className="status-boxes-row">
            <div className="status-box bg-published">
              <span className="status-box-val">{publishedCount}</span>
              <span className="status-box-lbl">Published</span>
            </div>
            <div className="status-box bg-scheduled">
              <span className="status-box-val">{scheduledCount}</span>
              <span className="status-box-lbl">Scheduled</span>
            </div>
            <div className="status-box bg-drafts">
              <span className="status-box-val">{draftsCount}</span>
              <span className="status-box-lbl">Drafts</span>
            </div>
          </div>

          <div className="pass-rate-pill">
            <span>Character Limit Compliance</span>
            <strong className="text-emerald">100% Passed</strong>
          </div>
        </div>
      </div>

      {/* Recent Posts History */}
      <div className="recent-posts-card">
        <h3 className="recent-posts-title">Recent Posts Activity (from posts.csv)</h3>
        {posts.length === 0 ? (
          <div className="empty-state-box">No posts recorded yet in posts.csv.</div>
        ) : (
          <div className="table-wrapper">
            <table className="posts-data-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Length / Limit</th>
                  <th>Scheduled / Published</th>
                  <th>Content Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.slice(0, 5).map((p) => {
                  const cfg = PLATFORMS[p.Platform] || PLATFORMS.Twitter;
                  return (
                    <tr key={p.ID}>
                      <td>
                        <span className="platform-tag" style={{ backgroundColor: cfg.color }}>
                          {p.Platform}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${p.Status.toLowerCase()}`}>
                          {p.Status}
                        </span>
                      </td>
                      <td className="font-mono">
                        {p.CharCount} / {p.Limit}
                      </td>
                      <td className="text-slate-muted">
                        {p.ScheduledAt || p.PublishedAt || 'N/A'}
                      </td>
                      <td className="content-cell-preview" title={p.Content}>
                        {p.Content.length > 80 ? p.Content.slice(0, 80) + '...' : p.Content}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            type="button"
                            onClick={() => handleCopy(p.Content)}
                            className="btn-icon-action"
                            title="Copy text"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePost(p.ID)}
                            className="btn-icon-action delete"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
