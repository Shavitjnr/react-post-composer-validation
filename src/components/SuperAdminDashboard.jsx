import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Activity,
  Database,
  Building2,
  Share2,
  FileText,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  ExternalLink,
  Search,
  Plus,
  ArrowLeft,
  RefreshCw,
  LogOut,
  Laptop,
  Check,
  ChevronRight
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { workspaceService } from '../services/workspaceService';
import { csvStorage } from '../utils/csvStorage';

export function SuperAdminDashboard({
  onNavigateToPanel,
  onNavigateToHome,
  onImpersonateSuccess,
  showToast
}) {
  const [usersList, setUsersList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [workspacesList, setWorkspacesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'activity' | 'workspaces'

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('pass1234');
  const [newUserRole, setNewUserRole] = useState('Editor');

  const refreshAdminData = () => {
    setUsersList(adminService.getAllUsersDetailed());
    setAuditLogs(adminService.getGlobalAuditLogs());
    setWorkspacesList(workspaceService.getAllWorkspaces());
  };

  useEffect(() => {
    refreshAdminData();
  }, []);

  const handleToggleVerification = (email) => {
    const res = adminService.toggleUserVerification(email);
    if (res.success) {
      showToast(`User ${email} verification updated to ${res.verified ? 'VERIFIED' : 'PENDING'}`, 'success');
      refreshAdminData();
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleToggleStatus = (email) => {
    const res = adminService.toggleUserStatus(email);
    if (res.success) {
      showToast(`User ${email} status changed to ${res.status}`, 'info');
      refreshAdminData();
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleChangeRole = (email, newRole) => {
    const res = adminService.updateUserRole(email, newRole);
    if (res.success) {
      showToast(`Updated role for ${email} to ${newRole}`, 'success');
      refreshAdminData();
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleImpersonate = (email) => {
    const user = adminService.impersonateUser(email);
    if (user) {
      showToast(`Switched active session to ${user.name} (${user.email}). Redirecting to Panel...`, 'info');
      if (onImpersonateSuccess) onImpersonateSuccess(user);
      onNavigateToPanel();
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    const res = csvStorage.registerUser(newUserName.trim(), newUserEmail.trim(), newUserPassword, newUserRole);
    if (res.success) {
      showToast(`User ${newUserName} created and verified!`, 'success');
      setIsAddUserModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      refreshAdminData();
    } else {
      showToast(res.error || 'Failed to create user', 'error');
    }
  };

  // Filtered users
  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculations
  const totalUsers = usersList.length;
  const verifiedUsersCount = usersList.filter((u) => u.verified).length;
  const pendingUsersCount = usersList.filter((u) => !u.verified).length;
  const totalPostsAcrossApp = usersList.reduce((acc, u) => acc + (u.postsCount || 0), 0);

  return (
    <div className="superadmin-root">
      {/* 1. Super Admin Top Banner */}
      <header className="superadmin-header">
        <div className="header-left">
          <div className="admin-badge-circle">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="admin-title-row">
              <h1 className="admin-title">SUPER ADMIN COMMAND CENTER</h1>
              <span className="master-access-pill">MASTER ACCESS</span>
            </div>
            <p className="admin-subtitle">
              Super Admin: <strong>Shavit Daloutra</strong> ({adminService.SUPER_ADMIN_EMAIL}) • Complete Control of Users, Verification, Accounts & Global Activity
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            onClick={onNavigateToHome}
            className="btn-admin-nav"
            title="Return to Public Homepage"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Homepage (/)</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToPanel}
            className="btn-admin-primary"
            title="Enter Main Workspace Panel"
          >
            <span>Open Panel (/Pannel)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Super Admin Navigation Tabs */}
      <div className="admin-subnav-bar">
        <div className="subnav-tabs">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts & Verification ({totalUsers})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`admin-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Audit Stream / What Users Did ({auditLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workspaces')}
            className={`admin-tab-btn ${activeTab === 'workspaces' ? 'active' : ''}`}
          >
            <Building2 className="w-4 h-4" />
            <span>Workspaces Governance ({workspacesList.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={refreshAdminData}
          className="btn-refresh-admin"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="superadmin-body-container">
        {/* 3. Global KPI Metrics Row */}
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="kpi-icon-box blue">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="admin-kpi-label">Total Users</span>
              <strong className="admin-kpi-val">{totalUsers}</strong>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-box green">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="admin-kpi-label">Verified Accounts</span>
              <strong className="admin-kpi-val">{verifiedUsersCount} <small className="text-emerald-600">Active</small></strong>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-box amber">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="admin-kpi-label">Pending Verification</span>
              <strong className="admin-kpi-val">{pendingUsersCount}</strong>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-box purple">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="admin-kpi-label">Workspaces</span>
              <strong className="admin-kpi-val">{workspacesList.length}</strong>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-icon-box sky">
              <FileText className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <span className="admin-kpi-label">Total Posts Managed</span>
              <strong className="admin-kpi-val">{totalPostsAcrossApp}</strong>
            </div>
          </div>
        </div>

        {/* 4. Tab Content */}
        {activeTab === 'users' && (
          <div className="admin-section-box">
            <div className="section-toolbar-row">
              <div className="search-wrap-admin">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search-field"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(true)}
                className="btn-admin-add-user"
              >
                <Plus className="w-4 h-4" />
                <span>Add User to System</span>
              </button>
            </div>

            {/* User Management Table */}
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>User & Credentials</th>
                    <th>Role</th>
                    <th>Verification Status</th>
                    <th>Account State</th>
                    <th>Connected Channels</th>
                    <th>Posts / Drafts</th>
                    <th>Last Active & IP</th>
                    <th className="text-right">Super Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className={u.isSuperAdmin ? 'superadmin-row' : ''}>
                      <td>
                        <div className="user-profile-cell">
                          <div className={`user-badge-initials ${u.isSuperAdmin ? 'super-badge' : ''}`}>
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex-align-center">
                              <strong>{u.name}</strong>
                              {u.isSuperAdmin && <span className="super-crown-tag">SUPER ADMIN</span>}
                            </div>
                            <span className="user-email-text">{u.email}</span>
                            <span className="user-handle-caption">@{u.username}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {u.isSuperAdmin ? (
                          <span className="badge-superadmin-role">Super Admin</span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u.email, e.target.value)}
                            className="role-select-dropdown"
                          >
                            <option value="Administrator">Administrator</option>
                            <option value="Manager">Manager</option>
                            <option value="Editor">Editor</option>
                            <option value="Contributor">Contributor</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                        )}
                      </td>

                      <td>
                        {u.verified ? (
                          <span className="verification-badge verified" title="Identity Verified by Super Admin">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>VERIFIED</span>
                          </span>
                        ) : (
                          <span className="verification-badge pending" title="Pending Verification Review">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>

                      <td>
                        <span className={`status-pill ${u.status === 'Active' ? 'active' : 'suspended'}`}>
                          {u.status}
                        </span>
                      </td>

                      <td>
                        <div className="channel-badges-cell">
                          {u.connectedAccounts.map((ch) => (
                            <span key={ch} className="mini-channel-badge">{ch}</span>
                          ))}
                        </div>
                      </td>

                      <td>
                        <div className="metric-counts-cell">
                          <span><strong>{u.postsCount}</strong> posts</span>
                          <span className="text-muted"><strong>{u.draftsCount}</strong> drafts</span>
                        </div>
                      </td>

                      <td>
                        <div className="meta-info-cell">
                          <span>{u.lastLogin}</span>
                          <span className="ip-caption">{u.ipAddress}</span>
                        </div>
                      </td>

                      <td className="text-right">
                        <div className="admin-actions-cell">
                          {!u.isSuperAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleToggleVerification(u.email)}
                                className={`btn-action-pill ${u.verified ? 'btn-revoke' : 'btn-verify'}`}
                                title={u.verified ? 'Revoke verification' : 'Verify user'}
                              >
                                {u.verified ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                <span>{u.verified ? 'Unverify' : 'Verify'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(u.email)}
                                className="btn-action-pill btn-status-toggle"
                                title={u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                              >
                                {u.status === 'Active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                <span>{u.status === 'Active' ? 'Suspend' : 'Activate'}</span>
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => handleImpersonate(u.email)}
                            className="btn-action-pill btn-impersonate"
                            title="Log in to workspace as this user"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Impersonate</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Live Audit Stream / What Users Did */}
        {activeTab === 'activity' && (
          <div className="admin-section-box">
            <div className="section-toolbar-row">
              <div>
                <h3>Global Activity Audit Trail ("What They Did")</h3>
                <p className="section-subtitle">Real-time chronicle of all publishing, approvals, account connections, and user management.</p>
              </div>
            </div>

            <div className="admin-audit-list">
              {auditLogs.length === 0 ? (
                <div className="empty-admin-box">No audit logs recorded yet.</div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.ID} className="admin-audit-card">
                    <div className="audit-action-icon">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div className="audit-card-body">
                      <div className="audit-top-line">
                        <span className="audit-user-badge">{log.UserEmail}</span>
                        <span className="audit-action-tag">{log.Action}</span>
                        <span className="audit-ws-tag">Workspace: {log.WorkspaceId}</span>
                        <span className="audit-time-text">{log.Timestamp}</span>
                      </div>
                      <p className="audit-details-text">{log.Details || `Performed action on resource ${log.Resource}`}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 6. Workspaces Governance */}
        {activeTab === 'workspaces' && (
          <div className="admin-section-box">
            <div className="section-toolbar-row">
              <div>
                <h3>Multi-Tenant Workspaces Directory</h3>
                <p className="section-subtitle">Manage client and agency workspaces, allocated storage, and active subscription tiers.</p>
              </div>
            </div>

            <div className="admin-workspaces-grid">
              {workspacesList.map((ws) => (
                <div key={ws.ID} className="admin-workspace-card">
                  <div className="ws-card-header">
                    <div className="ws-icon-circle">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4>{ws.Name}</h4>
                      <span className="ws-id-caption">ID: {ws.ID}</span>
                    </div>
                  </div>
                  <div className="ws-details-rows">
                    <div className="ws-detail-item">
                      <span>Subscription Plan:</span>
                      <strong>{ws.Plan || 'Free'}</strong>
                    </div>
                    <div className="ws-detail-item">
                      <span>Owner:</span>
                      <strong>{ws.OwnerEmail || adminService.SUPER_ADMIN_EMAIL}</strong>
                    </div>
                    <div className="ws-detail-item">
                      <span>Created At:</span>
                      <span>{ws.CreatedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card admin-add-user-modal">
            <div className="modal-header">
              <span className="modal-title">Add New User (users.csv)</span>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="admin-form">
              <div className="form-group-item">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-item">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="elena@agency.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-item">
                <label>Password</label>
                <input
                  type="text"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-item">
                <label>Designated Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Manager">Manager</option>
                  <option value="Editor">Editor</option>
                  <option value="Contributor">Contributor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="modal-action-row">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save-confirm">
                  Create & Verify User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
