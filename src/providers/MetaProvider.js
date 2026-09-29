/**
 * Post Composer Pro — Meta Provider (Instagram & Facebook)
 * Exclusively handles Meta Graph API for Instagram Business and Facebook Pages.
 */
import { BaseSocialProvider } from './BaseSocialProvider';

export class MetaProvider extends BaseSocialProvider {
  constructor(subType = 'Instagram') {
    super(subType, subType === 'Instagram' ? 'Instagram' : 'Facebook');
    this.subType = subType;
    // Check if real environment variables are present
    const hasCredentials = Boolean(import.meta.env?.VITE_META_APP_ID);
    this.isDemoMode = !hasCredentials;
  }

  async connect(authPayload = {}) {
    if (this.isDemoMode) {
      return {
        success: true,
        isSimulated: true,
        message: `Connected ${this.displayName} (@personalbrand_${this.subType.toLowerCase()}) in Demo Mode.`,
        account: {
          id: `meta_${this.subType.toLowerCase()}_demo`,
          platform: this.subType,
          username: `@personalbrand_${this.subType.toLowerCase()}`,
          displayName: `Personal Brand ${this.displayName}`,
          avatarUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80`,
          status: 'Connected',
          connectedAt: new Date().toISOString(),
          tokenPreview: this.maskToken('EAAJk128491823901823912803128301823'),
          followersCount: this.subType === 'Instagram' ? 24500 : 18200,
        },
      };
    }
    // Production OAuth flow placeholder
    throw new Error('Meta Production OAuth requires META_APP_ID and server token exchange.');
  }

  async disconnect(accountId) {
    return {
      success: true,
      message: `Disconnected ${this.displayName} account.`,
    };
  }

  async publishPost(postData) {
    if (this.isDemoMode) {
      return {
        success: true,
        isSimulated: true,
        platformId: `demo_meta_post_${Date.now()}`,
        status: 'Published',
        message: `[DEMO MODE] Published simulated to ${this.displayName}. No live API call was made.`,
        publishedAt: new Date().toISOString(),
      };
    }
    throw new Error('Meta Production Publishing requires active Page Access Token.');
  }

  async schedulePost(postData, scheduledTime) {
    return {
      success: true,
      isSimulated: this.isDemoMode,
      scheduledAt: scheduledTime,
      status: 'Scheduled',
      message: `Post registered in Publishing Queue for ${this.displayName}.`,
    };
  }

  async getAnalytics(dateRange = '30d') {
    return {
      isSimulated: this.isDemoMode,
      platform: this.subType,
      impressions: this.subType === 'Instagram' ? 142800 : 98400,
      reach: this.subType === 'Instagram' ? 89500 : 61200,
      engagementRate: this.subType === 'Instagram' ? '4.8%' : '3.2%',
      likes: this.subType === 'Instagram' ? 6400 : 3100,
      comments: this.subType === 'Instagram' ? 820 : 410,
      shares: this.subType === 'Instagram' ? 1240 : 890,
      clicks: 2150,
      growth: '+12.4%',
    };
  }
}
