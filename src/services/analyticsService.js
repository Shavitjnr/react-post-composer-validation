/**
 * Post Composer Pro — Analytics & Performance Aggregation Service
 * Combines active post volumes with multi-channel metrics.
 * Note: Clearly flags Demo Mode simulated values.
 */
import { postService } from './postService';

export const analyticsService = {
  getOverviewMetrics: (workspaceId = null, platformFilter = 'All', dateRange = '30d') => {
    const posts = postService.getPosts(workspaceId);
    const publishedCount = posts.filter((p) => p.Status === 'Published').length;
    const scheduledCount = posts.filter((p) => p.Status === 'Scheduled').length;
    const draftsCount = postService.getDrafts(workspaceId).length;

    // Platform multipliers for simulated aggregate metrics
    const multiplier = dateRange === '7d' ? 0.25 : dateRange === '90d' ? 2.8 : 1.0;

    return {
      isSimulated: true,
      publishedCount,
      scheduledCount,
      draftsCount,
      totalReach: Math.round((148500 + publishedCount * 4200) * multiplier),
      totalImpressions: Math.round((284000 + publishedCount * 8100) * multiplier),
      totalEngagementRate: '4.6%',
      totalLikes: Math.round((12450 + publishedCount * 280) * multiplier),
      totalComments: Math.round((2180 + publishedCount * 65) * multiplier),
      totalShares: Math.round((3890 + publishedCount * 110) * multiplier),
      totalClicks: Math.round((8450 + publishedCount * 310) * multiplier),
      followerGrowth: '+14.2%',
      platformBreakdown: [
        { platform: 'Twitter', share: '32%', impressions: Math.round(92000 * multiplier), color: '#0f172a' },
        { platform: 'LinkedIn', share: '28%', impressions: Math.round(79000 * multiplier), color: '#0a66c2' },
        { platform: 'Instagram', share: '24%', impressions: Math.round(68000 * multiplier), color: '#e1306c' },
        { platform: 'YouTube', share: '11%', impressions: Math.round(31000 * multiplier), color: '#ef4444' },
        { platform: 'Facebook', share: '5%', impressions: Math.round(14000 * multiplier), color: '#1877f2' },
      ],
      performanceHistory: [
        { date: 'Sep 23', reach: Math.round(14200 * multiplier), engagement: 4.2 },
        { date: 'Sep 24', reach: Math.round(18500 * multiplier), engagement: 4.8 },
        { date: 'Sep 25', reach: Math.round(21400 * multiplier), engagement: 5.1 },
        { date: 'Sep 26', reach: Math.round(16900 * multiplier), engagement: 4.4 },
        { date: 'Sep 27', reach: Math.round(24800 * multiplier), engagement: 5.4 },
        { date: 'Sep 28', reach: Math.round(28100 * multiplier), engagement: 5.7 },
        { date: 'Sep 29', reach: Math.round(32400 * multiplier), engagement: 6.1 },
      ],
    };
  },
};
