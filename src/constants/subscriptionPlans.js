/**
 * Post Composer Pro — Subscription Tier Configuration & Usage Enforcers
 */

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    tagline: 'Basic social composer for individual creators',
    price: 0,
    interval: 'month',
    limits: {
      workspaces: 1,
      socialAccounts: 2,
      scheduledPosts: 10,
      teamMembers: 1,
      storageMB: 50,
      analyticsHistoryDays: 7,
      campaigns: 1,
    },
    features: [
      '1 Workspace',
      '2 Social Accounts (Meta, LinkedIn, X, YT)',
      '10 Scheduled Posts',
      'Basic Character Validation',
      'Standard CSV Export',
      'Basic 7-day Analytics',
    ],
    badgeColor: '#64748b',
  },
  STARTER: {
    id: 'starter',
    name: 'Starter',
    tagline: 'Essential toolkit for growing personal brands',
    price: 19,
    interval: 'month',
    limits: {
      workspaces: 2,
      socialAccounts: 5,
      scheduledPosts: 50,
      teamMembers: 3,
      storageMB: 500,
      analyticsHistoryDays: 30,
      campaigns: 5,
    },
    features: [
      '2 Workspaces',
      '5 Connected Social Accounts',
      '50 Scheduled Posts Queue',
      '3 Team Collaborators',
      'Media Library (500 MB)',
      '30-day Performance Analytics',
    ],
    badgeColor: '#0284c7',
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    tagline: 'High-velocity publishing for agencies & marketing teams',
    price: 49,
    interval: 'month',
    popular: true,
    limits: {
      workspaces: 5,
      socialAccounts: 15,
      scheduledPosts: 250,
      teamMembers: 10,
      storageMB: 5000,
      analyticsHistoryDays: 90,
      campaigns: 20,
    },
    features: [
      '5 Isolated Workspaces',
      '15 Connected Social Accounts',
      '250 Scheduled Posts in Queue',
      '10 Team Members with Roles',
      'Editorial Approval Workflow',
      'Campaign Tracking & Tagging',
      '90-day Advanced Analytics',
    ],
    badgeColor: '#2563eb',
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    tagline: 'Enterprise governance, unlimited scale & custom security',
    price: 149,
    interval: 'month',
    limits: {
      workspaces: 25,
      socialAccounts: 50,
      scheduledPosts: 1000,
      teamMembers: 50,
      storageMB: 50000,
      analyticsHistoryDays: 365,
      campaigns: 100,
    },
    features: [
      '25 Dedicated Workspaces',
      '50 Social Channel Connections',
      '1,000 Scheduled Queue Capacity',
      'Unlimited Team Members',
      'Full Audit Logging & Compliance',
      'Custom Role Permissions',
      'Priority Support & API Access',
    ],
    badgeColor: '#7c3aed',
  },
};

export const DEFAULT_PLAN = 'PROFESSIONAL';

export function getPlan(planId) {
  const key = (planId || 'professional').toUpperCase();
  return SUBSCRIPTION_PLANS[key] || SUBSCRIPTION_PLANS.PROFESSIONAL;
}
