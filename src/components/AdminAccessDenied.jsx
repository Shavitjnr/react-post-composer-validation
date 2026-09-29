import React from 'react';
import {
  ShieldAlert,
  ArrowLeft,
  LayoutDashboard,
  Lock,
  UserCheck,
  AlertOctagon,
  ExternalLink,
  LogIn
} from 'lucide-react';
import { adminService } from '../services/adminService';

export function AdminAccessDenied({
  currentUser,
  onNavigateToPanel,
  onNavigateToHome,
  onOpenAuth
}) {
  return (
    <div className="access-denied-root">
      <div className="access-denied-card">
        {/* Shield Icon Badge */}
        <div className="denied-icon-wrap">
          <div className="denied-icon-pulse">
            <Lock className="w-8 h-8 text-rose-600" />
          </div>
        </div>

        {/* Status & Title */}
        <div className="denied-badge-pill">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          <span>HTTP 403 — FORBIDDEN ACCESS</span>
        </div>

        <h1 className="denied-title">Super Admin Authority Required</h1>

        <p className="denied-description">
          The Post Composer Pro <strong>Master Command Center (`/admin`)</strong> is strictly restricted to
          platform root administrators: <br />
          <code className="admin-email-tag">daloutrashavit@gmail.com</code> •{' '}
          <code className="admin-org-tag">org_3JzmVi9pR3cE8KEwBWeAAqBmTAK</code>
        </p>

        {/* Current Active Account Profile Card */}
        <div className="current-account-box">
          <div className="account-box-header">
            <span className="account-box-label">CURRENT ACTIVE SESSION</span>
            <span className="account-tier-badge">Workspace Access Tier</span>
          </div>
          <div className="account-details-grid">
            <div className="account-field">
              <span className="field-name">Active User:</span>
              <span className="field-val font-semibold">{currentUser?.name || 'Collaborator / Client'}</span>
            </div>
            <div className="account-field">
              <span className="field-name">Signed Email:</span>
              <span className="field-val font-mono">{currentUser?.email || 'standard_user@session'}</span>
            </div>
            <div className="account-field">
              <span className="field-name">Current Role:</span>
              <span className="field-val">{currentUser?.role || 'Team Member / Client'}</span>
            </div>
            <div className="account-field">
              <span className="field-name">Status:</span>
              <span className="field-val text-emerald-600 font-medium">Authorized for Workspaces</span>
            </div>
          </div>
        </div>

        <div className="denied-guidance-callout">
          <p>
            You have full authorization to manage your campaigns, schedule multi-channel posts,
            collaborate with teammates, and review order queues on your dedicated workspace panel.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="denied-actions-row">
          <button
            type="button"
            onClick={onNavigateToPanel}
            className="btn-denied-primary"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to My Workspace Dashboard (/Pannel)</span>
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            className="btn-denied-secondary"
            title="Switch user account"
          >
            <LogIn className="w-4 h-4" />
            <span>Switch / Sign In</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToHome}
            className="btn-denied-ghost"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
}
