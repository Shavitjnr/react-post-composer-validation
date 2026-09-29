import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  CheckCircle2,
  Mail,
  User,
  X,
  MoreVertical
} from 'lucide-react';
import { teamService } from '../services/teamService';
import { subscriptionService } from '../services/subscriptionService';

export function TeamManager({ showToast }) {
  const [members, setMembers] = useState(() => teamService.getTeamMembers());
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Creator');
  const [error, setError] = useState('');

  const currentPlan = subscriptionService.getCurrentPlan();
  const maxMembers = currentPlan.limits.teamMembers;

  const refreshList = () => {
    setMembers(teamService.getTeamMembers());
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = teamService.inviteMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
    });

    if (!res.success) {
      setError(res.error);
      return;
    }

    refreshList();
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    showToast(`Invited ${inviteName} as ${inviteRole}!`, 'success');
  };

  const handleRoleChange = (memberId, newRole) => {
    const res = teamService.updateRole(memberId, newRole);
    if (res.success) {
      refreshList();
      showToast('Member role updated', 'info');
    }
  };

  const handleRemove = (member) => {
    if (confirm(`Remove ${member.name} (${member.email}) from workspace?`)) {
      const res = teamService.removeMember(member.id);
      if (!res.success) {
        showToast(res.error, 'error');
        return;
      }
      refreshList();
      showToast(`${member.name} removed from team`, 'info');
    }
  };

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="header-pill">Role-Based Access Control</div>
          <h2 className="section-title">Team Collaboration & Permissions</h2>
          <p className="section-subtitle">
            Govern user permissions across content creation, editorial approvals, and account administration.
          </p>
        </div>

        <div className="section-actions-group">
          <div className="account-capacity-chip">
            <strong>{members.length}</strong> of <strong>{maxMembers}</strong> Members ({currentPlan.name} Tier)
          </div>

          <button
            type="button"
            onClick={() => {
              setError('');
              setShowInviteModal(true);
            }}
            className="btn-primary"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Team Table Card */}
      <div className="recent-posts-card">
        <div className="table-wrapper">
          <table className="posts-data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Permissions Summary</th>
                <th>Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="user-profile-badge" style={{ padding: '0', background: 'transparent', border: 'none' }}>
                      <div className="user-avatar">{m.avatar || m.name.slice(0, 2)}</div>
                      <span className="font-bold text-slate-900 ml-2">{m.name}</span>
                    </div>
                  </td>
                  <td className="text-primary font-medium">{m.email}</td>
                  <td>
                    {m.role === 'Owner' ? (
                      <span className="role-badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
                        Workspace Owner
                      </span>
                    ) : (
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value)}
                        className="role-selector-dropdown"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Editor">Editor</option>
                        <option value="Creator">Creator</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    )}
                  </td>
                  <td className="text-slate-muted text-xs">
                    {m.role === 'Owner' && 'Full account authority, billing & members'}
                    {m.role === 'Admin' && 'Publish, schedule, approve & team management'}
                    {m.role === 'Manager' && 'Approve drafts, schedule & publish'}
                    {m.role === 'Editor' && 'Draft content & submit for approval'}
                    {m.role === 'Creator' && 'Draft content & submit for review'}
                    {m.role === 'Viewer' && 'Read-only access to calendar & stats'}
                  </td>
                  <td>
                    <span className="status-pill published">{m.status}</span>
                  </td>
                  <td className="text-slate-muted font-mono text-xs">{m.lastActive}</td>
                  <td style={{ textAlign: 'center' }}>
                    {m.role !== 'Owner' && (
                      <button
                        type="button"
                        onClick={() => handleRemove(m)}
                        className="btn-icon-action delete"
                        title={`Remove ${m.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <UserPlus className="w-5 h-5 text-primary" />
                <h3 className="modal-title">Invite Workspace Collaborator</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="modal-error-banner">{error}</div>}

            <form onSubmit={handleInviteSubmit} className="auth-form">
              <div className="form-field">
                <label className="field-label">Full Name</label>
                <div className="input-with-icon">
                  <User className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Hayes"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="jordan@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Workspace Role</label>
                <div className="input-with-icon">
                  <Shield className="input-icon" />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="modal-input"
                    style={{ paddingLeft: '36px' }}
                  >
                    <option value="Admin">Admin (Publish, schedule & team management)</option>
                    <option value="Manager">Manager (Approve posts & schedule)</option>
                    <option value="Editor">Editor (Create drafts & schedule)</option>
                    <option value="Creator">Creator (Create drafts & submit review)</option>
                    <option value="Viewer">Viewer (Read-only)</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
