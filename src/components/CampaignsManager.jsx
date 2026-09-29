import React, { useState } from 'react';
import {
  Flag,
  Hash,
  Tag,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  X
} from 'lucide-react';
import { campaignService } from '../services/campaignService';
import { PLATFORM_RULES } from '../constants/platformRules';

export function CampaignsManager({ showToast }) {
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns', 'hashtags', 'tags'
  const [campaigns, setCampaigns] = useState(() => campaignService.getCampaigns());
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Campaign Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Twitter', 'LinkedIn', 'Instagram']);
  const [campaignTags, setCampaignTags] = useState('Launch,SaaS');

  const hashtagGroups = campaignService.getHashtagGroups();
  const tagsList = campaignService.getTags();

  const handleCreateCampaignSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const res = campaignService.createCampaign({
      name,
      description,
      startDate,
      endDate,
      platforms: selectedPlatforms,
      tags: campaignTags.split(',').map((t) => t.trim()),
    });

    setCampaigns(campaignService.getCampaigns());
    setShowCreateModal(false);
    setName('');
    setDescription('');
    showToast(`Campaign "${res.campaign.Name}" created!`, 'success');
  };

  const togglePlatform = (p) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="header-pill">Strategic Marketing Campaigns</div>
          <h2 className="section-title">Campaigns & Organizational Tags</h2>
          <p className="section-subtitle">
            Group scheduled content around unified product launches, seasonal promotions, and hashtag collections.
          </p>
        </div>

        <div className="section-actions-group">
          {activeTab === 'campaigns' && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="csv-tabs-row">
        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          className={`csv-tab-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
        >
          <Flag className="w-4 h-4 text-primary" />
          <span>Active Campaigns ({campaigns.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hashtags')}
          className={`csv-tab-btn ${activeTab === 'hashtags' ? 'active' : ''}`}
        >
          <Hash className="w-4 h-4 text-indigo-500" />
          <span>Hashtag Groups ({hashtagGroups.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tags')}
          className={`csv-tab-btn ${activeTab === 'tags' ? 'active' : ''}`}
        >
          <Tag className="w-4 h-4 text-emerald-500" />
          <span>Content Tags ({tagsList.length})</span>
        </button>
      </div>

      {/* CAMPAIGNS TAB */}
      {activeTab === 'campaigns' && (
        <div className="cards-grid-3">
          {campaigns.map((camp) => (
            <div key={camp.ID} className="draft-item-card campaign-card-item">
              <div className="draft-card-header">
                <span className={`status-pill ${camp.Status.toLowerCase()}`}>{camp.Status}</span>
                <span className="font-mono text-slate-muted text-xs">{camp.ID}</span>
              </div>

              <div>
                <h3 className="campaign-card-title">{camp.Name}</h3>
                <p className="campaign-card-desc">{camp.Description}</p>

                <div className="campaign-meta-chips-row">
                  <span className="campaign-date-span">
                    <Calendar className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    {camp.StartDate} to {camp.EndDate}
                  </span>
                </div>

                <div className="campaign-platforms-flex">
                  {(camp.Platforms || '').split(',').filter(Boolean).map((plat) => (
                    <span
                      key={plat}
                      className="platform-micro-chip"
                      style={{ backgroundColor: PLATFORM_RULES[plat]?.color || '#0f172a' }}
                    >
                      {plat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="draft-card-footer">
                <div className="tags-preview-list">
                  {(camp.Tags || '').split(',').filter(Boolean).map((t) => (
                    <span key={t} className="campaign-tag-badge">#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HASHTAGS TAB */}
      {activeTab === 'hashtags' && (
        <div className="hashtag-groups-grid">
          {hashtagGroups.map((grp) => (
            <div key={grp.id} className="kpi-card">
              <div className="kpi-header">
                <strong className="kpi-title">{grp.name}</strong>
                <Hash className="w-4 h-4 text-primary" />
              </div>
              <div className="hashtag-chips-flex mt-2">
                {grp.tags.map((tag) => (
                  <span key={tag} className="hashtag-vault-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAGS TAB */}
      {activeTab === 'tags' && (
        <div className="kpi-card">
          <div className="kpi-header">
            <strong className="kpi-title">Organization Tag Repository</strong>
            <Tag className="w-4 h-4 text-primary" />
          </div>
          <div className="tags-chips-selection-box mt-3">
            {tagsList.map((tag) => (
              <span key={tag} className="tag-selectable-pill selected">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Flag className="w-5 h-5 text-primary" />
                <h3 className="modal-title">Create Marketing Campaign</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="auth-form">
              <div className="form-field">
                <label className="field-label">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Black Friday Launch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Description & Goal</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Campaign objectives and publication theme..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="modal-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label className="field-label">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Target Channels</label>
                <div className="channel-checkboxes-flex">
                  {['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube'].map((p) => (
                    <label key={p} className="channel-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(p)}
                        onChange={() => togglePlatform(p)}
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Associated Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Launch, SaaS, Tech"
                  value={campaignTags}
                  onChange={(e) => setCampaignTags(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
