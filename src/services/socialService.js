/**
 * Post Composer Pro — Social Channel Connection Service
 * Manages provider connections for Meta (Instagram & Facebook), LinkedIn, X, and YouTube.
 * Enforces subscription plan limits and guarantees zero secret/token leakage.
 */
import { csvRepository } from '../repositories/csvRepository';
import { workspaceService } from './workspaceService';
import { SUBSCRIPTION_PLANS } from '../constants/subscriptionPlans';
import { MetaProvider } from '../providers/MetaProvider';
import { LinkedInProvider } from '../providers/LinkedInProvider';
import { XProvider } from '../providers/XProvider';
import { YouTubeProvider } from '../providers/YouTubeProvider';
import { notificationService } from './notificationService';

export const socialService = {
  // Returns connected accounts for the active workspace
  getConnectedAccounts: (workspaceId = null) => {
    const wsId = workspaceId || workspaceService.getActiveWorkspaceId();
    return csvRepository.getSocialAccounts(wsId);
  },

  // Connects a new social channel (supports simulated Demo Mode)
  connectAccount: async (platform) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const activeWs = workspaceService.getActiveWorkspace();
    const planConfig = SUBSCRIPTION_PLANS[activeWs.Plan?.toUpperCase()] || SUBSCRIPTION_PLANS.PROFESSIONAL;

    const currentAccounts = socialService.getConnectedAccounts(wsId);
    if (currentAccounts.length >= planConfig.limits.socialAccounts) {
      return {
        success: false,
        error: `Plan account limit reached: Your ${planConfig.name} plan permits max ${planConfig.limits.socialAccounts} connected accounts. Upgrade plan to connect more channels.`,
      };
    }

    let provider;
    if (platform === 'Instagram' || platform === 'Facebook') {
      provider = new MetaProvider(platform);
    } else if (platform === 'LinkedIn') {
      provider = new LinkedInProvider();
    } else if (platform === 'Twitter') {
      provider = new XProvider();
    } else if (platform === 'YouTube') {
      provider = new YouTubeProvider();
    } else {
      return { success: false, error: `Unsupported platform: ${platform}` };
    }

    const connectResult = await provider.connect();
    if (!connectResult.success) return connectResult;

    const accountRecord = {
      ID: `acc_${Date.now()}`,
      WorkspaceId: wsId,
      Platform: platform,
      Username: connectResult.account.username,
      DisplayName: connectResult.account.displayName,
      Status: 'Connected',
      Followers: String(connectResult.account.followersCount || 1000),
      TokenPreview: connectResult.account.tokenPreview,
      ConnectedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    csvRepository.saveSocialAccount(accountRecord);
    csvRepository.logAction(wsId, 'alex@example.com', 'CONNECT_CHANNEL', accountRecord.ID, `Connected ${platform} (${accountRecord.Username})`);
    notificationService.notify(
      wsId,
      'Social Channel Connected',
      `Connected ${platform} (${accountRecord.Username}) in Demo Mode.`,
      'success'
    );

    return {
      success: true,
      account: accountRecord,
      message: connectResult.message,
    };
  },

  // Disconnects account
  disconnectAccount: (accountId) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    csvRepository.removeSocialAccount(accountId);
    csvRepository.logAction(wsId, 'alex@example.com', 'DISCONNECT_CHANNEL', accountId, 'Disconnected channel');
    notificationService.notify(
      wsId,
      'Channel Disconnected',
      'Social account has been unlinked from this workspace.',
      'warning'
    );
    return { success: true };
  },
};
