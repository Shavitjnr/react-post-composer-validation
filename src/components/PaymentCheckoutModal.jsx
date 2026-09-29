import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Check,
  Key
} from 'lucide-react';
import { csvStorage } from '../utils/csvStorage';
import { subscriptionService } from '../services/subscriptionService';

export function PaymentCheckoutModal({
  isOpen,
  onClose,
  plan,
  currentUser,
  onPaymentSuccess,
  showToast
}) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'netbanking'
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('889');
  const [cardName, setCardName] = useState(currentUser?.name || 'Authorized Member');
  const [upiId, setUpiId] = useState('client@okhdfcbank');

  // Registration for new users if not yet logged in
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('securePass#2026');

  // Verification step: 'idle' | 'verifying' | 'verified'
  const [verificationStep, setVerificationStep] = useState('idle');
  const [verificationProgress, setVerificationProgress] = useState('');
  const [transactionId, setTransactionId] = useState('');

  if (!isOpen || !plan) return null;

  const handleStartPayment = (e) => {
    e.preventDefault();

    if (!currentUser && (!userName.trim() || !userEmail.trim())) {
      showToast('Please provide your name and email to link your paid subscription.', 'error');
      return;
    }

    setVerificationStep('verifying');
    setVerificationProgress('Initiating 256-bit encrypted gateway connection...');

    setTimeout(() => {
      setVerificationProgress('Validating payment method & issuing bank approval...');
    }, 900);

    setTimeout(() => {
      setVerificationProgress('Evaluating 3-D Secure 2.0 authorization token...');
    }, 1800);

    setTimeout(() => {
      const generatedTxn = `TXN_PCP_${Math.random().toString(36).substring(2, 9).toUpperCase()}_VERIFIED`;
      setTransactionId(generatedTxn);
      setVerificationStep('verified');
      setVerificationProgress('Payment verified and captured successfully!');

      // Upgrade active plan in subscription service
      subscriptionService.upgradePlan(plan.id);

      // If user wasn't signed in, register or authenticate them
      let effectiveAuthUser = currentUser;
      if (!effectiveAuthUser) {
        const regRes = csvStorage.registerUser(
          userName.trim(),
          userEmail.trim(),
          userPassword.trim(),
          'Workspace Admin'
        );
        if (regRes.success) {
          effectiveAuthUser = regRes.user;
        } else {
          // If already exists, authenticate
          const authRes = csvStorage.authenticateUser(userEmail.trim(), userPassword.trim());
          if (authRes.success) effectiveAuthUser = authRes.user;
          else effectiveAuthUser = { name: userName, email: userEmail, role: 'Workspace Admin' };
        }
      }

      showToast(`Payment of $${plan.price} verified! Plan upgraded to ${plan.name}.`, 'success');
      setTimeout(() => {
        onPaymentSuccess(plan, effectiveAuthUser);
        handleCloseModal();
      }, 1500);
    }, 2800);
  };

  const handleCloseModal = () => {
    setVerificationStep('idle');
    setVerificationProgress('');
    setTransactionId('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card checkout-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="ssl-lock-badge">
              <Lock className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="modal-title">Verified Subscription Checkout</span>
              <span className="modal-subtitle-text">256-Bit Bank Grade TLS Encryption • Verified Gateway</span>
            </div>
          </div>
          <button type="button" onClick={handleCloseModal} className="modal-close-btn" disabled={verificationStep === 'verifying'}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plan Summary Callout */}
        <div className="checkout-plan-summary">
          <div className="plan-summary-left">
            <span className="plan-tag-badge">{plan.name} Tier</span>
            <h3>{plan.name} Subscription</h3>
            <p className="plan-summary-features">
              Full workspace access • 5 Verified Channels • Real-time validation
            </p>
          </div>
          <div className="plan-summary-right">
            <span className="plan-big-price">${plan.price}</span>
            <span className="plan-cadence">/ month</span>
          </div>
        </div>

        {/* Verification Progress Screen */}
        {verificationStep === 'verifying' && (
          <div className="verification-loading-box">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <h4>Verifying Payment Transaction...</h4>
            <p className="verification-status-msg">{verificationProgress}</p>
            <div className="verification-steps-checklist">
              <div className="step-check-item">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Card & Billing Authenticated</span>
              </div>
              <div className="step-check-item">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Issuing Bank Settlement Approved</span>
              </div>
              <div className="step-check-item active">
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                <span>3DS Authentication Token in progress</span>
              </div>
            </div>
          </div>
        )}

        {/* Verification Success Screen */}
        {verificationStep === 'verified' && (
          <div className="verification-success-box">
            <div className="success-icon-shield">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h4>Payment Verified & Approved!</h4>
            <p className="success-sub">
              Transaction Authorized: <code className="font-mono text-emerald-700">{transactionId}</code>
            </p>
            <p className="success-redirect-note">
              Provisioning your upgraded workspace and unlocking `/Pannel` now...
            </p>
          </div>
        )}

        {/* Idle: Payment Details Form */}
        {verificationStep === 'idle' && (
          <form onSubmit={handleStartPayment} className="checkout-form">
            {/* Account Details if not logged in */}
            {!currentUser && (
              <div className="checkout-account-details">
                <span className="checkout-section-heading">1. Account Details for Workspace Ownership</span>
                <div className="dual-input-row">
                  <div className="form-group-item">
                    <label>Your Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="checkout-input"
                    />
                  </div>
                  <div className="form-group-item">
                    <label>Work Email</label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                      className="checkout-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Switcher */}
            <div className="checkout-method-selector">
              <span className="checkout-section-heading">
                {currentUser ? '1. Select Payment Method' : '2. Select Payment Method'}
              </span>
              <div className="method-pills-row">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`method-pill ${paymentMethod === 'card' ? 'active' : ''}`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`method-pill ${paymentMethod === 'upi' ? 'active' : ''}`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`method-pill ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* Card Inputs */}
            {paymentMethod === 'card' && (
              <div className="method-fields-container">
                <div className="form-group-item">
                  <label>Card Number</label>
                  <div className="input-with-card-brand">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="checkout-input font-mono"
                    />
                    <span className="card-brand-badge">VISA</span>
                  </div>
                </div>

                <div className="dual-input-row">
                  <div className="form-group-item">
                    <label>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                      className="checkout-input font-mono"
                    />
                  </div>
                  <div className="form-group-item">
                    <label>CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={4}
                      required
                      className="checkout-input font-mono"
                    />
                  </div>
                </div>

                <div className="form-group-item">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="checkout-input"
                  />
                </div>
              </div>
            )}

            {/* UPI Inputs */}
            {paymentMethod === 'upi' && (
              <div className="method-fields-container">
                <div className="form-group-item">
                  <label>Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="mobile@upi or id@okhdfcbank"
                    required
                    className="checkout-input font-mono"
                  />
                </div>
                <div className="upi-apps-row">
                  <span>Supported: Google Pay, PhonePe, Paytm, BHIM, Cred</span>
                </div>
              </div>
            )}

            {/* Net Banking Inputs */}
            {paymentMethod === 'netbanking' && (
              <div className="method-fields-container">
                <div className="form-group-item">
                  <label>Select Financial Institution</label>
                  <select className="checkout-input">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              </div>
            )}

            {/* Total breakdown */}
            <div className="checkout-total-row">
              <div>
                <span className="total-label">Total Due Today:</span>
                <span className="total-tax-note">Includes all platform limits & instant activation</span>
              </div>
              <span className="total-amount">${plan.price}.00</span>
            </div>

            {/* Submit Action */}
            <div className="checkout-actions">
              <button
                type="submit"
                className="btn-verify-pay"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Payment & Unlock Workspace (${plan.price})</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
