/**
 * Post Composer Pro — Base Social Provider Interface
 * All official platform integrations extend this base abstraction.
 * Supports Zero-Budget Demo Mode Simulation and Production Live API Mode.
 */

export class BaseSocialProvider {
  constructor(platformKey, displayName) {
    this.platformKey = platformKey;
    this.displayName = displayName;
    this.isDemoMode = true; // Defaults to safe demo mode
  }

  async connect(authPayload = {}) {
    throw new Error('connect() must be implemented by platform provider');
  }

  async disconnect(accountId) {
    throw new Error('disconnect() must be implemented by platform provider');
  }

  async publishPost(postData) {
    throw new Error('publishPost() must be implemented by platform provider');
  }

  async schedulePost(postData, scheduledTime) {
    throw new Error('schedulePost() must be implemented by platform provider');
  }

  async getAnalytics(dateRange = '30d') {
    throw new Error('getAnalytics() must be implemented by platform provider');
  }

  // Returns safe sanitized preview of token (never exposes full secret)
  maskToken(token) {
    if (!token) return '••••••••••••••••';
    return `${token.slice(0, 4)}••••••••${token.slice(-4)}`;
  }
}
