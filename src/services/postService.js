/**
 * Post Composer Pro — Post & Publishing Management Service
 * Manages Posts, Drafts, Approval Workflows, Scheduling, and Publishing Queue
 * with Workspace-level isolation.
 */
import { csvStorage } from '../utils/csvStorage';
import { csvRepository } from '../repositories/csvRepository';
import { workspaceService } from './workspaceService';
import { SUBSCRIPTION_PLANS } from '../constants/subscriptionPlans';
import { notificationService } from './notificationService';

export const postService = {
  // Returns all posts filtered by active workspace
  getPosts: (workspaceId = null) => {
    const wsId = workspaceId || workspaceService.getActiveWorkspaceId();
    const all = csvStorage.getPosts();
    // Default demo data belongs to ws_1; items without workspace belong to ws_1
    return all.filter((p) => (p.WorkspaceId || 'ws_1') === wsId);
  },

  // Returns scheduled posts for queue & calendar
  getScheduledPosts: (workspaceId = null) => {
    return postService.getPosts(workspaceId).filter((p) => p.Status === 'Scheduled');
  },

  // Returns posts requiring managerial approval
  getPendingApprovalPosts: (workspaceId = null) => {
    return postService.getPosts(workspaceId).filter((p) => p.Status === 'Pending Review');
  },

  // Returns drafts filtered by active workspace
  getDrafts: (workspaceId = null) => {
    const wsId = workspaceId || workspaceService.getActiveWorkspaceId();
    const all = csvStorage.getDrafts();
    return all.filter((d) => (d.WorkspaceId || 'ws_1') === wsId);
  },

  // Immediate Publish (Demo Mode Simulated)
  publishPost: ({ content, platform, authorEmail, mediaUrl = '', tags = '', campaignId = '' }) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const activeWs = workspaceService.getActiveWorkspace();

    const newPost = {
      ID: `post_${Date.now()}`,
      WorkspaceId: wsId,
      UserEmail: authorEmail || 'alex@example.com',
      Platform: platform,
      Content: content.trim(),
      Status: 'Published',
      CharCount: Array.from(content.trim()).length,
      Limit: platform === 'Twitter' ? 280 : platform === 'LinkedIn' ? 3000 : 5000,
      ScheduledAt: '',
      PublishedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      MediaUrl: mediaUrl,
      Tags: tags,
      CampaignId: campaignId,
    };

    csvStorage.savePost(newPost);
    csvRepository.logAction(wsId, newPost.UserEmail, 'PUBLISH_POST', newPost.ID, `Simulated publish to ${platform}`);
    notificationService.notify(
      wsId,
      'Post Published (Simulated)',
      `Your post for ${platform} has been successfully simulated in Demo Mode.`,
      'success'
    );

    return {
      success: true,
      post: newPost,
      isSimulated: true,
      message: `Demo Mode — Simulated publication to ${platform}. No live API call was made.`,
    };
  },

  // Submit Post for Review (Approval Workflow)
  submitForReview: ({ content, platform, authorEmail, scheduledAt = '' }) => {
    const wsId = workspaceService.getActiveWorkspaceId();

    const newPost = {
      ID: `post_${Date.now()}`,
      WorkspaceId: wsId,
      UserEmail: authorEmail || 'alex@example.com',
      Platform: platform,
      Content: content.trim(),
      Status: 'Pending Review',
      CharCount: Array.from(content.trim()).length,
      Limit: platform === 'Twitter' ? 280 : platform === 'LinkedIn' ? 3000 : 5000,
      ScheduledAt: scheduledAt,
      PublishedAt: '',
    };

    csvStorage.savePost(newPost);
    csvRepository.logAction(wsId, newPost.UserEmail, 'SUBMIT_REVIEW', newPost.ID, `Submitted ${platform} post for manager review`);
    notificationService.notify(
      wsId,
      'Post Awaiting Approval',
      `New ${platform} content submitted by ${newPost.UserEmail} requires review.`,
      'info'
    );

    return { success: true, post: newPost };
  },

  // Approve Post
  approvePost: (postId, reviewerEmail) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const posts = csvStorage.getPosts();
    const target = posts.find((p) => p.ID === postId);
    if (!target) return { success: false, error: 'Post not found' };

    target.Status = target.ScheduledAt ? 'Scheduled' : 'Approved';
    csvStorage.saveAllPosts(posts);

    csvRepository.logAction(wsId, reviewerEmail || 'alex@example.com', 'APPROVE_POST', postId, `Approved post for ${target.Platform}`);
    notificationService.notify(
      wsId,
      'Post Approved',
      `Post (${target.Platform}) was approved and scheduled for publishing.`,
      'success'
    );

    return { success: true, post: target };
  },

  // Reject / Request Changes
  rejectPost: (postId, reviewerEmail, feedback = '') => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const posts = csvStorage.getPosts();
    const target = posts.find((p) => p.ID === postId);
    if (!target) return { success: false, error: 'Post not found' };

    target.Status = 'Draft';
    target.Content = `[Changes Requested: ${feedback}]\n\n${target.Content}`;
    csvStorage.saveAllPosts(posts);

    csvRepository.logAction(wsId, reviewerEmail || 'alex@example.com', 'REQUEST_CHANGES', postId, feedback);
    notificationService.notify(
      wsId,
      'Changes Requested',
      `Post for ${target.Platform} was returned to draft: "${feedback}"`,
      'warning'
    );

    return { success: true, post: target };
  },

  // Schedule Post with Plan Limit & Future Date Enforcement
  schedulePost: ({ content, platform, authorEmail, scheduledAt }) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const activeWs = workspaceService.getActiveWorkspace();
    const planConfig = SUBSCRIPTION_PLANS[activeWs.Plan?.toUpperCase()] || SUBSCRIPTION_PLANS.PROFESSIONAL;

    // Check plan limits
    const currentScheduled = postService.getScheduledPosts(wsId);
    if (currentScheduled.length >= planConfig.limits.scheduledPosts) {
      return {
        success: false,
        error: `Schedule Queue full: Your ${planConfig.name} plan permits max ${planConfig.limits.scheduledPosts} scheduled posts. Upgrade plan to continue.`,
      };
    }

    // Validate future timestamp
    const targetDate = new Date(scheduledAt);
    if (isNaN(targetDate.getTime()) || targetDate <= new Date()) {
      return {
        success: false,
        error: 'Invalid scheduled date/time. The post must be scheduled for a future timestamp.',
      };
    }

    const newPost = {
      ID: `post_${Date.now()}`,
      WorkspaceId: wsId,
      UserEmail: authorEmail || 'alex@example.com',
      Platform: platform,
      Content: content.trim(),
      Status: 'Scheduled',
      CharCount: Array.from(content.trim()).length,
      Limit: platform === 'Twitter' ? 280 : platform === 'LinkedIn' ? 3000 : 5000,
      ScheduledAt: scheduledAt,
      PublishedAt: '',
    };

    csvStorage.savePost(newPost);
    csvRepository.logAction(wsId, newPost.UserEmail, 'SCHEDULE_POST', newPost.ID, `Scheduled for ${scheduledAt}`);
    notificationService.notify(
      wsId,
      'Post Scheduled',
      `Post queued for ${platform} on ${new Date(scheduledAt).toLocaleString()}.`,
      'info'
    );

    return { success: true, post: newPost };
  },

  // Save Draft
  saveDraft: ({ content, platform, userEmail }) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const newDraft = {
      ID: `draft_${Date.now()}`,
      WorkspaceId: wsId,
      UserEmail: userEmail || 'alex@example.com',
      Platform: platform,
      Content: content.trim(),
      IsFavorite: 'false',
      CreatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    csvStorage.saveDraft(newDraft);
    return { success: true, draft: newDraft };
  },

  // Duplicate Draft
  duplicateDraft: (draft) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const dup = {
      ID: `draft_${Date.now()}`,
      WorkspaceId: wsId,
      UserEmail: draft.UserEmail || 'alex@example.com',
      Platform: draft.Platform,
      Content: `Copy of ${draft.Content}`,
      IsFavorite: 'false',
      CreatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    csvStorage.saveDraft(dup);
    return dup;
  },

  // Toggle Favorite
  toggleFavoriteDraft: (draftId) => {
    const drafts = csvStorage.getDrafts();
    const target = drafts.find((d) => d.ID === draftId);
    if (target) {
      target.IsFavorite = target.IsFavorite === 'true' ? 'false' : 'true';
      csvStorage.saveAllDrafts(drafts);
    }
  },

  // Delete Draft
  deleteDraft: (draftId) => {
    csvStorage.deleteDraft(draftId);
  },

  // Delete / Cancel Scheduled Post
  deletePost: (postId) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    csvStorage.deletePost(postId);
    csvRepository.logAction(wsId, 'alex@example.com', 'DELETE_POST', postId, 'Cancelled / removed post');
  },
};
