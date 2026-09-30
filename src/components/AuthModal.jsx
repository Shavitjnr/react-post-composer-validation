import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import { csvStorage } from '../utils/csvStorage';
import { ClerkAuthEmbed } from './ClerkAuthControls';

export function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  showToast,
  initialMode = 'login',
  hasClerkConfigured = false
}) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const wantSignUp = initialMode === 'signup';
      setIsSignUp(wantSignUp);
      setError('');
      setName('');
      setEmail('');
      setPassword('');
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

      // Registers into users database
      const res = csvStorage.registerUser(name.trim(), email.trim(), password, 'Member');
      if (res.success) {
        showToast(`Account created for ${name}! Opening workspace...`, 'success');
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

      // Authenticates with database
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

        {isSignUp && (
          <div className="signup-benefit-banner">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Create your account to unlock your personal workspace panel, multi-channel post composer, and campaign scheduling.</span>
          </div>
        )}

        {error && <div className="modal-error-banner">{error}</div>}

        {/* If Clerk is configured, show Clerk authentication embed */}
        {hasClerkConfigured ? (
          <div className="clerk-auth-container-shell">
            <ClerkAuthEmbed isSignUp={isSignUp} />
          </div>
        ) : (
          /* Standard Clean Fallback Form (Zero exposed credentials) */
          <>
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
                <span>Secure account authentication enabled</span>
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
          </>
        )}
      </div>
    </div>
  );
}
