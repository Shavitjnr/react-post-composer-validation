import React from 'react';
import {
  Share2,
  FileText,
  CalendarClock,
  CheckCircle2,
  PenSquare,
  TrendingUp,
  Download,
  Trash2,
  Copy,
  Clock,
  Send,
  Eye,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { postService } from '../services/postService';
import { socialService } from '../services/socialService';
import { subscriptionService } from '../services/subscriptionService';
import { PLATFORM_RULES } from '../constants/platformRules';

export function Dashboard({
  currentUser,
  activeWorkspace,
  onNavigateToComposer,
  onNavigateToTab,
  showToast
}) {
  const posts = postService.getPosts(activeWorkspace?.ID);
  const drafts = postService.getDrafts(activeWorkspace?.ID);
  const scheduledPosts = postService.getScheduledPosts(activeWorkspace?.ID);
  const connectedAccounts = socialService.getConnectedAccounts(activeWorkspace?.ID);
  const usage = subscriptionService.getUsageMetrics(activeWorkspace?.ID);

  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.Status === 'Published').length;
  const scheduledCount = scheduledPosts.length;
  const draftsCount = drafts.length;

  const platformBreakdown = Object.keys(PLATFORM_RULES).map((key) => {
    const count = posts.filter((p) => p.Platform === key).length;
    const pct = totalPosts > 0 ? Math.round((count / totalPosts) * 100) : 0;
    return { platform: key, count, pct, cfg: PLATFORM_RULES[key] };
  });

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    showToast('Post content copied to clipboard!', 'info');
  };

  const handlePublishNow = (post) => {
    postService.deletePost(post.ID);
    postService.publishPost({
      content: post.Content,
      platform: post.Platform,
      authorEmail: post.UserEmail,
    });
    showToast(`Published scheduled post for ${post.Platform} in Demo Mode!`, 'success');
  };

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Shavit';

  return (
    <div className="dashboard-container">
      {/* Executive Welcome Hero Banner */}
      <div className="dashboard-hero-banner">
        <div>
          <div className="hero-tag">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Workspace: {activeWorkspace?.Name || 'Personal Brand'}</span>
          </div>
          <h1 className="hero-title">Good morning, {firstName}</h1>
          <p className="hero-subtitle">
            Here's what's happening across your social channels today. Manage publications, drafts, and automated queues from one central command center.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToComposer}
          className="btn-hero-compose"
        >
          <PenSquare className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="kpi-grid">
        {/* Published */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Published</span>
            <div className="kpi-icon-box bg-emerald">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{publishedCount}</span>
            <span className="kpi-badge text-emerald-600 bg-emerald-50">100% Live</span>
          </div>
          <p className="kpi-sub">Across active marketing channels</p>
        </div>

        {/* Scheduled Queue */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Scheduled Queue</span>
            <div className="kpi-icon-box bg-sky">
              <CalendarClock className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{scheduledCount}</span>
            <span className="kpi-badge">
              {scheduledCount} of {usage.scheduled.limit} Max
            </span>
          </div>
          <p className="kpi-sub">Upcoming automated dispatches</p>
        </div>

        {/* Connected Channels */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Connected Channels</span>
            <div className="kpi-icon-box bg-indigo">
              <Share2 className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{connectedAccounts.length}</span>
            <span className="kpi-badge">
              {connectedAccounts.length} of {usage.accounts.limit} Accounts
            </span>
          </div>
          <p className="kpi-sub">Meta, LinkedIn, X, YouTube</p>
        </div>

        {/* Drafts */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Drafts</span>
            <div className="kpi-icon-box bg-amber">
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{draftsCount}</span>
            <span className="kpi-badge">{drafts.filter((d) => d.IsFavorite === 'true').length} Starred</span>
          </div>
          <p className="kpi-sub">Editorial ideas in progress</p>
        </div>
      </div>

      {/* Middle Section: Upcoming Queue & Platform Share */}
      <div className="analytics-charts-grid">
        {/* Upcoming Scheduled Posts Preview */}
        <div className="chart-card">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="chart-title">Upcoming Publications Queue</h3>
              <p className="chart-sub">Posts queued for automated release</p>
            </div>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('calendar')}
                className="btn-secondary btn-sm"
              >
                <span>View Calendar</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {scheduledPosts.length === 0 ? (
            <div className="empty-state-box" style={{ padding: '24px' }}>
              <Clock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p>No posts currently queued in schedule.</p>
              <button
                type="button"
                onClick={onNavigateToComposer}
                className="btn-primary btn-sm mt-3"
              >
                Schedule First Post
              </button>
            </div>
          ) : (
            <div className="scheduled-queue-mini-list">
              {scheduledPosts.slice(0, 3).map((post) => (
                <div key={post.ID} className="queue-mini-item">
                  <div className="queue-item-left">
                    <span
                      className="platform-badge"
                      style={{ backgroundColor: PLATFORM_RULES[post.Platform]?.color || '#0f172a' }}
                    >
                      {PLATFORM_RULES[post.Platform]?.badge || post.Platform.slice(0, 2)}
                    </span>
                    <div className="queue-item-text">
                      <strong className="queue-item-content-snippet">
                        {post.Content.slice(0, 60)}...
                      </strong>
                      <span className="queue-item-date">
                        <Clock className="w-3 h-3 inline mr-1 text-slate-400" />
                        {post.ScheduledAt ? new Date(post.ScheduledAt).toLocaleString() : 'Immediate'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePublishNow(post)}
                    className="btn-secondary btn-sm"
                    title="Publish immediately in Demo Mode"
                  >
                    <span>Publish Now</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Share Breakdown */}
        <div className="chart-card">
          <h3 className="chart-title">Channel Content Distribution</h3>
          <p className="chart-sub">Volume allocation across supported networks</p>

          <div className="chart-bars-list">
            {platformBreakdown.map((item) => (
              <div key={item.platform} className="chart-bar-item">
                <div className="bar-labels">
                  <span className="bar-platform-name">{item.cfg.name}</span>
                  <span className="bar-platform-stat">
                    {item.count} posts ({item.pct}%)
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: item.cfg.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="recent-posts-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="recent-posts-title" style={{ margin: '0' }}>Recent Workspace Publications</h3>
          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('posts')}
              className="btn-secondary btn-sm"
            >
              <span>View All Posts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="table-wrapper">
          <table className="posts-data-table">
            <thead>
              <tr>
                <th>Post ID</th>
                <th>Channel</th>
                <th>Author</th>
                <th>Status</th>
                <th>Chars / Limit</th>
                <th>Date</th>
                <th>Content Preview</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '28px' }}>
                    <p className="text-slate-muted">No posts found in this workspace yet.</p>
                  </td>
                </tr>
              ) : (
                posts.slice(0, 5).map((p) => {
                  const cfg = PLATFORM_RULES[p.Platform] || { color: '#0f172a', badge: p.Platform };
                  return (
                    <tr key={p.ID}>
                      <td className="font-mono text-slate-muted text-xs">{p.ID}</td>
                      <td>
                        <span
                          className="platform-tag"
                          style={{ backgroundColor: cfg.color }}
                        >
                          {cfg.name || p.Platform}
                        </span>
                      </td>
                      <td className="text-slate-muted text-xs">{p.UserEmail}</td>
                      <td>
                        <span className={`status-pill ${p.Status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {p.Status}
                        </span>
                      </td>
                      <td className="font-mono text-xs">{p.CharCount} / {p.Limit}</td>
                      <td className="text-slate-muted font-mono text-xs">
                        {p.PublishedAt ? p.PublishedAt.slice(0, 16) : p.ScheduledAt ? p.ScheduledAt.slice(0, 16) : '—'}
                      </td>
                      <td className="content-cell-preview" title={p.Content}>
                        {p.Content}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleCopy(p.Content)}
                          className="btn-icon-action"
                          title="Copy text"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
