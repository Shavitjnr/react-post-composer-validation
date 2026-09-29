import React, { useState } from 'react';
import { csvStorage, downloadCSVFile } from '../utils/csvStorage';
import { csvRepository } from '../repositories/csvRepository';
import {
  Database,
  Download,
  RotateCcw,
  KeyRound,
  FileSpreadsheet,
  Eye,
  EyeOff,
  UserPlus,
  Trash2,
  X,
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle2,
  Users,
  Building2,
  Share2,
  Flag,
  Image,
  ShieldCheck
} from 'lucide-react';

export function CsvDatabaseView({ showToast }) {
  const [activeDataset, setActiveDataset] = useState('users'); // 'users', 'posts', 'drafts', 'workspaces', 'accounts', 'campaigns', 'media', 'audit'
  const [showRawText, setShowRawText] = useState(false);
  const [revealPasswords, setRevealPasswords] = useState(false); // default masked for security

  // Users state so additions/deletions update immediately
  const [usersList, setUsersList] = useState(() => csvStorage.getUsers());
  const [postsList, setPostsList] = useState(() => csvStorage.getPosts());
  const [draftsList, setDraftsList] = useState(() => csvStorage.getDrafts());
  const [workspacesList, setWorkspacesList] = useState(() => csvRepository.getWorkspaces());
  const [accountsList, setAccountsList] = useState(() => csvRepository.getSocialAccounts());
  const [campaignsList, setCampaignsList] = useState(() => csvRepository.getCampaigns());
  const [mediaList, setMediaList] = useState(() => csvRepository.getMedia());
  const [auditList, setAuditList] = useState(() => csvRepository.getAuditLogs());

  // Add Member Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Contributor',
  });
  const [formError, setFormError] = useState('');

  const refreshData = () => {
    setUsersList(csvStorage.getUsers());
    setPostsList(csvStorage.getPosts());
    setDraftsList(csvStorage.getDrafts());
    setWorkspacesList(csvRepository.getWorkspaces());
    setAccountsList(csvRepository.getSocialAccounts());
    setCampaignsList(csvRepository.getCampaigns());
    setMediaList(csvRepository.getMedia());
    setAuditList(csvRepository.getAuditLogs());
  };

  const handleDownloadActiveCSV = () => {
    let content = '';
    let filename = '';

    if (activeDataset === 'users') {
      content = csvStorage.getUsersCSV();
      filename = `demo_users_${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (activeDataset === 'posts') {
      content = csvStorage.getPostsCSV();
      filename = `posts_dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (activeDataset === 'drafts') {
      content = csvStorage.getDraftsCSV();
      filename = `drafts_dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (activeDataset === 'workspaces') {
      content = csvRepository.getWorkspacesCSV();
      filename = `workspaces_${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (activeDataset === 'accounts') {
      content = csvRepository.getSocialAccountsCSV();
      filename = `social_accounts_${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (activeDataset === 'campaigns') {
      content = csvRepository.getCampaignsCSV();
      filename = `campaigns_${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (activeDataset === 'media') {
      content = csvRepository.getMediaCSV();
      filename = `media_assets_${new Date().toISOString().slice(0, 10)}.csv`;
    } else {
      content = csvRepository.getAuditLogsCSV();
      filename = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    }

    downloadCSVFile(content, filename);
    showToast(`Downloaded ${filename}!`, 'success');
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all CSV datasets to initial demo seed?')) {
      csvStorage.resetAllToDefault();
      csvRepository.resetAllRepositories();
      refreshData();
      showToast('All CSV files reset to default demo seed', 'info');
    }
  };

  // Add Member submission handler
  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Please enter full member name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setFormError('Password must contain at least 6 characters.');
      return;
    }

    const result = csvStorage.addUser(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (!result.success) {
      setFormError(result.error);
      return;
    }

    refreshData();
    setShowAddModal(false);
    setFormData({ name: '', email: '', password: '', role: 'Contributor' });
    showToast(`Member "${formData.name.trim()}" added to users.csv!`, 'success');
  };

  // Delete Member handler
  const handleDeleteUser = (user) => {
    if (confirm(`Remove member "${user.Name}" (${user.Email}) from users.csv?`)) {
      const res = csvStorage.deleteUser(user.ID);
      if (res && res.error) {
        showToast(res.error, 'error');
        return;
      }
      refreshData();
      showToast(`Member "${user.Name}" removed from users.csv.`, 'info');
    }
  };

  const currentRawCSV =
    activeDataset === 'users'
      ? csvStorage.getUsersCSV()
      : activeDataset === 'posts'
      ? csvStorage.getPostsCSV()
      : activeDataset === 'drafts'
      ? csvStorage.getDraftsCSV()
      : activeDataset === 'workspaces'
      ? csvRepository.getWorkspacesCSV()
      : activeDataset === 'accounts'
      ? csvRepository.getSocialAccountsCSV()
      : activeDataset === 'campaigns'
      ? csvRepository.getCampaignsCSV()
      : activeDataset === 'media'
      ? csvRepository.getMediaCSV()
      : csvRepository.getAuditLogsCSV();

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="csv-badge-title">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>Development / Demo Data Inspector</span>
          </div>
          <h2 className="section-title">Active CSV Database Inspector</h2>
          <p className="section-subtitle">
            Local RFC-4180 CSV tables enabling ₹0 zero-budget development. (Production connects to Supabase PostgreSQL & RLS).
          </p>
        </div>

        <div className="section-actions-group">
          {activeDataset === 'users' && (
            <button
              type="button"
              onClick={() => {
                setFormError('');
                setShowAddModal(true);
              }}
              className="btn-primary"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadActiveCSV}
            className="btn-secondary"
          >
            <Download className="w-4 h-4" />
            <span>Download {activeDataset}.csv</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn-secondary"
            title="Reset CSVs to initial seed"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo CSVs</span>
          </button>
        </div>
      </div>

      {/* Dataset Selection Tabs */}
      <div className="csv-tabs-row">
        <button
          type="button"
          onClick={() => setActiveDataset('users')}
          className={`csv-tab-btn ${activeDataset === 'users' ? 'active' : ''}`}
        >
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span>users.csv ({usersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('posts')}
          className={`csv-tab-btn ${activeDataset === 'posts' ? 'active' : ''}`}
        >
          <FileSpreadsheet className="w-4 h-4 text-sky-500" />
          <span>posts.csv ({postsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('drafts')}
          className={`csv-tab-btn ${activeDataset === 'drafts' ? 'active' : ''}`}
        >
          <Database className="w-4 h-4 text-indigo-500" />
          <span>drafts.csv ({draftsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('workspaces')}
          className={`csv-tab-btn ${activeDataset === 'workspaces' ? 'active' : ''}`}
        >
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span>workspaces.csv ({workspacesList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('accounts')}
          className={`csv-tab-btn ${activeDataset === 'accounts' ? 'active' : ''}`}
        >
          <Share2 className="w-4 h-4 text-primary" />
          <span>accounts.csv ({accountsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('campaigns')}
          className={`csv-tab-btn ${activeDataset === 'campaigns' ? 'active' : ''}`}
        >
          <Flag className="w-4 h-4 text-purple-500" />
          <span>campaigns.csv ({campaignsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('media')}
          className={`csv-tab-btn ${activeDataset === 'media' ? 'active' : ''}`}
        >
          <Image className="w-4 h-4 text-teal-500" />
          <span>media.csv ({mediaList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('audit')}
          className={`csv-tab-btn ${activeDataset === 'audit' ? 'active' : ''}`}
        >
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span>audit_logs.csv ({auditList.length})</span>
        </button>

        <div className="csv-tab-toggles">
          {activeDataset === 'users' && (
            <button
              type="button"
              onClick={() => setRevealPasswords(!revealPasswords)}
              className="toggle-raw-btn"
            >
              {revealPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{revealPasswords ? 'Mask Passwords' : 'Show Demo Passwords'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowRawText(!showRawText)}
            className="toggle-raw-btn"
          >
            <span>{showRawText ? 'View Table Format' : 'View Raw CSV'}</span>
          </button>
        </div>
      </div>

      {/* RAW CSV TEXT VIEW */}
      {showRawText ? (
        <div className="raw-csv-container">
          <div className="raw-csv-header">
            <span>Raw CSV File Content (RFC 4180 standard)</span>
          </div>
          <pre className="raw-csv-code">{currentRawCSV}</pre>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="csv-table-card">
          {/* 1. USERS DATASET */}
          {activeDataset === 'users' && (
            <div>
              <div className="users-table-header-bar">
                <div className="users-summary-info">
                  <Users className="w-4 h-4 text-primary" />
                  <span>
                    <strong>{usersList.length} Demo Accounts</strong> stored in <code>users.csv</code> (3 initial defaults + live members)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormError('');
                    setShowAddModal(true);
                  }}
                  className="btn-primary btn-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add New Member</span>
                </button>
              </div>

              <div className="table-wrapper">
                <table className="posts-data-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Demo Password</th>
                      <th>Role</th>
                      <th>Created At</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.ID}>
                        <td className="font-mono text-slate-muted">{u.ID}</td>
                        <td className="font-bold">{u.Name}</td>
                        <td className="text-primary font-medium">{u.Email}</td>
                        <td>
                          <span className="password-cell font-mono">
                            {revealPasswords ? u.Password : '••••••••••••'}
                          </span>
                        </td>
                        <td>
                          <span className="role-badge">{u.Role}</span>
                        </td>
                        <td className="text-slate-muted font-mono">{u.CreatedAt}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            className="btn-icon-action delete"
                            title={`Delete ${u.Name}`}
                            disabled={usersList.length <= 1}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. POSTS DATASET */}
          {activeDataset === 'posts' && (
            <div className="table-wrapper">
              <table className="posts-data-table">
                <thead>
                  <tr>
                    <th>Post ID</th>
                    <th>Author</th>
                    <th>Channel</th>
                    <th>Status</th>
                    <th>Chars / Limit</th>
                    <th>Schedule Date</th>
                    <th>Content</th>
                  </tr>
                </thead>
                <tbody>
                  {postsList.map((p) => (
                    <tr key={p.ID}>
                      <td className="font-mono text-slate-muted">{p.ID}</td>
                      <td className="text-slate-muted">{p.UserEmail}</td>
                      <td>
                        <span className="platform-tag font-bold">{p.Platform}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${p.Status.toLowerCase().replace(/\s+/g, '-')}`}>{p.Status}</span>
                      </td>
                      <td className="font-mono">{p.CharCount} / {p.Limit}</td>
                      <td className="text-slate-muted font-mono">{p.ScheduledAt || 'Immediate'}</td>
                      <td className="content-cell-preview" title={p.Content}>
                        {p.Content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. DRAFTS DATASET */}
          {activeDataset === 'drafts' && (
            <div className="table-wrapper">
              <table className="posts-data-table">
                <thead>
                  <tr>
                    <th>Draft ID</th>
                    <th>Author</th>
                    <th>Channel</th>
                    <th>Favorite?</th>
                    <th>Created At</th>
                    <th>Draft Content</th>
                  </tr>
                </thead>
                <tbody>
                  {draftsList.map((d) => (
                    <tr key={d.ID}>
                      <td className="font-mono text-slate-muted">{d.ID}</td>
                      <td className="text-slate-muted">{d.UserEmail}</td>
                      <td>
                        <span className="platform-tag font-bold">{d.Platform}</span>
                      </td>
                      <td>
                        <span className="text-xs font-bold text-amber-600">
                          {d.IsFavorite === 'true' ? '★ Yes' : 'No'}
                        </span>
                      </td>
                      <td className="text-slate-muted font-mono">{d.CreatedAt}</td>
                      <td className="content-cell-preview" title={d.Content}>
                        {d.Content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. WORKSPACES DATASET */}
          {activeDataset === 'workspaces' && (
            <div className="table-wrapper">
              <table className="posts-data-table">
                <thead>
                  <tr>
                    <th>Workspace ID</th>
                    <th>Workspace Name</th>
                    <th>Slug</th>
                    <th>Owner Role</th>
                    <th>Active Plan</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {workspacesList.map((w) => (
                    <tr key={w.ID}>
                      <td className="font-mono text-slate-muted">{w.ID}</td>
                      <td className="font-bold">{w.Name}</td>
                      <td className="font-mono text-xs text-primary">/{w.Slug}</td>
                      <td><span className="role-badge">{w.Role}</span></td>
                      <td><span className="platform-tag" style={{ backgroundColor: '#2563eb' }}>{w.Plan}</span></td>
                      <td className="text-slate-muted font-mono">{w.CreatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. SOCIAL ACCOUNTS DATASET */}
          {activeDataset === 'accounts' && (
            <div className="table-wrapper">
              <table className="posts-data-table">
                <thead>
                  <tr>
                    <th>Account ID</th>
                    <th>Workspace ID</th>
                    <th>Platform</th>
                    <th>Username</th>
                    <th>Followers</th>
                    <th>Token Preview</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accountsList.map((a) => (
                    <tr key={a.ID}>
                      <td className="font-mono text-slate-muted">{a.ID}</td>
                      <td className="font-mono text-xs">{a.WorkspaceId}</td>
                      <td><span className="platform-tag font-bold">{a.Platform}</span></td>
                      <td className="font-bold">{a.Username}</td>
                      <td className="font-mono">{parseInt(a.Followers || 0).toLocaleString()}</td>
                      <td className="font-mono text-xs text-slate-500">{a.TokenPreview || '••••••••••••••••'}</td>
                      <td><span className="status-pill published">{a.Status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 6. CAMPAIGNS DATASET */}
          {activeDataset === 'campaigns' && (
            <div className="table-wrapper">
              <table className="posts-data-table">
                <thead>
                  <tr>
                    <th>Campaign ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Date Window</th>
                    <th>Platforms</th>
                    <th>Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignsList.map((c) => (
                    <tr key={c.ID}>
                      <td className="font-mono text-slate-muted">{c.ID}</td>
                      <td className="font-bold">{c.Name}</td>
                      <td><span className="status-pill published">{c.Status}</span></td>
                      <td className="text-xs text-slate-600">{c.StartDate} to {c.EndDate}</td>
                      <td className="text-xs">{c.Platforms}</td>
                      <td className="text-xs text-primary font-mono">{c.Tags}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 7. MEDIA DATASET */}
          {activeDataset === 'media' && (
            <div className="table-wrapper">
              <table className="posts-data-table">
                <thead>
                  <tr>
                    <th>Media ID</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Size (MB)</th>
                    <th>Used Count</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaList.map((m) => (
                    <tr key={m.ID}>
                      <td className="font-mono text-slate-muted">{m.ID}</td>
                      <td className="font-bold">{m.Title}</td>
                      <td><span className="role-badge">{m.Type}</span></td>
                      <td className="font-mono">{m.SizeMB} MB</td>
                      <td className="font-mono">{m.UsedCount}x</td>
                      <td className="text-slate-muted font-mono">{m.CreatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 8. AUDIT LOGS DATASET */}
          {activeDataset === 'audit' && (
            <div className="table-wrapper">
              <table className="posts-data-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Resource</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditList.map((al) => (
                    <tr key={al.ID}>
                      <td className="font-mono text-slate-muted">{al.ID}</td>
                      <td className="font-mono text-xs">{al.Timestamp}</td>
                      <td className="text-primary font-medium">{al.UserEmail}</td>
                      <td><span className="role-badge">{al.Action}</span></td>
                      <td className="font-mono text-xs">{al.Resource}</td>
                      <td className="text-xs text-slate-600">{al.Details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD MEMBER MODAL FORM */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <UserPlus className="w-5 h-5 text-primary" />
                <h3 className="modal-title">Add New Member to users.csv</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="modal-error-banner">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddMemberSubmit} className="auth-form">
              <div className="form-field">
                <label className="field-label">Full Name</label>
                <div className="input-with-icon">
                  <User className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Hayes"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Create user password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Role</label>
                <div className="input-with-icon">
                  <Shield className="input-icon" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="modal-input"
                    style={{ paddingLeft: '36px' }}
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Editor">Editor</option>
                    <option value="Contributor">Contributor</option>
                    <option value="Author">Author</option>
                    <option value="Analyst">Analyst</option>
                  </select>
                </div>
              </div>

              <div className="csv-storage-note">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Writes new record to <code>users.csv</code> with RFC-4180 escaping</span>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save to users.csv
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
