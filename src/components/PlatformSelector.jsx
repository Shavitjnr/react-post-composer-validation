import React from 'react';
import { PLATFORMS } from '../utils/validation';

export function PlatformSelector({ selectedPlatform, onSelectPlatform }) {
  const platformKeys = Object.keys(PLATFORMS);

  return (
    <div className="platform-selection-group">
      <div className="section-label-row">
        <label className="section-label">Target Platform</label>
        <span className="section-hint">Validation limit adjusts dynamically</span>
      </div>

      <div className="platform-buttons-grid">
        {platformKeys.map((key) => {
          const cfg = PLATFORMS[key];
          const isSelected = selectedPlatform === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectPlatform(key)}
              className={`platform-card-btn ${isSelected ? 'selected' : ''}`}
            >
              <div className="platform-btn-header">
                <span
                  className="platform-badge"
                  style={{ backgroundColor: cfg.color }}
                >
                  {cfg.badge}
                </span>
                <span className="platform-limit-tag">
                  {cfg.limit.toLocaleString()}
                </span>
              </div>
              <div className="platform-btn-info">
                <span className="platform-name">{cfg.name}</span>
                <span className="platform-limit-text">Max {cfg.limit} chars</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
