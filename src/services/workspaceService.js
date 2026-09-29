/**
 * Post Composer Pro — Workspace Service
 * Manages multi-workspace isolation, active workspace switching, and plan limit enforcement.
 */
import { csvRepository } from '../repositories/csvRepository';
import { SUBSCRIPTION_PLANS } from '../constants/subscriptionPlans';

const ACTIVE_WS_KEY = 'pcp_active_workspace_id';

export const workspaceService = {
  getActiveWorkspaceId: () => {
    return localStorage.getItem(ACTIVE_WS_KEY) || 'ws_1';
  },

  setActiveWorkspaceId: (id) => {
    localStorage.setItem(ACTIVE_WS_KEY, id);
    return id;
  },

  getAllWorkspaces: () => {
    return csvRepository.getWorkspaces();
  },

  getActiveWorkspace: () => {
    const activeId = workspaceService.getActiveWorkspaceId();
    const workspaces = workspaceService.getAllWorkspaces();
    const found = workspaces.find((w) => w.ID === activeId);
    return found || workspaces[0] || {
      ID: 'ws_1',
      Name: 'Personal Brand',
      Slug: 'personal-brand',
      Role: 'Owner',
      Plan: 'PROFESSIONAL',
    };
  },

  createWorkspace: (name) => {
    const workspaces = workspaceService.getAllWorkspaces();
    const activeWs = workspaceService.getActiveWorkspace();
    const planConfig = SUBSCRIPTION_PLANS[activeWs.Plan?.toUpperCase()] || SUBSCRIPTION_PLANS.PROFESSIONAL;

    if (workspaces.length >= planConfig.limits.workspaces) {
      return {
        success: false,
        error: `Plan limit reached: Current ${planConfig.name} plan permits max ${planConfig.limits.workspaces} workspace(s). Upgrade to create more.`,
      };
    }

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newWs = {
      ID: `ws_${Date.now()}`,
      Name: name.trim(),
      Slug: slug,
      Role: 'Owner',
      Plan: activeWs.Plan || 'PROFESSIONAL',
      CreatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    csvRepository.saveWorkspace(newWs);
    workspaceService.setActiveWorkspaceId(newWs.ID);
    return { success: true, workspace: newWs };
  },
};
