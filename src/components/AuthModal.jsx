import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import { csvStorage } from '../utils/csvStorage';

export function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  showToast,
  initialMode = 'login'
}) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('daloutrashavit@gmail.com');
  const [password, setPassword] = useState('shavitdaloutra');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const wantSignUp = initialMode === 'signup';
      setIsSignUp(wantSignUp);
      setError('');
      if (wantSignUp) {
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setEmail('daloutrashavit@gmail.com');
        setPassword('shavitdaloutra');
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      // Registers directly into users.csv!
      const res = csvStorage.registerUser(name.trim(), email.trim(), password, 'Member');
      if (res.success) {
        showToast(`Account created for ${name}! Redirecting to workspace...`, 'success');
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please enter both email and password.');
        return;
      }

      // Authenticates by checking email and password in users.csv!
      const res = csvStorage.authenticateUser(email.trim(), password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid email or password.');
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            {isSignUp ? (
              <UserPlus className="w-5 h-5 text-primary" />
            ) : (
              <Lock className="w-5 h-5 text-primary" />
            )}
            <span className="modal-title">
              {isSignUp ? 'Get Started Free — Create Your Account' : 'Log In to Personal Brand'}
            </span>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" title="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Segmented Switcher: Log In vs Sign Up */}
        <div className="auth-mode-segmented-tabs">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError('');
              if (!email) setEmail('daloutrashavit@gmail.com');
              if (!password) setPassword('shavitdaloutra');
            }}
            className={`auth-segment-tab ${!isSignUp ? 'active' : ''}`}
          >
            <LogIn className="w-4 h-4" />
            <span>Log In (Sign In)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError('');
            }}
            className={`auth-segment-tab ${isSignUp ? 'active' : ''}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up (Register)</span>
          </button>
        </div>

        {/* Demo Fast Log In Shortcuts (Only in Login Mode) */}
        {!isSignUp && (
          <div className="demo-accounts-box">
            <span className="demo-label">Quick Demo 1-Click Access:</span>
            <div className="demo-pills">
              <button
                type="button"
                onClick={() => handleFillDemo('daloutrashavit@gmail.com', 'shavitdaloutra')}
                className={`demo-pill ${email === 'daloutrashavit@gmail.com' ? 'active-pill' : ''}`}
              >
                👑 Super Admin (daloutrashavit@gmail.com)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('sarah@tech.org', 'sarahSecure#2026')}
                className={`demo-pill ${email === 'sarah@tech.org' ? 'active-pill' : ''}`}
              >
                👤 Normal User (sarah@tech.org)
              </button>
            </div>
          </div>
        )}

        {isSignUp && (
          <div className="signup-benefit-banner">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Create a free account to unlock your personal workspace panel, multi-channel post composer, and calendar scheduling.</span>
          </div>
        )}

        {error && <div className="modal-error-banner">{error}</div>}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <div className="form-field">
              <label className="field-label">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="modal-input"
                  autoFocus
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
            <label className="field-label">
              Password {isSignUp ? '(Min 6 characters)' : ''}
            </label>
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
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Safe offline storage synced with <code>data/users.csv</code></span>
          </p>

          <button type="submit" className="btn-modal-submit">
            <span>
              {isSignUp ? 'Create Free Account & Go to Panel' : 'Log In & Open Panel'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Bottom Switcher */}
        <div className="modal-toggle-row">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                }}
                className="link-toggle"
              >
                Log In here
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                }}
                className="link-toggle"
              >
                Sign Up for free
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
