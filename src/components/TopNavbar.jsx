import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Check,
  CheckCircle2,
  AlertCircle,
  Info,
  PenSquare,
  Flag,
  UploadCloud,
  Building2,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { ClerkNavControls } from './ClerkAuthControls';
import { Home, ShieldCheck } from 'lucide-react';

export function TopNavbar({
  activeWorkspace,
  onOpenWorkspaceModal,
  onNavigate,
  onOpenMediaUpload,
  showToast,
  hasClerkConfigured,
  onNavigateToHome,
  onNavigateToAdmin,
  isSuperAdmin = false,
  currentUser,
  onLogout
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = notificationService.getNotifications(activeWorkspace?.ID);
  const unreadCount = notificationService.getUnreadCount(activeWorkspace?.ID);

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    showToast('All notifications marked as read', 'info');
  };

  return (
    <header className="saas-top-navbar">
      {/* Left: Global Search */}
      <div className="top-search-area">
        <div className="search-input-shell">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts, drafts, media, campaigns, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="top-search-input"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="top-controls-group">
        {/* Demo Mode Badge */}
        <div className="demo-mode-indicator-pill" title="No real API credentials required. All publishing and analytics simulated.">
          <span className="pulsing-green-dot" />
          <span>DEMO MODE — Simulated</span>
        </div>

        {/* Quick Create Dropdown */}
        <div className="relative-popover-box">
          <button
            type="button"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="btn-quick-create"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showCreateMenu && (
            <div className="dropdown-popover-menu" onClick={() => setShowCreateMenu(false)}>
              <button
                type="button"
                onClick={() => onNavigate('composer')}
                className="dropdown-menu-row"
              >
                <PenSquare className="w-4 h-4 text-primary" />
                <div className="row-text">
                  <strong>Create Post</strong>
                  <span>Draft or schedule social content</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('campaigns')}
                className="dropdown-menu-row"
              >
                <Flag className="w-4 h-4 text-indigo-600" />
                <div className="row-text">
                  <strong>Create Campaign</strong>
                  <span>Coordinate multi-channel campaigns</span>
                </div>
              </button>

              <button
                type="button"
                onClick={onOpenMediaUpload}
                className="dropdown-menu-row"
              >
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <div className="row-text">
                  <strong>Upload Media</strong>
                  <span>Add images or video assets</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Center */}
        <div className="relative-popover-box">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="top-icon-btn"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="notif-badge-pill">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="dropdown-popover-menu notif-panel-dropdown">
              <div className="notif-panel-header">
                <div className="notif-header-title">
                  <strong>Notifications</strong>
                  {unreadCount > 0 && <span className="unread-tag">{unreadCount} new</span>}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="btn-mark-all-read"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="notif-list-container">
                {notifications.length === 0 ? (
                  <div className="empty-notif-msg">No notifications right now</div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item-card ${!n.read ? 'unread' : ''}`}
                      onClick={() => notificationService.markAsRead(n.id)}
                    >
                      <div className="notif-icon-col">
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {n.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                        {n.type === 'info' && <Info className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="notif-body-col">
                        <span className="notif-item-title">{n.title}</span>
                        <p className="notif-item-desc">{n.message}</p>
                        <span className="notif-time-ago">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Route Quick Switchers */}
        <button
          type="button"
          onClick={onNavigateToHome}
          className="top-home-pill"
          title="Return to Public Homepage"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {/* Super Admin Access Pill - STRICTLY guarded for Super Admin only */}
        {isSuperAdmin && (
          <button
            type="button"
            onClick={onNavigateToAdmin}
            className="top-admin-pill"
            title="Super Admin Dashboard (Master Authority)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Super Admin</span>
          </button>
        )}

        {/* Clerk Authentication Controls */}
        <ClerkNavControls hasClerkConfigured={hasClerkConfigured} />

        {/* Dedicated Sign Out / Log Out Button */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="top-logout-btn"
            title="Sign out of active session"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span>Sign Out</span>
          </button>
        )}

        {/* Workspace Switcher Pill */}
        <button
          type="button"
          onClick={onOpenWorkspaceModal}
          className="top-workspace-pill"
          title="Active Workspace"
        >
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span className="ws-title-snippet">{activeWorkspace?.Name || 'Hostego'}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
