import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Download } from 'lucide-react';
import { csvRepository } from '../repositories/csvRepository';
import { downloadCSVFile } from '../utils/csvStorage';

export function AuditLogView({ showToast }) {
  const [search, setSearch] = useState('');
  const logs = csvRepository.getAuditLogs();

  const filtered = logs.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.Action?.toLowerCase().includes(q) ||
      l.UserEmail?.toLowerCase().includes(q) ||
      l.Details?.toLowerCase().includes(q)
    );
  });

  const handleDownload = () => {
    const content = csvRepository.getAuditLogsCSV();
    downloadCSVFile(content, `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Downloaded audit_logs.csv!', 'success');
  };

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="header-pill">Compliance & Security Trail</div>
          <h2 className="section-title">Workspace Audit Logs</h2>
          <p className="section-subtitle">
            Immutable chronological record of member activities, scheduled publications, and administrative actions.
          </p>
        </div>

        <div className="section-actions-group">
          <button type="button" onClick={handleDownload} className="btn-secondary">
            <Download className="w-4 h-4" />
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="filter-search-card">
        <div className="search-input-box" style={{ width: '100%', maxWidth: '360px' }}>
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, email, or resource ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-field"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="recent-posts-card">
        <div className="table-wrapper">
          <table className="posts-data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>Author Email</th>
                <th>Action Taken</th>
                <th>Target Resource</th>
                <th>Action Context & Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.ID}>
                  <td className="font-mono text-slate-muted text-xs">{log.ID}</td>
                  <td className="font-mono text-slate-muted text-xs">{log.Timestamp}</td>
                  <td className="text-primary font-medium">{log.UserEmail}</td>
                  <td>
                    <span className="role-badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                      {log.Action}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-slate-700">{log.Resource}</td>
                  <td className="text-slate-600 text-xs">{log.Details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
