/**
 * Post Composer Pro — Subscription & Usage Metering Service
 * Enforces strict plan-level resource caps across all workspace actions.
 */
import { SUBSCRIPTION_PLANS, getPlan } from '../constants/subscriptionPlans';
import { workspaceService } from './workspaceService';
import { postService } from './postService';
import { socialService } from './socialService';
import { teamService } from './teamService';
import { mediaService } from './mediaService';
import { csvRepository } from '../repositories/csvRepository';
import { notificationService } from './notificationService';

export const subscriptionService = {
  getCurrentPlan: () => {
    const activeWs = workspaceService.getActiveWorkspace();
    return getPlan(activeWs.Plan);
  },

  getUsageMetrics: (workspaceId = null) => {
    const wsId = workspaceId || workspaceService.getActiveWorkspaceId();
    const plan = subscriptionService.getCurrentPlan();

    const scheduledCount = postService.getScheduledPosts(wsId).length;
    const accountsCount = socialService.getConnectedAccounts(wsId).length;
    const teamCount = teamService.getTeamMembers(wsId).length;
    const storageUsedMB = mediaService.getTotalStorageUsedMB(wsId);

    const scheduledPercent = Math.min(100, Math.round((scheduledCount / plan.limits.scheduledPosts) * 100));
    const accountsPercent = Math.min(100, Math.round((accountsCount / plan.limits.socialAccounts) * 100));
    const teamPercent = Math.min(100, Math.round((teamCount / plan.limits.teamMembers) * 100));
    const storagePercent = Math.min(100, Math.round((storageUsedMB / plan.limits.storageMB) * 100));

    // Overall aggregate usage percentage for sidebar badge
    const overallUsage = Math.round(
      (scheduledPercent + accountsPercent + teamPercent + storagePercent) / 4
    );

    return {
      plan,
      overallUsage,
      scheduled: {
        used: scheduledCount,
        limit: plan.limits.scheduledPosts,
        percent: scheduledPercent,
        isNearLimit: scheduledPercent >= 80,
      },
      accounts: {
        used: accountsCount,
        limit: plan.limits.socialAccounts,
        percent: accountsPercent,
        isNearLimit: accountsPercent >= 80,
      },
      team: {
        used: teamCount,
        limit: plan.limits.teamMembers,
        percent: teamPercent,
        isNearLimit: teamPercent >= 80,
      },
      storage: {
        used: storageUsedMB.toFixed(1),
        limit: plan.limits.storageMB,
        percent: storagePercent,
        isNearLimit: storagePercent >= 80,
      },
    };
  },

  upgradePlan: (newPlanId) => {
    const activeWs = workspaceService.getActiveWorkspace();
    const targetPlan = getPlan(newPlanId);

    activeWs.Plan = targetPlan.id.toUpperCase();
    const allWorkspaces = workspaceService.getAllWorkspaces();
    const idx = allWorkspaces.findIndex((w) => w.ID === activeWs.ID);
    if (idx !== -1) {
      allWorkspaces[idx].Plan = activeWs.Plan;
      localStorage.setItem('csv_workspaces_database', allWorkspaces.map((w) =>
        `"${w.ID}","${w.Name}","${w.Slug}","${w.Role}","${w.Plan}","${w.CreatedAt}"`
      ).join('\r\n'));
    }

    csvRepository.logAction(activeWs.ID, 'shavitdaloutra28@gmail.com', 'UPGRADE_PLAN', activeWs.ID, `Switched workspace plan to ${targetPlan.name}`);
    notificationService.notify(
      activeWs.ID,
      'Subscription Updated',
      `Workspace plan switched to ${targetPlan.name}. Limits refreshed.`,
      'success'
    );

    return {
      success: true,
      plan: targetPlan,
      message: `Upgraded to ${targetPlan.name} plan successfully (Demo Mode simulated billing).`,
    };
  },
};
