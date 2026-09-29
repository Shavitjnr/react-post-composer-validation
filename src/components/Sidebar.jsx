import React, { useState } from 'react';
import {
  LayoutDashboard,
  PenSquare,
  CalendarDays,
  Send,
  FileText,
  Image,
  Share2,
  Flag,
  BarChart3,
  Users,
  CreditCard,
  ShieldCheck,
  Database,
  ChevronDown,
  Sparkles,
  Plus,
  ArrowUpRight,
  LogOut,
  Building2,
  Settings
} from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { workspaceService } from '../services/workspaceService';

export function Sidebar({
  activeTab,
  setActiveTab,
  activeWorkspace,
  workspaces,
  onOpenWorkspaceModal,
  currentUser,
  onLogout,
  onOpenUpgradeModal
}) {
  const usage = subscriptionService.getUsageMetrics(activeWorkspace?.ID);

  return (
    <aside className="saas-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="brand-logo-icon">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="brand-text-block">
          <span className="brand-product-name">
            Post Composer <span className="pro-pill">PRO</span>
          </span>
          <span className="brand-tagline-text">Social Media Management SaaS</span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div className="workspace-switcher-wrapper">
        <button
          type="button"
          onClick={onOpenWorkspaceModal}
          className="workspace-switcher-btn"
          title="Switch or create workspace"
        >
          <div className="ws-btn-left">
            <Building2 className="w-4 h-4 text-primary" />
            <div className="ws-name-col">
              <span className="ws-label-title">{activeWorkspace?.Name || 'Hostego'}</span>
              <span className="ws-role-tag">{activeWorkspace?.Role || 'Owner'}</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav-container">
        {/* MAIN SECTION */}
        <div className="nav-group-section">
          <span className="nav-group-heading">MAIN</span>

          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`nav-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('composer')}
            className={`nav-menu-item ${activeTab === 'composer' ? 'active' : ''}`}
          >
            <PenSquare className="w-4 h-4" />
            <span>Post Composer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`nav-menu-item ${activeTab === 'calendar' ? 'active' : ''}`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`nav-menu-item ${activeTab === 'posts' ? 'active' : ''}`}
          >
            <Send className="w-4 h-4" />
            <span>Posts & Queue</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drafts')}
            className={`nav-menu-item ${activeTab === 'drafts' ? 'active' : ''}`}
          >
            <FileText className="w-4 h-4" />
            <span>Drafts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`nav-menu-item ${activeTab === 'media' ? 'active' : ''}`}
          >
            <Image className="w-4 h-4" />
            <span>Media Library</span>
          </button>
        </div>

        {/* MANAGE SECTION */}
        <div className="nav-group-section">
          <span className="nav-group-heading">MANAGE</span>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`nav-menu-item ${activeTab === 'social' ? 'active' : ''}`}
          >
            <Share2 className="w-4 h-4" />
            <span>Social Accounts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            className={`nav-menu-item ${activeTab === 'campaigns' ? 'active' : ''}`}
          >
            <Flag className="w-4 h-4" />
            <span>Campaigns & Tags</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`nav-menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`nav-menu-item ${activeTab === 'team' ? 'active' : ''}`}
          >
            <Users className="w-4 h-4" />
            <span>Team & Roles</span>
          </button>
        </div>

        {/* SYSTEM SECTION */}
        <div className="nav-group-section">
          <span className="nav-group-heading">SYSTEM</span>

          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`nav-menu-item ${activeTab === 'billing' ? 'active' : ''}`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Billing & Plans</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`nav-menu-item ${activeTab === 'audit' ? 'active' : ''}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Logs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`nav-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings className="w-4 h-4" />
            <span>Workspace Settings</span>
          </button>
        </div>
      </nav>

      {/* Plan Usage Meter Card */}
      <div className="sidebar-usage-box">
        <div className="usage-header-row">
          <span className="usage-plan-badge">{usage.plan.name} Plan</span>
          <span className="usage-percent-text">{usage.overallUsage}% Used</span>
        </div>
        <div className="usage-progress-track">
          <div
            className="usage-progress-bar"
            style={{ width: `${usage.overallUsage}%` }}
          />
        </div>
        <div className="usage-details-mini">
          <span>{usage.scheduled.used}/{usage.scheduled.limit} Queued</span>
          <span>{usage.accounts.used}/{usage.accounts.limit} Accounts</span>
        </div>
        <button
          type="button"
          onClick={onOpenUpgradeModal}
          className="btn-upgrade-plan"
        >
          <span>Upgrade Tier</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* User Footer Profile */}
      <div className="sidebar-user-footer">
        <div className="user-avatar-circle">
          {currentUser?.name?.slice(0, 2).toUpperCase() || 'SD'}
        </div>
        <div className="user-details-text">
          <span className="user-display-name">{currentUser?.name || 'Shavit Daloutra'}</span>
          <span className="user-email-caption">{currentUser?.email || 'shavitdaloutra28@gmail.com'}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="btn-sidebar-logout"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
