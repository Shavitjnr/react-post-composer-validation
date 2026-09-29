import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Unlink,
  ShieldCheck,
  Lock,
  ExternalLink
} from 'lucide-react';
import { socialService } from '../services/socialService';
import { subscriptionService } from '../services/subscriptionService';
import { PLATFORM_RULES } from '../constants/platformRules';

export function SocialAccountsManager({ activeWorkspace, showToast }) {
  const [accounts, setAccounts] = useState(() => socialService.getConnectedAccounts());
  const [isConnecting, setIsConnecting] = useState(false);

  const currentPlan = subscriptionService.getCurrentPlan();
  const maxAccounts = currentPlan.limits.socialAccounts;

  const refreshAccounts = () => {
    setAccounts(socialService.getConnectedAccounts());
  };

  const handleConnect = async (platformKey) => {
    setIsConnecting(true);
    const res = await socialService.connectAccount(platformKey);
    setIsConnecting(false);

    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }

    refreshAccounts();
    showToast(res.message, 'success');
  };

  const handleDisconnect = (accountId) => {
    if (confirm('Disconnect this social channel? Scheduled releases for this channel will be paused.')) {
      socialService.disconnectAccount(accountId);
      refreshAccounts();
      showToast('Social channel unlinked from workspace', 'info');
    }
  };

  const platforms = [
    { key: 'Instagram', name: 'Instagram', desc: 'Instagram Business Accounts & Creators' },
    { key: 'Facebook', name: 'Facebook', desc: 'Facebook Pages and Brand Communities' },
    { key: 'LinkedIn', name: 'LinkedIn', desc: 'Company Pages & Personal Member Profiles' },
    { key: 'Twitter', name: 'X', desc: 'Formerly Twitter — API v2 Micro-broadcasting' },
    { key: 'YouTube', name: 'YouTube', desc: 'YouTube Community Posts & Video Publishing' },
  ];

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="header-pill">Multi-Channel Social Integration</div>
          <h2 className="section-title">Connected Social Accounts</h2>
          <p className="section-subtitle">
            Link company pages, handles, and channels. Operating in Demo Mode with zero credential leak risk.
          </p>
        </div>

        <div className="section-actions-group">
          <div className="account-capacity-chip">
            <strong>{accounts.length}</strong> of <strong>{maxAccounts}</strong> Channels Connected ({currentPlan.name} Tier)
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="token-security-banner">
        <div className="security-icon-box">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="security-text-col">
          <strong>Enterprise Token Isolation & Zero-Leak Security</strong>
          <p>
            Production access tokens are stored in backend encrypted vaults. React client interfaces only display sanitized token previews (<code>••••••••••••••••</code>).
          </p>
        </div>
      </div>

      {/* Social Platforms Grid */}
      <div className="social-channels-grid">
        {platforms.map((p) => {
          const cfg = PLATFORM_RULES[p.key] || { color: '#0f172a', badge: p.key };
          const connectedAccount = accounts.find((a) => a.Platform === p.key);
          const isConnected = Boolean(connectedAccount);

          return (
            <div key={p.key} className={`social-account-card ${isConnected ? 'is-connected' : ''}`}>
              <div className="social-card-top-row">
                <div className="social-badge-logo" style={{ backgroundColor: cfg.color }}>
                  {cfg.badge}
                </div>
                <div className={`connection-badge-pill ${isConnected ? 'online' : 'offline'}`}>
                  <span className="dot" />
                  <span>{isConnected ? 'Connected' : 'Not Connected'}</span>
                </div>
              </div>

              <div className="social-card-body">
                <h3 className="social-channel-title">{p.name}</h3>
                <p className="social-channel-desc">{p.desc}</p>

                {isConnected ? (
                  <div className="connected-details-box">
                    <div className="account-handle-row">
                      <strong>{connectedAccount.DisplayName || connectedAccount.Username}</strong>
                      <span className="handle-tag">{connectedAccount.Username}</span>
                    </div>

                    <div className="account-meta-indicators">
                      <span>Followers: <strong>{parseInt(connectedAccount.Followers || 0).toLocaleString()}</strong></span>
                      <span>·</span>
                      <span className="token-masked-snippet">
                        <Lock className="w-3 h-3 inline mr-1 text-slate-400" />
                        {connectedAccount.TokenPreview || '••••••••••••••••'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="disconnected-placeholder-box">
                    <span>No active connection registered for this workspace.</span>
                  </div>
                )}
              </div>

              <div className="social-card-footer">
                {isConnected ? (
                  <button
                    type="button"
                    onClick={() => handleDisconnect(connectedAccount.ID)}
                    className="btn-disconnect-channel"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleConnect(p.key)}
                    disabled={isConnecting}
                    className="btn-connect-channel"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect in Demo Mode</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
