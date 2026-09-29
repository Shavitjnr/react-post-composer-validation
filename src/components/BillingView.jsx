import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { SUBSCRIPTION_PLANS } from '../constants/subscriptionPlans';
import { UpgradeModal } from './UpgradeModal';

export function BillingView({ activeWorkspace, showToast }) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [usage, setUsage] = useState(() => subscriptionService.getUsageMetrics(activeWorkspace?.ID));

  const refreshUsage = () => {
    setUsage(subscriptionService.getUsageMetrics(activeWorkspace?.ID));
  };

  const handleQuickSwitch = (planId) => {
    const res = subscriptionService.upgradePlan(planId);
    refreshUsage();
    showToast(res.message, 'success');
  };

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="header-pill">Subscription & Account Metering</div>
          <h2 className="section-title">Billing & Usage Management</h2>
          <p className="section-subtitle">
            Manage your workspace subscription tier, observe live quota meters, and scale social channels.
          </p>
        </div>

        <div className="section-actions-group">
          <button
            type="button"
            onClick={() => setShowUpgradeModal(true)}
            className="btn-primary"
          >
            <Zap className="w-4 h-4" />
            <span>Upgrade Tier</span>
          </button>
        </div>
      </div>

      {/* Current Active Plan Overview Card */}
      <div className="active-billing-overview-card">
        <div className="billing-top-row">
          <div>
            <span className="current-plan-subtitle">CURRENT TIER</span>
            <h3 className="current-plan-name">{usage.plan.name} Tier</h3>
            <span className="billing-cycle-tag">
              ${usage.plan.price}/month · Renews Oct 29, 2026 (Demo Mode)
            </span>
          </div>

          <div className="payment-method-chip">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Demo Corporate Visa (•••• 4242)</span>
          </div>
        </div>

        {/* Live Usage Resource Bars */}
        <div className="billing-usage-meters-grid">
          {/* Scheduled Posts */}
          <div className="meter-card">
            <div className="meter-header">
              <span>Scheduled Posts Queue</span>
              <strong>{usage.scheduled.used} / {usage.scheduled.limit}</strong>
            </div>
            <div className="meter-track">
              <div
                className={`meter-bar ${usage.scheduled.isNearLimit ? 'warning' : ''}`}
                style={{ width: `${usage.scheduled.percent}%` }}
              />
            </div>
            <span className="meter-foot-note">{usage.scheduled.percent}% utilized</span>
          </div>

          {/* Social Accounts */}
          <div className="meter-card">
            <div className="meter-header">
              <span>Connected Social Channels</span>
              <strong>{usage.accounts.used} / {usage.accounts.limit}</strong>
            </div>
            <div className="meter-track">
              <div
                className={`meter-bar ${usage.accounts.isNearLimit ? 'warning' : ''}`}
                style={{ width: `${usage.accounts.percent}%` }}
              />
            </div>
            <span className="meter-foot-note">{usage.accounts.percent}% utilized</span>
          </div>

          {/* Team Members */}
          <div className="meter-card">
            <div className="meter-header">
              <span>Team Collaborators</span>
              <strong>{usage.team.used} / {usage.team.limit}</strong>
            </div>
            <div className="meter-track">
              <div
                className={`meter-bar ${usage.team.isNearLimit ? 'warning' : ''}`}
                style={{ width: `${usage.team.percent}%` }}
              />
            </div>
            <span className="meter-foot-note">{usage.team.percent}% utilized</span>
          </div>

          {/* Cloud Storage */}
          <div className="meter-card">
            <div className="meter-header">
              <span>Media Cloud Storage</span>
              <strong>{usage.storage.used} MB / {usage.storage.limit} MB</strong>
            </div>
            <div className="meter-track">
              <div
                className={`meter-bar ${usage.storage.isNearLimit ? 'warning' : ''}`}
                style={{ width: `${usage.storage.percent}%` }}
              />
            </div>
            <span className="meter-foot-note">{usage.storage.percent}% capacity</span>
          </div>
        </div>
      </div>

      {/* Plan Comparison Grid */}
      <h3 className="section-title mt-4">Available SaaS Tiers</h3>
      <div className="plans-grid-cards">
        {Object.values(SUBSCRIPTION_PLANS).map((p) => {
          const isCurrent = usage.plan.id === p.id;
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
                  <span>Team Collaborators</span>
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
                onClick={() => handleQuickSwitch(p.id)}
                disabled={isCurrent}
                className={`btn-plan-action ${isCurrent ? 'btn-current-plan' : p.popular ? 'btn-primary' : 'btn-secondary'}`}
              >
                {isCurrent ? 'Current Plan' : `Switch to ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={usage.plan}
        onPlanUpgraded={() => refreshUsage()}
        showToast={showToast}
      />
    </div>
  );
}
