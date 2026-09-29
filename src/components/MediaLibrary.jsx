import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Video,
  UploadCloud,
  Trash2,
  HardDrive,
  Search,
  Filter,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { mediaService } from '../services/mediaService';
import { subscriptionService } from '../services/subscriptionService';
import { AddMediaModal } from './AddMediaModal';

export function MediaLibrary({ onNavigateToComposer, showToast }) {
  const [filterType, setFilterType] = useState('All'); // 'All', 'image', 'video'
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mediaList, setMediaList] = useState(() => mediaService.getMedia());

  const currentPlan = subscriptionService.getCurrentPlan();
  const totalStorageUsedMB = mediaService.getTotalStorageUsedMB();
  const storageLimitMB = currentPlan.limits.storageMB;
  const storagePercent = Math.min(100, Math.round((totalStorageUsedMB / storageLimitMB) * 100));

  const refreshList = () => {
    setMediaList(mediaService.getMedia());
  };

  const handleDelete = (item) => {
    if (confirm(`Delete media asset "${item.Title}"?`)) {
      mediaService.deleteMedia(item.ID);
      refreshList();
      showToast(`Asset "${item.Title}" removed`, 'info');
    }
  };

  const filtered = mediaList.filter((item) => {
    const matchesType = filterType === 'All' ? true : item.Type === filterType;
    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : item.Title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="header-pill">Cloud Storage & Assets</div>
          <h2 className="section-title">Media Library</h2>
          <p className="section-subtitle">
            Centralized digital asset management for campaign imagery, video teasers, and brand collateral.
          </p>
        </div>

        <div className="section-actions-group">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Asset</span>
          </button>
        </div>
      </div>

      {/* Storage Capacity Overview Card */}
      <div className="storage-meter-banner-card">
        <div className="storage-info-left">
          <HardDrive className="w-5 h-5 text-primary" />
          <div>
            <strong className="storage-title">Storage Utilization ({currentPlan.name} Tier)</strong>
            <p className="storage-sub">
              {totalStorageUsedMB.toFixed(1)} MB of {storageLimitMB.toLocaleString()} MB allocated storage utilized
            </p>
          </div>
        </div>

        <div className="storage-meter-right">
          <span className="storage-percent-tag">{storagePercent}% capacity</span>
          <div className="storage-progress-track">
            <div
              className="storage-progress-fill"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-search-card">
        <div className="filter-pills-row">
          <button
            type="button"
            onClick={() => setFilterType('All')}
            className={`filter-pill-btn ${filterType === 'All' ? 'active' : ''}`}
          >
            All Media ({mediaList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('image')}
            className={`filter-pill-btn ${filterType === 'image' ? 'active' : ''}`}
          >
            Images ({mediaList.filter((m) => m.Type === 'image').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('video')}
            className={`filter-pill-btn ${filterType === 'video' ? 'active' : ''}`}
          >
            Videos ({mediaList.filter((m) => m.Type === 'video').length})
          </button>
        </div>

        <div className="search-input-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="media-assets-grid">
        {filtered.length === 0 ? (
          <div className="empty-state-box" style={{ gridColumn: '1 / -1' }}>
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p>No media assets found matching the filter.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.ID} className="media-asset-card">
              <div className="media-card-preview-box">
                <img src={item.Url} alt={item.Title} />
                <span className="media-badge-tag">{item.Type}</span>
              </div>

              <div className="media-card-body">
                <strong className="media-asset-title" title={item.Title}>
                  {item.Title}
                </strong>
                <div className="media-card-meta-row">
                  <span>{item.SizeMB} MB</span>
                  <span>·</span>
                  <span>Used {item.UsedCount}x</span>
                  <span>·</span>
                  <span>{item.CreatedAt?.slice(0, 10)}</span>
                </div>

                <div className="media-card-actions-row">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToComposer();
                      showToast(`Navigated to Composer with ${item.Title}`, 'info');
                    }}
                    className="btn-secondary btn-sm"
                  >
                    <span>Use in Post</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="btn-icon-action delete"
                    title="Delete asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Media Modal */}
      <AddMediaModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSelectMedia={() => {
          refreshList();
        }}
        showToast={showToast}
      />
    </div>
  );
}
