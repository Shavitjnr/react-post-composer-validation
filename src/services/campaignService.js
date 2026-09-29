/**
 * Post Composer Pro — Campaigns, Hashtags & Tag Management Service
 */
import { csvRepository } from '../repositories/csvRepository';
import { workspaceService } from './workspaceService';

const HASHTAG_GROUPS_KEY = 'pcp_hashtag_groups_db';
const TAGS_KEY = 'pcp_tags_db';

const DEFAULT_HASHTAG_GROUPS = [
  {
    id: 'grp_1',
    name: 'SaaS & Startup',
    tags: ['#SaaS', '#Startup', '#Tech', '#Founders', '#Cloud', '#B2B'],
  },
  {
    id: 'grp_2',
    name: 'Engineering & Architecture',
    tags: ['#Engineering', '#SoftwareArchitecture', '#React', '#WebDev', '#CleanCode'],
  },
  {
    id: 'grp_3',
    name: 'Growth & Marketing',
    tags: ['#Marketing', '#GrowthHacking', '#ContentStrategy', '#SocialMedia', '#DigitalAgency'],
  },
];

const DEFAULT_TAGS = [
  'Product Launch',
  'Marketing',
  'Architecture',
  'Important',
  'Client Alpha',
  'Webinar',
  'Quarterly Update',
];

export const campaignService = {
  getCampaigns: (workspaceId = null) => {
    const wsId = workspaceId || workspaceService.getActiveWorkspaceId();
    return csvRepository.getCampaigns(wsId);
  },

  createCampaign: ({ name, description, startDate, endDate, platforms, tags }) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const newCamp = {
      ID: `cmp_${Date.now()}`,
      WorkspaceId: wsId,
      Name: name.trim(),
      Description: description.trim(),
      Status: 'Active',
      StartDate: startDate || new Date().toISOString().slice(0, 10),
      EndDate: endDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      Platforms: Array.isArray(platforms) ? platforms.join(',') : platforms,
      Tags: Array.isArray(tags) ? tags.join(',') : tags,
    };
    csvRepository.saveCampaign(newCamp);
    csvRepository.logAction(wsId, 'alex@example.com', 'CREATE_CAMPAIGN', newCamp.ID, `Created campaign: ${newCamp.Name}`);
    return { success: true, campaign: newCamp };
  },

  // HASHTAG GROUPS
  getHashtagGroups: () => {
    try {
      const raw = localStorage.getItem(HASHTAG_GROUPS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_HASHTAG_GROUPS;
    } catch (e) {
      return DEFAULT_HASHTAG_GROUPS;
    }
  },

  createHashtagGroup: (name, tagsArray) => {
    const groups = campaignService.getHashtagGroups();
    const newGrp = {
      id: `grp_${Date.now()}`,
      name: name.trim(),
      tags: tagsArray.map((t) => (t.startsWith('#') ? t : `#${t}`)),
    };
    groups.push(newGrp);
    localStorage.setItem(HASHTAG_GROUPS_KEY, JSON.stringify(groups));
    return newGrp;
  },

  // TAGS
  getTags: () => {
    try {
      const raw = localStorage.getItem(TAGS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_TAGS;
    } catch (e) {
      return DEFAULT_TAGS;
    }
  },

  addTag: (newTag) => {
    const tags = campaignService.getTags();
    const clean = newTag.trim();
    if (clean && !tags.includes(clean)) {
      tags.push(clean);
      localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
    }
    return tags;
  },
};
