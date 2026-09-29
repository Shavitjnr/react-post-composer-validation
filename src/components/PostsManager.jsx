import React, { useState } from 'react';
import {
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { postService } from '../services/postService';
import { PLATFORM_RULES } from '../constants/platformRules';

export function PostsManager({ onNavigateToComposer, showToast }) {
  const [activeFilterTab, setActiveFilterTab] = useState('All'); // 'All', 'Published', 'Scheduled', 'Pending Review', 'Failed'
  const [channelFilter, setChannelFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [postsList, setPostsList] = useState(() => postService.getPosts());

  const refreshList = () => {
    setPostsList(postService.getPosts());
  };

  const handleApprove = (post) => {
    postService.approvePost(post.ID, 'shavitdaloutra28@gmail.com');
    refreshList();
    showToast(`Post for ${post.Platform} approved and queued!`, 'success');
  };

  const handleRequestChanges = (post) => {
    const reason = prompt('Enter editorial feedback / changes requested:');
    if (reason && reason.trim()) {
      postService.rejectPost(post.ID, 'shavitdaloutra28@gmail.com', reason.trim());
      refreshList();
      showToast('Changes requested; returned to draft', 'info');
    }
  };

  const handlePublishImmediately = (post) => {
    postService.deletePost(post.ID);
    postService.publishPost({
      content: post.Content,
      platform: post.Platform,
      authorEmail: post.UserEmail,
    });
    refreshList();
    showToast(`Published post for ${post.Platform} in Demo Mode!`, 'success');
  };

  const handleDelete = (post) => {
    if (confirm(`Remove post (${post.Platform})?`)) {
      postService.deletePost(post.ID);
      refreshList();
      showToast('Post removed', 'info');
    }
  };

  // Filter logic
  const filteredPosts = postsList.filter((p) => {
    const matchesTab =
      activeFilterTab === 'All'
        ? true
        : activeFilterTab === 'Scheduled'
        ? p.Status === 'Scheduled'
        : activeFilterTab === 'Published'
        ? p.Status === 'Published'
        : activeFilterTab === 'Pending Review'
        ? p.Status === 'Pending Review'
        : p.Status === 'Failed';

    const matchesChannel = channelFilter === 'All' ? true : p.Platform === channelFilter;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : p.Content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.UserEmail.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesChannel && matchesSearch;
  });

  const pendingApprovalCount = postsList.filter((p) => p.Status === 'Pending Review').length;
  const scheduledCount = postsList.filter((p) => p.Status === 'Scheduled').length;
  const publishedCount = postsList.filter((p) => p.Status === 'Published').length;

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="header-pill">Publishing Engine & Queue</div>
          <h2 className="section-title">Posts & Approval Queue</h2>
          <p className="section-subtitle">
            Manage live publications, upcoming scheduled releases, and editorial approval workflows.
          </p>
        </div>

        <div className="section-actions-group">
          <button
            type="button"
            onClick={onNavigateToComposer}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="filter-search-card">
        <div className="filter-pills-row">
          <button
            type="button"
            onClick={() => setActiveFilterTab('All')}
            className={`filter-pill-btn ${activeFilterTab === 'All' ? 'active' : ''}`}
          >
            All Posts ({postsList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilterTab('Published')}
            className={`filter-pill-btn ${activeFilterTab === 'Published' ? 'active' : ''}`}
          >
            Published ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilterTab('Scheduled')}
            className={`filter-pill-btn ${activeFilterTab === 'Scheduled' ? 'active' : ''}`}
          >
            Scheduled Queue ({scheduledCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilterTab('Pending Review')}
            className={`filter-pill-btn ${activeFilterTab === 'Pending Review' ? 'active' : ''}`}
          >
            Pending Review ({pendingApprovalCount})
          </button>
        </div>

        <div className="search-input-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field"
          />
        </div>
      </div>

      {/* Posts Table Card */}
      <div className="recent-posts-card">
        <div className="table-wrapper">
          <table className="posts-data-table">
            <thead>
              <tr>
                <th>Post ID</th>
                <th>Channel</th>
                <th>Author</th>
                <th>Status</th>
                <th>Chars / Limit</th>
                <th>Release Timestamp</th>
                <th>Content Excerpt</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px' }}>
                    <p className="text-slate-muted">No posts found matching the selected filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((p) => {
                  const cfg = PLATFORM_RULES[p.Platform] || { color: '#0f172a', badge: p.Platform };
                  const isPending = p.Status === 'Pending Review';
                  const isScheduled = p.Status === 'Scheduled';

                  return (
                    <tr key={p.ID}>
                      <td className="font-mono text-slate-muted">{p.ID}</td>
                      <td>
                        <span
                          className="platform-tag"
                          style={{ backgroundColor: cfg.color }}
                        >
                          {cfg.name || p.Platform}
                        </span>
                      </td>
                      <td className="text-slate-muted font-medium">{p.UserEmail}</td>
                      <td>
                        <span className={`status-pill ${p.Status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {p.Status}
                        </span>
                      </td>
                      <td className="font-mono">{p.CharCount} / {p.Limit}</td>
                      <td className="text-slate-muted font-mono">
                        {p.ScheduledAt
                          ? new Date(p.ScheduledAt).toLocaleString()
                          : p.PublishedAt
                          ? new Date(p.PublishedAt).toLocaleString()
                          : 'Immediate'}
                      </td>
                      <td className="content-cell-preview" title={p.Content}>
                        {p.Content}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="actions-cell" style={{ justifyContent: 'center' }}>
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(p)}
                                className="btn-primary btn-sm"
                                title="Approve and schedule post"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRequestChanges(p)}
                                className="btn-secondary btn-sm"
                                title="Request changes and return to draft"
                              >
                                Changes
                              </button>
                            </>
                          )}

                          {isScheduled && (
                            <button
                              type="button"
                              onClick={() => handlePublishImmediately(p)}
                              className="btn-icon-action"
                              title="Publish immediately in Demo Mode"
                            >
                              <Send className="w-3.5 h-3.5 text-primary" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(p)}
                            className="btn-icon-action delete"
                            title="Delete / cancel post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
