import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export function CharacterCounter({ validation, platformName }) {
  const { charCount, limit, remaining, wordCount, isExceeded, isWarning, excess } = validation;

  const progressPercent = Math.min(100, Math.round((charCount / limit) * 100));

  let progressColor = 'var(--primary-color)';
  if (isExceeded) progressColor = 'var(--danger-color)';
  else if (isWarning) progressColor = 'var(--warning-color)';
  else if (charCount > 0) progressColor = 'var(--success-color)';

  return (
    <div className="counter-container">
      {/* Metrics Row */}
      <div className="counter-metrics-row">
        <div className="counter-meta-stats">
          <span>Words: <strong>{wordCount}</strong></span>
          <span>
            Remaining:{' '}
            <strong className={remaining < 0 ? 'text-danger' : ''}>
              {remaining.toLocaleString()}
            </strong>
          </span>
        </div>

        <div className={`counter-main-count ${isExceeded ? 'text-danger' : isWarning ? 'text-warning' : ''}`}>
          <strong>{charCount.toLocaleString()}</strong> / {limit.toLocaleString()} characters
        </div>
      </div>

      {/* Progress Track */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%`, backgroundColor: progressColor }}
        />
      </div>

      {/* Exceeded Error Box */}
      {isExceeded && (
        <div className="error-alert-box animate-shake">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <div>
            <strong>Character limit exceeded by {excess} character{excess > 1 ? 's' : ''}!</strong>
            <p>Your post contains {charCount} characters, but {platformName} allows up to {limit}.</p>
          </div>
        </div>
      )}

      {/* Warning Alert Box */}
      {isWarning && (
        <div className="warning-alert-box">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <div>
            <strong>Approaching limit:</strong> Only {remaining} character{remaining > 1 ? 's' : ''} remaining for {platformName}.
          </div>
        </div>
      )}
    </div>
  );
}
