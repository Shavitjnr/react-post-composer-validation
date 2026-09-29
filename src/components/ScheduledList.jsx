import React, { useState } from 'react';
import { csvStorage } from '../utils/csvStorage';
import { PLATFORMS } from '../utils/validation';
import { CalendarClock, Clock, Trash2, AlertCircle } from 'lucide-react';

export function ScheduledList({ showToast }) {
  const [posts, setPosts] = useState(() => csvStorage.getPosts());

  const scheduledPosts = posts.filter((p) => p.Status === 'Scheduled');

  const handleCancelSchedule = (id) => {
    if (confirm('Cancel this scheduled post?')) {
      csvStorage.updatePostStatus(id, 'Cancelled');
      setPosts(csvStorage.getPosts());
      showToast('Scheduled post cancelled', 'info');
    }
  };

  const handleDeletePost = (id) => {
    if (confirm('Delete this record completely from posts.csv?')) {
      csvStorage.deletePost(id);
      setPosts(csvStorage.getPosts());
      showToast('Record deleted from posts.csv', 'info');
    }
  };

  return (
    <div className="section-container">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Automated Scheduling Queue</h2>
          <p className="section-subtitle">
            Upcoming posts saved in <code>data/posts.csv</code> with <code>Status="Scheduled"</code>.
          </p>
        </div>
      </div>

      {scheduledPosts.length === 0 ? (
        <div className="empty-state-box">
          <CalendarClock className="w-8 h-8 text-slate-500 mb-2" />
          <p>No posts currently scheduled.</p>
          <span className="empty-sub">Use the Schedule button in the Post Composer to schedule for a future date.</span>
        </div>
      ) : (
        <div className="scheduled-list-stack">
          {scheduledPosts.map((p) => {
            const cfg = PLATFORMS[p.Platform] || PLATFORMS.Twitter;
            return (
              <div key={p.ID} className="scheduled-item-card">
                <div className="scheduled-left">
                  <span
                    className="platform-avatar-square"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {cfg.badge}
                  </span>
                  <div className="scheduled-details">
                    <div className="scheduled-meta-row">
                      <span className="font-bold text-white text-xs">{cfg.name}</span>
                      <span className="status-pill scheduled">Scheduled</span>
                      <span className="char-indicator font-mono">
                        {p.CharCount} / {p.Limit} chars
                      </span>
                    </div>
                    <p className="scheduled-content-text">{p.Content}</p>
                  </div>
                </div>

                <div className="scheduled-right">
                  <div className="scheduled-time-badge">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{p.ScheduledAt || 'Upcoming'}</span>
                  </div>

                  <div className="scheduled-actions">
                    <button
                      type="button"
                      onClick={() => handleCancelSchedule(p.ID)}
                      className="btn-cancel-schedule"
                    >
                      Cancel Schedule
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
