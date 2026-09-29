import React, { useState } from 'react';
import { Image, Video, X, Check, Upload, HardDrive } from 'lucide-react';
import { mediaService } from '../services/mediaService';

export function AddMediaModal({ isOpen, onClose, onSelectMedia, showToast }) {
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'upload'
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('image');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const mediaList = mediaService.getMedia();

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!newTitle.trim()) {
      setError('Please provide a title for the media asset.');
      return;
    }

    const defaultSample = newType === 'image'
      ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80';

    const res = mediaService.uploadMedia({
      title: newTitle.trim(),
      type: newType,
      sizeMB: newType === 'image' ? 1.8 : 12.4,
      url: newUrl.trim() || defaultSample,
    });

    if (!res.success) {
      setError(res.error);
      return;
    }

    showToast(`Asset "${res.media.Title}" added to Media Library`, 'success');
    onSelectMedia(res.media);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Image className="w-5 h-5 text-primary" />
            <h3 className="modal-title">Select Media Asset</h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-subtabs-row">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`subtab-btn ${activeTab === 'library' ? 'active' : ''}`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Workspace Library ({mediaList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`subtab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Asset</span>
          </button>
        </div>

        {error && <div className="modal-error-banner">{error}</div>}

        {activeTab === 'library' ? (
          <div className="media-selector-grid">
            {mediaList.map((item) => (
              <div
                key={item.ID}
                className="media-selector-card"
                onClick={() => {
                  onSelectMedia(item);
                  onClose();
                }}
              >
                <div className="media-thumb-box">
                  <img src={item.Url} alt={item.Title} />
                  <span className="media-type-chip">{item.Type}</span>
                </div>
                <div className="media-meta-snippet">
                  <strong className="media-snippet-title">{item.Title}</strong>
                  <span className="media-snippet-size">{item.SizeMB} MB</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="media-upload-form">
            <div className="form-field">
              <label className="field-label">Asset Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Product Infographic v2"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="modal-input"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Asset Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="modal-input"
              >
                <option value="image">Image (PNG, JPEG, WebP)</option>
                <option value="video">Video (MP4, QuickTime)</option>
              </select>
            </div>

            <div className="form-field">
              <label className="field-label">Asset URL or File Path</label>
              <input
                type="text"
                placeholder="https://... (Leave blank for sample asset)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="modal-input"
              />
            </div>

            <div className="modal-actions-row">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add & Attach
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
