import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Globe,
  Clock,
  ShieldCheck,
  Key,
  Webhook,
  Download,
  Check,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  Save,
  CheckCircle2,
  Sliders,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { csvStorage } from '../utils/csvStorage';
import { adminService } from '../services/adminService';

export function WorkspaceSettingsView({ activeWorkspace, showToast }) {
  const [workspaceName, setWorkspaceName] = useState(activeWorkspace?.Name || 'Hostego Media Lab');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [requireApproval, setRequireApproval] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);
  const [autoHashtags, setAutoHashtags] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.zapier.com/hooks/catch/pcp_live_orders_9201');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const apiKey = 'pcp_live_9pR3cE8KEwBWeAAqBmTAK_sec772';

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText?.(apiKey);
    setIsCopied(true);
    showToast('API Key copied to clipboard', 'info');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaved(true);
    showToast('Workspace settings saved successfully', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportJson = () => {
    const posts = csvStorage.getPosts();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `workspace_posts_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported workspace posts backup in JSON format', 'success');
  };

  const handleExportAudit = () => {
    const logs = adminService.getGlobalAuditLogs();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `compliance_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported compliance audit trail', 'success');
  };

  return (
    <div className="workspace-settings-root">
      {/* Header */}
      <div className="settings-page-header">
        <div className="settings-header-left">
          <div className="settings-icon-badge">
            <Sliders className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="settings-page-title">Workspace Settings & Governance</h1>
            <p className="settings-page-subtitle">
              Configure brand presets, content approval rules, security credentials, and organization parameters.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="btn-save-settings"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="settings-content-grid">
        {/* Section 1: General Workspace Profile */}
        <section className="settings-card">
          <div className="settings-card-head">
            <Building2 className="w-4 h-4 text-primary" />
            <h2>General Workspace Profile</h2>
          </div>
          <p className="card-subtext">Basic identity and regional formatting settings for this workspace.</p>

          <form onSubmit={handleSaveSettings} className="settings-form-body">
            <div className="form-group-row">
              <label>Workspace Display Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="settings-input"
              />
            </div>

            <div className="form-row-dual">
              <div className="form-group-row">
                <label>Default Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="settings-select"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                  <option value="America/New_York">America/New_York (EST, UTC-5)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST, UTC-8)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="UTC">Universal Coordinated Time (UTC)</option>
                </select>
              </div>

              <div className="form-group-row">
                <label>Workspace Identifier (UID)</label>
                <input
                  type="text"
                  value={activeWorkspace?.ID || 'ws_default_hostego'}
                  disabled
                  className="settings-input disabled-input"
                />
              </div>
            </div>
          </form>
        </section>

        {/* Section 2: Channel Rules & Limits */}
        <section className="settings-card">
          <div className="settings-card-head">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2>Active Channel Governance (Top 5 Supported)</h2>
          </div>
          <p className="card-subtext">The platform enforces strict character limits across all 5 active social networks.</p>

          <div className="channel-compliance-table">
            <div className="compliance-row">
              <span className="net-tag x-tag">𝕏 Twitter / X</span>
              <span className="net-limit">280 Characters</span>
              <span className="net-status-badge active">Strictly Enforced</span>
            </div>
            <div className="compliance-row">
              <span className="net-tag in-tag">in LinkedIn</span>
              <span className="net-limit">3,000 Characters</span>
              <span className="net-status-badge active">Strictly Enforced</span>
            </div>
            <div className="compliance-row">
              <span className="net-tag ig-tag">IG Instagram</span>
              <span className="net-limit">2,200 Characters</span>
              <span className="net-status-badge active">Strictly Enforced</span>
            </div>
            <div className="compliance-row">
              <span className="net-tag fb-tag">f Facebook</span>
              <span className="net-limit">5,000 Characters</span>
              <span className="net-status-badge active">Strictly Enforced</span>
            </div>
            <div className="compliance-row">
              <span className="net-tag yt-tag">YT YouTube</span>
              <span className="net-limit">5,000 Characters</span>
              <span className="net-status-badge active">Strictly Enforced</span>
            </div>
          </div>
        </section>

        {/* Section 3: Publishing Workflow & Approvals */}
        <section className="settings-card">
          <div className="settings-card-head">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2>Content Approval & Workflow Governance</h2>
          </div>
          <p className="card-subtext">Configure editorial controls before posts move from queue to published status.</p>

          <div className="toggle-options-stack">
            <label className="toggle-option-row">
              <div className="toggle-text">
                <strong>Require Editorial Approval for Scheduled Posts</strong>
                <span>Posts queued by Junior Editors or Clients must be approved before being dispatched.</span>
              </div>
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                className="toggle-checkbox"
              />
            </label>

            <label className="toggle-option-row">
              <div className="toggle-text">
                <strong>Client Publication Alerts</strong>
                <span>Send real-time desktop notification when a queued order or post is successfully published.</span>
              </div>
              <input
                type="checkbox"
                checked={autoNotify}
                onChange={(e) => setAutoNotify(e.target.checked)}
                className="toggle-checkbox"
              />
            </label>

            <label className="toggle-option-row">
              <div className="toggle-text">
                <strong>Auto-attach Brand Hashtag Vault</strong>
                <span>Automatically suggest standard brand hashtags on Instagram and LinkedIn drafts.</span>
              </div>
              <input
                type="checkbox"
                checked={autoHashtags}
                onChange={(e) => setAutoHashtags(e.target.checked)}
                className="toggle-checkbox"
              />
            </label>
          </div>
        </section>

        {/* Section 4: Security & Organization Integration */}
        <section className="settings-card">
          <div className="settings-card-head">
            <Key className="w-4 h-4 text-amber-600" />
            <h2>Security & Organization Integration</h2>
          </div>
          <p className="card-subtext">Enterprise Clerk Organization binding and Developer API tokens.</p>

          <div className="org-binding-banner">
            <div className="org-binding-info">
              <span className="org-label">Connected Organization:</span>
              <code className="org-code">org_3JzmVi9pR3cE8KEwBWeAAqBmTAK</code>
            </div>
            <span className="org-status-pill">Enterprise Verified</span>
          </div>

          <div className="api-key-box">
            <label className="api-key-label">Workspace API Access Secret</label>
            <div className="api-input-shell">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="api-key-input font-mono"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="btn-api-action"
                title={showApiKey ? 'Hide' : 'Reveal'}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleCopyApiKey}
                className="btn-api-action"
                title="Copy API Key"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="webhook-box">
            <label className="api-key-label">Publishing Webhook Dispatch (Zapier / Make / Slack)</label>
            <div className="webhook-input-shell">
              <Webhook className="w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="webhook-input font-mono"
                placeholder="https://your-domain.com/webhooks/social"
              />
            </div>
          </div>
        </section>

        {/* Section 5: Data Archival & Backups */}
        <section className="settings-card full-width-card">
          <div className="settings-card-head">
            <Download className="w-4 h-4 text-indigo-600" />
            <h2>Data Export & Compliance Backups</h2>
          </div>
          <p className="card-subtext">
            Export workspace datasets securely for backup, compliance audits, or external BI reporting.
          </p>

          <div className="export-actions-row">
            <button
              type="button"
              onClick={handleExportJson}
              className="btn-export-action"
            >
              <Download className="w-4 h-4" />
              <span>Export Workspace Posts Repository (JSON)</span>
            </button>

            <button
              type="button"
              onClick={handleExportAudit}
              className="btn-export-action secondary"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Download Compliance Audit Trail</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
