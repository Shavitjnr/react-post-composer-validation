import React from 'react';
import { CreditCard, X, Check, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../constants/subscriptionPlans';
import { subscriptionService } from '../services/subscriptionService';

export function UpgradeModal({ isOpen, onClose, currentPlan, onPlanUpgraded, showToast }) {
  if (!isOpen) return null;

  const handleSelectPlan = (planId) => {
    const res = subscriptionService.upgradePlan(planId);
    showToast(res.message, 'success');
    if (onPlanUpgraded) onPlanUpgraded(res.plan);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-extra-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="modal-title">Upgrade Workspace Subscription Plan</h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="modal-subtitle-text">
          Zero-budget MVP demo: Select any tier to simulate instant plan upgrades, refreshed queue limits, and expanded team capacity.
        </p>

        <div className="plans-grid-cards">
          {Object.values(SUBSCRIPTION_PLANS).map((p) => {
            const isCurrent = currentPlan?.id === p.id;
            return (
              <div
                key={p.id}
                className={`plan-pricing-box ${p.popular ? 'popular' : ''} ${isCurrent ? 'current-active-plan' : ''}`}
              >
                {p.popular && <span className="popular-badge-pill">Most Popular</span>}
                <div className="plan-box-header">
                  <h4 className="plan-name-headline">{p.name}</h4>
                  <p className="plan-tagline-text">{p.tagline}</p>
                  <div className="plan-price-row">
                    <span className="price-currency">$</span>
                    <span className="price-number">{p.price}</span>
                    <span className="price-cycle">/month</span>
                  </div>
                </div>

                <div className="plan-limits-summary">
                  <div className="limit-row">
                    <span>Workspaces</span>
                    <strong>{p.limits.workspaces}</strong>
                  </div>
                  <div className="limit-row">
                    <span>Social Channels</span>
                    <strong>{p.limits.socialAccounts}</strong>
                  </div>
                  <div className="limit-row">
                    <span>Scheduled Queue</span>
                    <strong>{p.limits.scheduledPosts}</strong>
                  </div>
                  <div className="limit-row">
                    <span>Team Members</span>
                    <strong>{p.limits.teamMembers}</strong>
                  </div>
                </div>

                <ul className="plan-features-list">
                  {p.features.map((feat, idx) => (
                    <li key={idx}>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleSelectPlan(p.id)}
                  disabled={isCurrent}
                  className={`btn-plan-action ${isCurrent ? 'btn-current-plan' : p.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {isCurrent ? 'Current Plan' : `Switch to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
