import React, { useState } from 'react';
import { csvStorage, downloadCSVFile } from '../utils/csvStorage';
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
  Users
} from 'lucide-react';

export function CsvDatabaseView({ showToast }) {
  const [activeDataset, setActiveDataset] = useState('users'); // 'users', 'posts', 'drafts'
  const [showRawText, setShowRawText] = useState(false);
  const [revealPasswords, setRevealPasswords] = useState(true);

  // Users state so additions/deletions update immediately
  const [usersList, setUsersList] = useState(() => csvStorage.getUsers());
  const [postsList, setPostsList] = useState(() => csvStorage.getPosts());
  const [draftsList, setDraftsList] = useState(() => csvStorage.getDrafts());

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
  };

  const handleDownloadActiveCSV = () => {
    let content = '';
    let filename = '';

    if (activeDataset === 'users') {
      content = csvStorage.getUsersCSV();
      filename = `users_and_passwords_${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (activeDataset === 'posts') {
      content = csvStorage.getPostsCSV();
      filename = `posts_dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    } else {
      content = csvStorage.getDraftsCSV();
      filename = `drafts_dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    }

    downloadCSVFile(content, filename);
    showToast(`Downloaded ${filename}!`, 'success');
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all CSV datasets (users with passwords, posts, and drafts) to initial defaults?')) {
      csvStorage.resetAllToDefault();
      refreshData();
      showToast('All CSV files reset to default demo data (3 initial users restored)', 'info');
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
      : csvStorage.getDraftsCSV();

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="csv-badge-title">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>CSV Data Persistence Engine</span>
          </div>
          <h2 className="section-title">Active CSV Database Inspector</h2>
          <p className="section-subtitle">
            All user authentication, passwords, social media posts, and drafts are stored and managed in standard CSV format.
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
          <span>users.csv ({usersList.length} Users & Passwords)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('posts')}
          className={`csv-tab-btn ${activeDataset === 'posts' ? 'active' : ''}`}
        >
          <FileSpreadsheet className="w-4 h-4 text-sky-500" />
          <span>posts.csv ({postsList.length} Posts)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('drafts')}
          className={`csv-tab-btn ${activeDataset === 'drafts' ? 'active' : ''}`}
        >
          <Database className="w-4 h-4 text-indigo-500" />
          <span>drafts.csv ({draftsList.length} Drafts)</span>
        </button>

        <div className="csv-tab-toggles">
          {activeDataset === 'users' && (
            <>
              <button
                type="button"
                onClick={() => {
                  setFormError('');
                  setShowAddModal(true);
                }}
                className="toggle-raw-btn"
                title="Add new member to users.csv"
              >
                <UserPlus className="w-3.5 h-3.5 text-primary" />
                <span>Add Member</span>
              </button>

              <button
                type="button"
                onClick={() => setRevealPasswords(!revealPasswords)}
                className="toggle-raw-btn"
              >
                {revealPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealPasswords ? 'Mask Passwords' : 'Show Passwords'}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowRawText(!showRawText)}
            className="toggle-raw-btn"
          >
            <span>{showRawText ? 'View Table Format' : 'View Raw CSV Text'}</span>
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
          {/* USERS DATASET (WITH PASSWORDS & ADD BUTTON) */}
          {activeDataset === 'users' && (
            <div>
              {/* Informational Sub-Bar */}
              <div className="users-table-header-bar">
                <div className="users-summary-info">
                  <Users className="w-4 h-4 text-primary" />
                  <span>
                    <strong>{usersList.length} Authenticated Accounts</strong> stored directly in <code>users.csv</code>
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
                      <th>Stored Password (CSV)</th>
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
                            title={`Delete ${u.Name} from users.csv`}
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

          {/* POSTS DATASET */}
          {activeDataset === 'posts' && (
            <div className="table-wrapper">
              <table className="posts-data-table">
                <thead>
                  <tr>
                    <th>Post ID</th>
                    <th>Author</th>
                    <th>Platform</th>
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
                        <span className="platform-tag font-bold" style={{ backgroundColor: p.Platform === 'Twitter' ? '#0284c7' : '#0a66c2' }}>
                          {p.Platform}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${p.Status.toLowerCase()}`}>{p.Status}</span>
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

          {/* DRAFTS DATASET */}
          {activeDataset === 'drafts' && (
            <div className="table-wrapper">
              <table className="posts-data-table">
                <thead>
                  <tr>
                    <th>Draft ID</th>
                    <th>Author</th>
                    <th>Platform</th>
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
                        <span className="platform-tag font-bold" style={{ backgroundColor: d.Platform === 'Twitter' ? '#0284c7' : '#0a66c2' }}>
                          {d.Platform}
                        </span>
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
