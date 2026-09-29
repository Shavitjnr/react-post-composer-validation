import React from 'react';
import { PLATFORM_RULES } from '../constants/platformRules';

export function PlatformSelector({ selectedPlatform, onSelectPlatform }) {
  const platformKeys = Object.keys(PLATFORM_RULES);

  return (
    <div className="platform-selection-group">
      <div className="section-label-row">
        <label className="section-label">Target Platform Channel</label>
        <span className="section-hint">Rules strictly enforced per social network</span>
      </div>

      <div className="platform-buttons-grid grid-5-cols">
        {platformKeys.map((key) => {
          const cfg = PLATFORM_RULES[key];
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
                  {cfg.characterLimit.toLocaleString()}
                </span>
              </div>
              <div className="platform-btn-info">
                <span className="platform-name">{cfg.name}</span>
                <span className="platform-limit-text">Max {cfg.characterLimit} chars</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
