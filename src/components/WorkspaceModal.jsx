import React, { useState } from 'react';
import { Building2, X, Plus, Check, Shield, Layers } from 'lucide-react';
import { workspaceService } from '../services/workspaceService';
import { subscriptionService } from '../services/subscriptionService';

export function WorkspaceModal({
  isOpen,
  onClose,
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  onWorkspaceCreated,
  showToast
}) {
  const [newWsName, setNewWsName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentPlan = subscriptionService.getCurrentPlan();

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!newWsName.trim()) {
      setError('Please provide a valid workspace name.');
      return;
    }

    const res = workspaceService.createWorkspace(newWsName.trim());
    if (!res.success) {
      setError(res.error);
      return;
    }

    setNewWsName('');
    setIsCreating(false);
    showToast(`Workspace "${res.workspace.Name}" created and activated!`, 'success');
    if (onWorkspaceCreated) onWorkspaceCreated(res.workspace);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="modal-title">Workspaces</h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="modal-subtitle-text">
          Select an active workspace or create a dedicated workspace for a client or brand.
        </p>

        {error && <div className="modal-error-banner">{error}</div>}

        {/* Existing Workspaces List */}
        <div className="workspaces-selection-list">
          {workspaces.map((ws) => {
            const isSelected = ws.ID === activeWorkspace?.ID;
            return (
              <button
                key={ws.ID}
                type="button"
                onClick={() => {
                  onSelectWorkspace(ws.ID);
                  onClose();
                }}
                className={`ws-list-card ${isSelected ? 'active-ws-card' : ''}`}
              >
                <div className="ws-card-left">
                  <div className="ws-avatar-sq">
                    {ws.Name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="ws-meta-block">
                    <strong className="ws-name-text">{ws.Name}</strong>
                    <div className="ws-sub-row">
                      <span className="ws-slug-tag">/{ws.Slug}</span>
                      <span className="ws-role-pill">{ws.Role || 'Owner'}</span>
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>

        {/* Create Workspace Section */}
        {isCreating ? (
          <form onSubmit={handleCreateSubmit} className="ws-create-form">
            <label className="field-label">New Workspace Name</label>
            <input
              type="text"
              placeholder="e.g. Acme Studio or Client Beta"
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              className="modal-input"
              autoFocus
            />
            <div className="modal-actions-row">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Create Workspace
              </button>
            </div>
          </form>
        ) : (
          <div className="ws-modal-footer">
            <button
              type="button"
              onClick={() => {
                setError('');
                setIsCreating(true);
              }}
              className="btn-create-ws-prompt"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Workspace</span>
            </button>
            <span className="ws-plan-limit-note">
              {workspaces.length} of {currentPlan.limits.workspaces} workspaces used on {currentPlan.name} plan
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
