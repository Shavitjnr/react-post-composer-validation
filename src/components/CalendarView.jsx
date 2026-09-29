import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Send,
  MoreVertical,
  Plus,
  Filter
} from 'lucide-react';
import { postService } from '../services/postService';
import { PLATFORM_RULES } from '../constants/platformRules';

export function CalendarView({ onNavigateToComposer, showToast }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Oct 2026
  const [viewMode, setViewMode] = useState('Month'); // 'Month', 'Week', 'Day', 'List'
  const [platformFilter, setPlatformFilter] = useState('All');

  const scheduledPosts = postService.getScheduledPosts();

  const filteredPosts = scheduledPosts.filter((p) =>
    platformFilter === 'All' ? true : p.Platform === platformFilter
  );

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePublishNow = (post) => {
    postService.deletePost(post.ID);
    postService.publishPost({
      content: post.Content,
      platform: post.Platform,
      authorEmail: post.UserEmail,
    });
    showToast(`Published scheduled post for ${post.Platform} immediately!`, 'success');
  };

  // Generate 35 days grid for month view
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push({ day: null, dateStr: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    calendarDays.push({
      day: d,
      dateStr: `${currentDate.getFullYear()}-${mm}-${dd}`,
    });
  }

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="header-pill">Social Editorial Schedule</div>
          <h2 className="section-title">Content Calendar</h2>
          <p className="section-subtitle">
            Plan, orchestrate, and visualize social publications across all active marketing channels.
          </p>
        </div>

        <div className="section-actions-group">
          {/* View Mode Switcher */}
          <div className="view-mode-pill-toggle">
            {['Month', 'Week', 'Day', 'List'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`view-pill-btn ${viewMode === mode ? 'active' : ''}`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onNavigateToComposer}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls Bar */}
      <div className="calendar-controls-bar">
        <div className="calendar-nav-controls">
          <button type="button" onClick={handlePrevMonth} className="btn-icon-calendar">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="calendar-month-heading">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button type="button" onClick={handleNextMonth} className="btn-icon-calendar">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="calendar-filter-bar">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="filter-label-text">Channel:</span>
          {['All', 'Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube'].map((plat) => (
            <button
              key={plat}
              type="button"
              onClick={() => setPlatformFilter(plat)}
              className={`calendar-channel-chip ${platformFilter === plat ? 'active' : ''}`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* CALENDAR VIEW */}
      {viewMode === 'List' ? (
        <div className="scheduled-list-stack">
          {filteredPosts.length === 0 ? (
            <div className="empty-state-box">
              <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p>No scheduled posts match the selected channel filter.</p>
              <button
                type="button"
                onClick={onNavigateToComposer}
                className="btn-primary mt-3"
              >
                Schedule New Post
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.ID} className="scheduled-item-card">
                <div className="scheduled-left">
                  <div
                    className="platform-avatar-square"
                    style={{ backgroundColor: PLATFORM_RULES[post.Platform]?.color || '#0f172a' }}
                  >
                    {PLATFORM_RULES[post.Platform]?.badge || post.Platform.slice(0, 2)}
                  </div>
                  <div>
                    <div className="scheduled-meta-row">
                      <span className="platform-name font-bold">{post.Platform}</span>
                      <span className="char-indicator">· {post.CharCount} chars</span>
                    </div>
                    <p className="scheduled-content-text">{post.Content}</p>
                  </div>
                </div>

                <div className="scheduled-right">
                  <div className="scheduled-time-badge">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.ScheduledAt ? new Date(post.ScheduledAt).toLocaleString() : 'Pending'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePublishNow(post)}
                    className="btn-secondary"
                    title="Publish immediately in Demo Mode"
                  >
                    <Send className="w-3.5 h-3.5 text-primary" />
                    <span>Publish Now</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Month Grid */
        <div className="calendar-grid-card">
          <div className="calendar-days-header-row">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="calendar-weekday-col">{d}</div>
            ))}
          </div>

          <div className="calendar-days-cells-grid">
            {calendarDays.map((cell, idx) => {
              const postsOnDay = cell.dateStr
                ? filteredPosts.filter((p) => p.ScheduledAt && p.ScheduledAt.startsWith(cell.dateStr))
                : [];

              return (
                <div
                  key={idx}
                  className={`calendar-day-cell ${!cell.day ? 'empty' : ''}`}
                >
                  {cell.day && (
                    <>
                      <div className="cell-day-num">{cell.day}</div>
                      <div className="cell-posts-container">
                        {postsOnDay.map((p) => (
                          <div
                            key={p.ID}
                            className="calendar-post-entry"
                            style={{
                              borderLeft: `3px solid ${PLATFORM_RULES[p.Platform]?.color || '#2563eb'}`
                            }}
                            title={`${p.Platform}: ${p.Content}`}
                            onClick={() => handlePublishNow(p)}
                          >
                            <span className="entry-platform-name">{p.Platform}</span>
                            <span className="entry-snippet">{p.Content.slice(0, 32)}...</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
