import React, { useState } from 'react';
import { Tag, X, Plus, Check } from 'lucide-react';
import { campaignService } from '../services/campaignService';

export function TagsModal({ isOpen, onClose, selectedTags = [], onToggleTag, showToast }) {
  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  const availableTags = campaignService.getTags();

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    campaignService.addTag(newTag.trim());
    onToggleTag(newTag.trim());
    setNewTag('');
    showToast(`Tag "${newTag.trim()}" created and assigned!`, 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Tag className="w-5 h-5 text-primary" />
            <h3 className="modal-title">Assign Content Tags</h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="modal-subtitle-text">
          Categorize your post for internal filtering, campaigns, and team analytics.
        </p>

        <div className="tags-chips-selection-box">
          {availableTags.map((tag) => {
            const isAssigned = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                className={`tag-selectable-pill ${isAssigned ? 'selected' : ''}`}
              >
                {isAssigned && <Check className="w-3.5 h-3.5" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleAddTag} className="add-tag-inline-form">
          <input
            type="text"
            placeholder="Add new tag (e.g. Festival Offer)"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="modal-input"
          />
          <button type="submit" className="btn-secondary">
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        <div className="modal-actions-row">
          <button type="button" onClick={onClose} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
