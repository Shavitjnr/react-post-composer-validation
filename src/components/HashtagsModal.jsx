import React, { useState } from 'react';
import { Hash, X, Plus, Check } from 'lucide-react';
import { campaignService } from '../services/campaignService';

export function HashtagsModal({ isOpen, onClose, onInsertHashtag, showToast }) {
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTags, setNewGroupTags] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const groups = campaignService.getHashtagGroups();

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupTags.trim()) return;

    const tagsArray = newGroupTags
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    campaignService.createHashtagGroup(newGroupName, tagsArray);
    setNewGroupName('');
    setNewGroupTags('');
    setIsCreating(false);
    showToast(`Hashtag group "${newGroupName}" created!`, 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Hash className="w-5 h-5 text-primary" />
            <h3 className="modal-title">Hashtag Vault & Groups</h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="modal-subtitle-text">
          Click any hashtag to insert it into your post composition.
        </p>

        <div className="hashtag-groups-list">
          {groups.map((grp) => (
            <div key={grp.id} className="hashtag-group-card">
              <span className="hashtag-group-title">{grp.name}</span>
              <div className="hashtag-chips-flex">
                {grp.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      onInsertHashtag(tag);
                      showToast(`Inserted ${tag}`, 'info');
                    }}
                    className="hashtag-vault-pill"
                  >
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {isCreating ? (
          <form onSubmit={handleCreateGroup} className="create-hashtag-group-form">
            <input
              type="text"
              placeholder="Group Name (e.g. AI & Robotics)"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="modal-input"
              required
            />
            <input
              type="text"
              placeholder="Hashtags separated by space (e.g. #AI #DeepTech #Robotics)"
              value={newGroupTags}
              onChange={(e) => setNewGroupTags(e.target.value)}
              className="modal-input"
              required
            />
            <div className="modal-actions-row">
              <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Group
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-footer-action-row">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="btn-create-ws-prompt"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Hashtag Group</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
