import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Database } from 'lucide-react';
import { csvStorage } from '../utils/csvStorage';

export function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('shavitdaloutra28@gmail.com');
  const [password, setPassword] = useState('shavitdaloutra');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      // Registers directly into users.csv!
      const res = csvStorage.registerUser(name.trim(), email.trim(), password);
      if (res.success) {
        showToast(`User ${name} registered & saved to users.csv!`, 'success');
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error);
      }
    } else {
      // Authenticates by checking email and password in users.csv!
      const res = csvStorage.authenticateUser(email.trim(), password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error);
      }
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSignUp(false);
    setError('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card auth-modal">
        <div className="modal-header">
          <div className="modal-title-row">
            <Lock className="w-4 h-4 text-primary" />
            <span className="modal-title">
              {isSignUp ? 'Get Started — Create Account' : 'Sign In to Post Composer Pro'}
            </span>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo Credentials */}
        <div className="demo-accounts-box">
          <span className="demo-label">Quick Demo Access:</span>
          <div className="demo-pills">
            <button
              type="button"
              onClick={() => handleFillDemo('daloutrashavit@gmail.com', 'shavitdaloutra')}
              className="demo-pill"
            >
              daloutrashavit@gmail.com (Super Admin)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('sarah@tech.org', 'sarahSecure#2026')}
              className="demo-pill"
            >
              sarah@tech.org (Collaborator)
            </button>
          </div>
        </div>

        {error && <div className="modal-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <div className="form-field">
              <label className="field-label">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="modal-input"
                />
              </div>
            </div>
          )}

          <div className="form-field">
            <label className="field-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="modal-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Password (Stored in CSV)</label>
            <div className="input-with-icon">
              <Lock className="input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="modal-input"
              />
            </div>
          </div>

          <p className="csv-storage-note">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Credentials & passwords are automatically synced to <code>data/users.csv</code></span>
          </p>

          <button type="submit" className="btn-modal-submit">
            {isSignUp ? 'Save User to CSV & Login' : 'Authenticate & Sign In'}
          </button>
        </form>

        <div className="modal-toggle-row">
          {isSignUp ? (
            <span>
              Already registered in CSV?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                }}
                className="link-toggle"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                }}
                className="link-toggle"
              >
                Create Account in CSV
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
