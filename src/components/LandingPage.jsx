import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Image,
  BarChart3,
  Users,
  CheckCircle2,
  Lock,
  Globe,
  Send,
  Zap,
  Check,
  ChevronRight,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { PLATFORM_RULES } from '../constants/platformRules';

export function LandingPage({ onGetStartedFree, onOpenAuth, onSelectPaidPlan }) {
  const [demoPlatform, setDemoPlatform] = useState('twitter');
  const [demoText, setDemoText] = useState('Crafting our enterprise multi-channel campaign with Post Composer Pro! Character limits are strictly verified in real-time across all 5 channels.');

  const currentLimit = PLATFORM_RULES[demoPlatform]?.limit || 280;
  const currentCount = Array.from(demoText).length;
  const remaining = currentLimit - currentCount;
  const isOverLimit = remaining < 0;

  return (
    <div className="landing-page-root">
      {/* 1. Header Navigation */}
      <header className="landing-navbar">
        <div className="landing-nav-container">
          <div className="landing-brand-col">
            <div className="landing-logo-badge">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="landing-brand-name">POST COMPOSER PRO</span>
              <span className="landing-brand-sub">Social Media SaaS</span>
            </div>
          </div>

          <nav className="landing-nav-links">
            <a href="#features" className="nav-anchor">Features</a>
            <a href="#platforms" className="nav-anchor">5 Channels</a>
            <a href="#demo" className="nav-anchor">Live Composer</a>
            <a href="#pricing" className="nav-anchor">Pricing</a>
          </nav>

          <div className="landing-nav-actions">
            <button
              type="button"
              onClick={onOpenAuth}
              className="btn-landing-login"
            >
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={onGetStartedFree}
              className="btn-landing-primary"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-content-shell">
          <div className="hero-tag-pill">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Next-Gen Social Media Management SaaS</span>
          </div>

          <h1 className="hero-headline">
            One workspace. Every social channel. <br />
            <span className="text-gradient-purple">Complete content control.</span>
          </h1>

          <p className="hero-lead-text">
            The unified social media CMS & scheduling suite for modern teams, creators, and agencies.
            Schedule, validate, collaborate, and publish to <strong>Instagram, Facebook, LinkedIn, X, and YouTube</strong> with zero friction.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              onClick={onGetStartedFree}
              className="btn-hero-launch"
            >
              <Zap className="w-5 h-5" />
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#demo"
              className="btn-hero-secondary"
            >
              <span>Try Live Composer</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="hero-guarantees-row">
            <div className="guarantee-item">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>5 Verified Social Channels</span>
            </div>
            <div className="guarantee-item">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Multi-Tenant Workspaces</span>
            </div>
            <div className="guarantee-item">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>₹0 Free Infrastructure Demo</span>
            </div>
            <div className="guarantee-item">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero TikTok Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Five Supported Channels Grid */}
      <section id="platforms" className="landing-platforms-section">
        <div className="section-header-box">
          <span className="section-eyebrow">CHANNELS</span>
          <h2 className="section-title">Strict Compliance with the Top 5 Networks</h2>
          <p className="section-subtitle">
            Every platform enforces native character limits, validation rules, and live sticky mockups.
          </p>
        </div>

        <div className="platforms-cards-grid">
          <div className="platform-summary-card">
            <div className="platform-icon-pill x-bg">𝕏</div>
            <h3>X / Twitter</h3>
            <p className="limit-highlight">280 Characters</p>
            <p className="platform-desc">Precision microblogging validation with real-time countdown and thread preparation.</p>
          </div>

          <div className="platform-summary-card">
            <div className="platform-icon-pill in-bg">in</div>
            <h3>LinkedIn</h3>
            <p className="limit-highlight">3,000 Characters</p>
            <p className="platform-desc">Thought leadership, multi-line paragraph formatting, and company page posting.</p>
          </div>

          <div className="platform-summary-card">
            <div className="platform-icon-pill ig-bg">IG</div>
            <h3>Instagram</h3>
            <p className="limit-highlight">2,200 Characters</p>
            <p className="platform-desc">Media-first validation, hashtag vaults, and authentic feed aspect ratio previews.</p>
          </div>

          <div className="platform-summary-card">
            <div className="platform-icon-pill fb-bg">f</div>
            <h3>Facebook</h3>
            <p className="limit-highlight">5,000 Characters</p>
            <p className="platform-desc">Community engagement, rich link metadata preview, and long-form page posts.</p>
          </div>

          <div className="platform-summary-card">
            <div className="platform-icon-pill yt-bg">YT</div>
            <h3>YouTube</h3>
            <p className="limit-highlight">5,000 Characters</p>
            <p className="platform-desc">Video title & description composition, tag categorization, and premiere timing.</p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Live Composer Teaser */}
      <section id="demo" className="landing-interactive-section">
        <div className="interactive-shell-box">
          <div className="interactive-left">
            <span className="section-eyebrow">TRY IT LIVE</span>
            <h2 className="section-title">Experience the Real-Time Controlled Composer</h2>
            <p className="section-subtitle">
              Test character counting and validation instantly. Switch between platforms to watch limits adjust dynamically.
            </p>

            <div className="interactive-pill-buttons">
              {['twitter', 'linkedin', 'instagram', 'facebook', 'youtube'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDemoPlatform(p)}
                  className={`demo-channel-pill ${demoPlatform === p ? 'active' : ''}`}
                >
                  {PLATFORM_RULES[p]?.name}
                </button>
              ))}
            </div>

            <div className="interactive-editor-card">
              <textarea
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
                rows={4}
                className="interactive-textarea"
                placeholder="Type anything to test character limits..."
              />

              <div className="interactive-footer-bar">
                <div className="char-badge-group">
                  <span className={`char-metric ${isOverLimit ? 'limit-exceeded' : ''}`}>
                    {currentCount} / {currentLimit} chars
                  </span>
                  <span className="words-metric">
                    {demoText.trim() ? demoText.trim().split(/\s+/).length : 0} words
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onGetStartedFree}
                  className="btn-interactive-open"
                >
                  <span>Get Started Free to Post</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="interactive-right">
            <div className="mockup-preview-window">
              <div className="mockup-header-bar">
                <div className="window-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="window-title">Live {PLATFORM_RULES[demoPlatform]?.name} Preview</span>
              </div>
              <div className="mockup-body-area">
                <div className="mockup-user-row">
                  <div className="mockup-avatar">SD</div>
                  <div>
                    <strong>Shavit Daloutra</strong>
                    <span className="mockup-handle">@shavitdaloutra</span>
                  </div>
                </div>
                <p className="mockup-text-preview">{demoText || 'Live preview text...'}</p>
                <div className="mockup-actions-row">
                  <span>💬 Reply</span>
                  <span>🔁 Repost</span>
                  <span>❤️ Like</span>
                  <span>📊 Reach</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core SaaS Feature Grid */}
      <section id="features" className="landing-features-section">
        <div className="section-header-box">
          <span className="section-eyebrow">CAPABILITIES</span>
          <h2 className="section-title">Built for Real Teams & Modern Creators</h2>
          <p className="section-subtitle">
            From editorial review pipelines to granular multi-tenant workspaces, Post Composer Pro covers the entire content lifecycle.
          </p>
        </div>

        <div className="features-grid-3">
          <div className="feature-card">
            <div className="feature-icon-circle">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <h4>Multi-Tenant Workspaces</h4>
            <p>Isolate posts, drafts, media, and analytics across brands (`Hostego`, `Personal Brand`, `Client Acuity`) with instant switching.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h4>Visual Content Calendar</h4>
            <p>Schedule posts into the future with date/time validation. View by Month or Agenda List with instant rescheduling.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h4>Editorial Approval Workflows</h4>
            <p>Submit drafts for review. Managers can Approve, Request Changes with inline notes, or schedule for publishing.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <Image className="w-5 h-5 text-primary" />
            </div>
            <h4>Centralized Media Library</h4>
            <p>Upload images and video assets with real-time storage quota tracking and direct one-click attachment into posts.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <h4>Telemetry & Analytics</h4>
            <p>Track impressions, engagement rates, reach, clicks, and follower growth filtered by timeframe and individual channels.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h4>RBAC Team Management</h4>
            <p>Grant granular roles: Super Admin, Owner, Admin, Manager, Editor, Creator, and Viewer with live activity logging.</p>
          </div>
        </div>
      </section>

      {/* 6. SaaS Pricing Plans */}
      <section id="pricing" className="landing-pricing-section">
        <div className="section-header-box">
          <span className="section-eyebrow">PRICING</span>
          <h2 className="section-title">Transparent Plans Built to Scale</h2>
          <p className="section-subtitle">
            Start at ₹0 initial infrastructure cost with full demo capabilities, or upgrade to high-volume commercial tiers.
          </p>
        </div>

        <div className="pricing-grid-4">
          {/* FREE */}
          <div className="pricing-plan-card">
            <span className="plan-name">Free</span>
            <div className="plan-price-row">
              <span className="price-num">₹0</span>
              <span className="price-cadence">/ month</span>
            </div>
            <p className="plan-desc">For individual creators and evaluating the product.</p>
            <ul className="plan-perks-list">
              <li><Check className="w-4 h-4 text-emerald-600" /> 1 Workspace</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 2 Social Accounts</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 10 Scheduled Posts</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 50 MB Storage</li>
            </ul>
            <button
              type="button"
              onClick={onGetStartedFree}
              className="btn-plan-select"
            >
              Get Started Free
            </button>
          </div>

          {/* STARTER */}
          <div className="pricing-plan-card">
            <span className="plan-name">Starter</span>
            <div className="plan-price-row">
              <span className="price-num">$29</span>
              <span className="price-cadence">/ month</span>
            </div>
            <p className="plan-desc">For growing creators & small businesses.</p>
            <ul className="plan-perks-list">
              <li><Check className="w-4 h-4 text-emerald-600" /> 3 Workspaces</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 5 Social Accounts</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 50 Scheduled Posts</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 250 MB Storage</li>
            </ul>
            <button
              type="button"
              onClick={() => onSelectPaidPlan({ id: 'starter', name: 'Starter', price: 29 })}
              className="btn-plan-select"
            >
              Verify & Subscribe Starter ($29/mo)
            </button>
          </div>

          {/* PROFESSIONAL (Featured) */}
          <div className="pricing-plan-card featured">
            <span className="popular-badge">MOST POPULAR</span>
            <span className="plan-name">Professional</span>
            <div className="plan-price-row">
              <span className="price-num">$79</span>
              <span className="price-cadence">/ month</span>
            </div>
            <p className="plan-desc">For digital marketing agencies & growth teams.</p>
            <ul className="plan-perks-list">
              <li><Check className="w-4 h-4 text-emerald-600" /> 10 Workspaces</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 15 Social Accounts</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 300 Scheduled Posts</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 1 GB Cloud Storage</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> Approval Workflows</li>
            </ul>
            <button
              type="button"
              onClick={() => onSelectPaidPlan({ id: 'pro', name: 'Professional', price: 79 })}
              className="btn-plan-select highlight"
            >
              Verify & Subscribe Pro ($79/mo)
            </button>
          </div>

          {/* BUSINESS */}
          <div className="pricing-plan-card">
            <span className="plan-name">Business</span>
            <div className="plan-price-row">
              <span className="price-num">$199</span>
              <span className="price-cadence">/ month</span>
            </div>
            <p className="plan-desc">For large brands & enterprise agencies.</p>
            <ul className="plan-perks-list">
              <li><Check className="w-4 h-4 text-emerald-600" /> Unlimited Workspaces</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 50 Social Accounts</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> Unlimited Posts</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> 10 GB Storage</li>
              <li><Check className="w-4 h-4 text-emerald-600" /> Priority Support</li>
            </ul>
            <button
              type="button"
              onClick={() => onSelectPaidPlan({ id: 'business', name: 'Business', price: 199 })}
              className="btn-plan-select"
            >
              Verify & Subscribe Business ($199/mo)
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-col-main">
            <div className="landing-brand-col">
              <div className="landing-logo-badge">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="landing-brand-name">POST COMPOSER PRO</span>
            </div>
            <p className="footer-tagline">
              One workspace. Every social channel. Complete content control.
            </p>
            <span className="copyright-caption">
              © {new Date().getFullYear()} Post Composer Pro SaaS. Enterprise Social Media Suite.
            </span>
          </div>

          <div className="footer-col-links">
            <span className="footer-links-title">Quick Portals</span>
            <button type="button" onClick={onGetStartedFree} className="footer-link-btn">
              Get Started Free
            </button>
            <button type="button" onClick={onOpenAuth} className="footer-link-btn">
              Account Login / Register
            </button>
          </div>

          <div className="footer-col-links">
            <span className="footer-links-title">Supported Networks</span>
            <span>Instagram (2,200 limit)</span>
            <span>Facebook (5,000 limit)</span>
            <span>LinkedIn (3,000 limit)</span>
            <span>X / Twitter (280 limit)</span>
            <span>YouTube (5,000 limit)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
