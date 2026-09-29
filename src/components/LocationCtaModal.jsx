import React, { useState } from 'react';
import { MapPin, Link as LinkIcon, X } from 'lucide-react';

export function LocationCtaModal({ isOpen, onClose, mode, onApply, showToast }) {
  const [val, setVal] = useState('');
  const [ctaType, setCtaType] = useState('Learn More');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!val.trim()) return;

    if (mode === 'location') {
      onApply(`📍 ${val.trim()}`);
      showToast(`Location "${val.trim()}" appended`, 'info');
    } else {
      onApply(`\n\n👉 [${ctaType}]: ${val.trim()}`);
      showToast(`Call-to-Action added`, 'info');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            {mode === 'location' ? (
              <MapPin className="w-5 h-5 text-primary" />
            ) : (
              <LinkIcon className="w-5 h-5 text-primary" />
            )}
            <h3 className="modal-title">
              {mode === 'location' ? 'Add Location Tag' : 'Add Call-To-Action (CTA)'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'cta' && (
            <div className="form-field">
              <label className="field-label">Action Label</label>
              <select
                value={ctaType}
                onChange={(e) => setCtaType(e.target.value)}
                className="modal-input"
              >
                <option value="Learn More">Learn More</option>
                <option value="Sign Up Now">Sign Up Now</option>
                <option value="Read Documentation">Read Documentation</option>
                <option value="Book a Demo">Book a Demo</option>
                <option value="Download Free Guide">Download Free Guide</option>
                <option value="Visit Website">Visit Website</option>
              </select>
            </div>
          )}

          <div className="form-field">
            <label className="field-label">
              {mode === 'location' ? 'City, Venue or Country' : 'Destination URL'}
            </label>
            <input
              type="text"
              required
              placeholder={mode === 'location' ? 'e.g. San Francisco, CA' : 'https://personalbrand.io/product'}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="modal-input"
              autoFocus
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Insert into Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
