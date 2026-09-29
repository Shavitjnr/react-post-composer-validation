import React, { useState } from 'react';
import { csvStorage, downloadCSVFile } from '../utils/csvStorage';
import {
  Database,
  Download,
  RotateCcw,
  KeyRound,
  FileSpreadsheet,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export function CsvDatabaseView({ showToast }) {
  const [activeDataset, setActiveDataset] = useState('users'); // 'users', 'posts', 'drafts'
  const [showRawText, setShowRawText] = useState(false);
  const [revealPasswords, setRevealPasswords] = useState(true);

  const users = csvStorage.getUsers();
  const posts = csvStorage.getPosts();
  const drafts = csvStorage.getDrafts();

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
      showToast('All CSV files reset to default demo data', 'info');
      window.location.reload();
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
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>CSV Data Persistence Engine</span>
          </div>
          <h2 className="section-title">Active CSV Database Inspector</h2>
          <p className="section-subtitle">
            All user authentication, passwords, social media posts, and drafts are stored and managed in standard CSV format.
          </p>
        </div>

        <div className="section-actions-group">
          <button
            type="button"
            onClick={handleDownloadActiveCSV}
            className="btn-primary"
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
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>users.csv ({users.length} Users & Passwords)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('posts')}
          className={`csv-tab-btn ${activeDataset === 'posts' ? 'active' : ''}`}
        >
          <FileSpreadsheet className="w-4 h-4 text-sky-400" />
          <span>posts.csv ({posts.length} Posts)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDataset('drafts')}
          className={`csv-tab-btn ${activeDataset === 'drafts' ? 'active' : ''}`}
        >
          <Database className="w-4 h-4 text-indigo-400" />
          <span>drafts.csv ({drafts.length} Drafts)</span>
        </button>

        <div className="csv-tab-toggles">
          {activeDataset === 'users' && (
            <button
              type="button"
              onClick={() => setRevealPasswords(!revealPasswords)}
              className="toggle-raw-btn"
            >
              {revealPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{revealPasswords ? 'Mask Passwords' : 'Show Passwords'}</span>
            </button>
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
          {/* USERS DATASET (WITH PASSWORDS) */}
          {activeDataset === 'users' && (
            <div className="table-responsive">
              <table className="posts-data-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Stored Password (CSV)</th>
                    <th>Role</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.ID}>
                      <td className="font-mono text-slate-muted">{u.ID}</td>
                      <td className="font-bold text-white">{u.Name}</td>
                      <td className="text-sky-400">{u.Email}</td>
                      <td>
                        <span className="password-cell font-mono">
                          {revealPasswords ? u.Password : '••••••••••••'}
                        </span>
                      </td>
                      <td>
                        <span className="role-badge">{u.Role}</span>
                      </td>
                      <td className="text-slate-muted text-xs">{u.CreatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* POSTS DATASET */}
          {activeDataset === 'posts' && (
            <div className="table-responsive">
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
                  {posts.map((p) => (
                    <tr key={p.ID}>
                      <td className="font-mono text-slate-muted text-xs">{p.ID}</td>
                      <td className="text-xs text-slate-300">{p.UserEmail}</td>
                      <td>
                        <span className="platform-tag font-bold">{p.Platform}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${p.Status.toLowerCase()}`}>{p.Status}</span>
                      </td>
                      <td className="font-mono text-xs">{p.CharCount} / {p.Limit}</td>
                      <td className="text-xs text-slate-muted">{p.ScheduledAt || 'Immediate'}</td>
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
            <div className="table-responsive">
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
                  {drafts.map((d) => (
                    <tr key={d.ID}>
                      <td className="font-mono text-slate-muted text-xs">{d.ID}</td>
                      <td className="text-xs text-slate-300">{d.UserEmail}</td>
                      <td>
                        <span className="platform-tag font-bold">{d.Platform}</span>
                      </td>
                      <td>
                        <span className="text-xs font-bold text-amber-400">
                          {d.IsFavorite === 'true' ? '★ Yes' : 'No'}
                        </span>
                      </td>
                      <td className="text-xs text-slate-muted">{d.CreatedAt}</td>
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
    </div>
  );
}
