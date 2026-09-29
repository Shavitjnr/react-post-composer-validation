import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  MousePointer,
  Users,
  Info,
  Calendar,
  Filter
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { PLATFORM_RULES } from '../constants/platformRules';

export function AnalyticsView() {
  const [platformFilter, setPlatformFilter] = useState('All');
  const [dateRange, setDateRange] = useState('30d');

  const metrics = analyticsService.getOverviewMetrics(null, platformFilter, dateRange);

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div className="header-pill">Social Intelligence & Reach</div>
          <h2 className="section-title">Multi-Channel Performance Analytics</h2>
          <p className="section-subtitle">
            Consolidated engagement telemetry across Instagram, Facebook, LinkedIn, X, and YouTube.
          </p>
        </div>

        <div className="section-actions-group">
          {/* Date Range Selector */}
          <div className="view-mode-pill-toggle">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDateRange(range)}
                className={`view-pill-btn ${dateRange === range ? 'active' : ''}`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Analytics Banner */}
      <div className="demo-analytics-notice-card">
        <Info className="w-5 h-5 text-primary flex-shrink-0" />
        <div className="notice-text-col">
          <strong>DEMO ANALYTICS — Simulated Multi-Platform Telemetry</strong>
          <p>
            When live social provider OAuth tokens are configured in production via Supabase backend, real Graph API and v2 metrics flow seamlessly into this dashboard.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Reach</span>
            <div className="kpi-icon-box bg-sky">
              <Users className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{metrics.totalReach.toLocaleString()}</span>
            <span className="kpi-badge text-emerald-600 bg-emerald-50">
              <TrendingUp className="w-3 h-3 inline mr-0.5" />
              {metrics.followerGrowth}
            </span>
          </div>
          <p className="kpi-sub">Unique audience members reached</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Impressions</span>
            <div className="kpi-icon-box bg-indigo">
              <Eye className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{metrics.totalImpressions.toLocaleString()}</span>
            <span className="kpi-badge">+18.5%</span>
          </div>
          <p className="kpi-sub">Total views across feed distributions</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Avg Engagement</span>
            <div className="kpi-icon-box bg-emerald">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{metrics.totalEngagementRate}</span>
            <span className="kpi-badge text-emerald-600 bg-emerald-50">Top 10%</span>
          </div>
          <p className="kpi-sub">Interactions divided by total reach</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Link Clicks</span>
            <div className="kpi-icon-box bg-amber">
              <MousePointer className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{metrics.totalClicks.toLocaleString()}</span>
            <span className="kpi-badge">+24.1%</span>
          </div>
          <p className="kpi-sub">Referral traffic to company websites</p>
        </div>
      </div>

      {/* Engagement Distribution & Channel Share */}
      <div className="analytics-charts-grid">
        {/* Platform Share Breakdown */}
        <div className="chart-card">
          <h3 className="chart-title">Channel Share Breakdown</h3>
          <p className="chart-sub">Proportional audience attention by platform</p>

          <div className="chart-bars-list">
            {metrics.platformBreakdown.map((item) => (
              <div key={item.platform} className="chart-bar-item">
                <div className="bar-labels">
                  <span className="bar-platform-name">{item.platform}</span>
                  <span className="bar-platform-stat">
                    {item.share} ({item.impressions.toLocaleString()} views)
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: item.share,
                      backgroundColor: item.color || '#2563eb',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Interaction Totals */}
        <div className="chart-card">
          <h3 className="chart-title">Direct Interaction Volumes</h3>
          <p className="chart-sub">Aggregated reactions, discussions, and shares</p>

          <div className="status-boxes-row">
            <div className="status-box bg-published">
              <span className="status-box-val">{metrics.totalLikes.toLocaleString()}</span>
              <span className="status-box-lbl">Likes & Reactions</span>
            </div>
            <div className="status-box bg-scheduled">
              <span className="status-box-val">{metrics.totalComments.toLocaleString()}</span>
              <span className="status-box-lbl">Comments</span>
            </div>
            <div className="status-box bg-drafts">
              <span className="status-box-val">{metrics.totalShares.toLocaleString()}</span>
              <span className="status-box-lbl">Reposts & Shares</span>
            </div>
          </div>

          <div className="pass-rate-pill">
            <span>Overall Publication Success Rate</span>
            <strong className="text-emerald">100% (Zero Failed Dispatches)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
