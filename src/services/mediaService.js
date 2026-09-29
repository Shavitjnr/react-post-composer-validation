/**
 * Post Composer Pro — Media Asset & Storage Service
 * Handles media uploads, filters, and plan-based storage MB tracking.
 */
import { csvRepository } from '../repositories/csvRepository';
import { workspaceService } from './workspaceService';
import { SUBSCRIPTION_PLANS } from '../constants/subscriptionPlans';

export const mediaService = {
  getMedia: (workspaceId = null) => {
    const wsId = workspaceId || workspaceService.getActiveWorkspaceId();
    return csvRepository.getMedia(wsId);
  },

  getTotalStorageUsedMB: (workspaceId = null) => {
    const list = mediaService.getMedia(workspaceId);
    return list.reduce((sum, item) => sum + (parseFloat(item.SizeMB) || 0), 0);
  },

  uploadMedia: ({ title, type, sizeMB, url }) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const activeWs = workspaceService.getActiveWorkspace();
    const planConfig = SUBSCRIPTION_PLANS[activeWs.Plan?.toUpperCase()] || SUBSCRIPTION_PLANS.PROFESSIONAL;

    const currentStorage = mediaService.getTotalStorageUsedMB(wsId);
    const itemSize = parseFloat(sizeMB) || 1.5;

    if (currentStorage + itemSize > planConfig.limits.storageMB) {
      return {
        success: false,
        error: `Storage capacity exceeded: Your ${planConfig.name} plan includes ${planConfig.limits.storageMB} MB. Current usage: ${currentStorage.toFixed(1)} MB. Upgrade plan for more storage.`,
      };
    }

    const newMedia = {
      ID: `med_${Date.now()}`,
      WorkspaceId: wsId,
      Title: title.trim() || 'Untitled Asset',
      Type: type || 'image',
      SizeMB: itemSize.toFixed(1),
      Url: url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      UsedCount: '0',
      CreatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    csvRepository.saveMedia(newMedia);
    csvRepository.logAction(wsId, 'alex@example.com', 'UPLOAD_MEDIA', newMedia.ID, `Uploaded ${newMedia.Title} (${newMedia.SizeMB} MB)`);

    return { success: true, media: newMedia };
  },

  deleteMedia: (id) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    csvRepository.deleteMedia(id);
    csvRepository.logAction(wsId, 'alex@example.com', 'DELETE_MEDIA', id, 'Deleted media asset');
    return { success: true };
  },
};
