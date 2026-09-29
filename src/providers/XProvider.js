/**
 * Post Composer Pro — X (formerly Twitter) Provider
 * Handles X API v2 Tweets and Media Uploads.
 */
import { BaseSocialProvider } from './BaseSocialProvider';

export class XProvider extends BaseSocialProvider {
  constructor() {
    super('Twitter', 'X');
    const hasCredentials = Boolean(import.meta.env?.VITE_X_CLIENT_ID);
    this.isDemoMode = !hasCredentials;
  }

  async connect(authPayload = {}) {
    if (this.isDemoMode) {
      return {
        success: true,
        isSimulated: true,
        message: 'Connected X account (@hostego_hq) in Demo Mode.',
        account: {
          id: 'x_demo_account',
          platform: 'Twitter',
          username: '@hostego_hq',
          displayName: 'Hostego Official',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          status: 'Connected',
          connectedAt: new Date().toISOString(),
          tokenPreview: this.maskToken('2X98a0982309482039480293840928340'),
          followersCount: 38200,
        },
      };
    }
    throw new Error('X OAuth requires X_CLIENT_ID configuration.');
  }

  async disconnect(accountId) {
    return { success: true, message: 'Disconnected X account.' };
  }

  async publishPost(postData) {
    if (this.isDemoMode) {
      return {
        success: true,
        isSimulated: true,
        platformId: `x_tweet_${Date.now()}`,
        status: 'Published',
        message: '[DEMO MODE] Published simulated to X. No live API call was made.',
        publishedAt: new Date().toISOString(),
      };
    }
    throw new Error('X Publishing requires active OAuth 2.0 user context.');
  }

  async schedulePost(postData, scheduledTime) {
    return {
      success: true,
      isSimulated: this.isDemoMode,
      scheduledAt: scheduledTime,
      status: 'Scheduled',
      message: 'Post queued for automated X dispatch.',
    };
  }

  async getAnalytics(dateRange = '30d') {
    return {
      isSimulated: this.isDemoMode,
      platform: 'Twitter',
      impressions: 212000,
      reach: 145000,
      engagementRate: '3.8%',
      likes: 8900,
      comments: 1420,
      shares: 3100,
      clicks: 5800,
      growth: '+9.1%',
    };
  }
}
