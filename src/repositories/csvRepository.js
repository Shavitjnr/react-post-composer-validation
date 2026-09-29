/**
 * Post Composer Pro — CSV Repository Layer
 * Manages development and Demo Mode persistence using RFC-4180 CSV tables.
 * Safe for ₹0 zero-budget development without requiring paid infrastructure.
 */
import { parseCSV, toCSV } from '../utils/csvStorage';

const WORKSPACES_KEY = 'csv_workspaces_database';
const SOCIAL_ACCOUNTS_KEY = 'csv_social_accounts_database';
const AUDIT_LOGS_KEY = 'csv_audit_logs_database';
const CAMPAIGNS_KEY = 'csv_campaigns_database';
const MEDIA_KEY = 'csv_media_database';

// Initial Workspaces CSV
export const DEFAULT_WORKSPACES_CSV = `ID,Name,Slug,Role,Plan,CreatedAt
ws_1,"Hostego","hostego","Owner","PROFESSIONAL","2026-09-29 08:00:00"
ws_2,"Personal Brand","personal-brand","Owner","STARTER","2026-09-29 08:30:00"
ws_3,"Client Alpha","client-alpha","Manager","BUSINESS","2026-09-29 09:00:00"`;

// Initial Social Accounts CSV (Zero credentials leaked; tokenPreview only)
export const DEFAULT_SOCIAL_ACCOUNTS_CSV = `ID,WorkspaceId,Platform,Username,DisplayName,Status,Followers,TokenPreview,ConnectedAt
acc_1,"ws_1","Twitter","@hostego_hq","Hostego Official","Connected","38200","2X98••••••••8340","2026-09-29 09:00:00"
acc_2,"ws_1","LinkedIn","@hostego-inc","Hostego Inc.","Connected","14890","AQW7••••••••9102","2026-09-29 09:15:00"
acc_3,"ws_1","Instagram","@hostego_official","Hostego Brand","Connected","24500","EAAJ••••••••1823","2026-09-29 09:20:00"
acc_4,"ws_1","Facebook","@hostego.technologies","Hostego Page","Connected","18200","EAAK••••••••3912","2026-09-29 09:25:00"
acc_5,"ws_1","YouTube","@HostegoMedia","Hostego Media Official","Connected","52400","ya29••••••••0918","2026-09-29 09:30:00"
acc_6,"ws_2","Twitter","@alexmorgan_dev","Alex Morgan","Connected","8400","4B71••••••••1928","2026-09-29 10:00:00"`;

// Initial Campaigns CSV
export const DEFAULT_CAMPAIGNS_CSV = `ID,WorkspaceId,Name,Description,Status,StartDate,EndDate,Platforms,Tags
cmp_1,"ws_1","Q4 SaaS Launch","Global launch campaign for Post Composer Pro Enterprise","Active","2026-10-01","2026-11-15","Twitter,LinkedIn,Instagram","Launch,SaaS,Tech"
cmp_2,"ws_1","Engineering Architecture Series","Weekly thought-leadership on React state governance and CSV pipelines","Active","2026-09-15","2026-10-31","LinkedIn,Twitter,YouTube","Engineering,Architecture"
cmp_3,"ws_1","Fall Feature Drop","Product updates announcing multi-workspace and live preview","Draft","2026-11-01","2026-11-30","Instagram,Facebook","Product,Release"`;

// Initial Media Assets CSV
export const DEFAULT_MEDIA_CSV = `ID,WorkspaceId,Title,Type,SizeMB,Url,UsedCount,CreatedAt
med_1,"ws_1","SaaS Dashboard Preview","image","1.2","https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80","4","2026-09-28 14:00:00"
med_2,"ws_1","Architecture Blueprint Diagram","image","2.4","https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80","2","2026-09-28 16:30:00"
med_3,"ws_1","Team Collaboration Hero","image","1.8","https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80","1","2026-09-29 09:10:00"
med_4,"ws_1","Product Demo Teaser Clip","video","14.5","https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80","0","2026-09-29 10:15:00"`;

// Initial Audit Logs CSV
export const DEFAULT_AUDIT_LOGS_CSV = `ID,WorkspaceId,UserEmail,Action,Resource,Timestamp,Details
aud_1,"ws_1","alex@example.com","CREATE_POST","post_1","2026-09-29 09:30:00","Created initial corporate announcement post"
aud_2,"ws_1","alex@example.com","SCHEDULE_POST","post_3","2026-09-29 09:45:00","Scheduled technical seminar for 2026-10-01"
aud_3,"ws_1","sarah@tech.org","CONNECT_ACCOUNT","acc_3","2026-09-29 10:12:00","Connected Instagram Business account in Demo Mode"
aud_4,"ws_1","alex@example.com","APPROVE_POST","post_4","2026-09-29 10:30:00","Approved senior architect hiring announcement"`;

export const csvRepository = {
  // WORKSPACES
  getWorkspacesCSV: () => {
    let raw = localStorage.getItem(WORKSPACES_KEY);
    if (!raw) {
      localStorage.setItem(WORKSPACES_KEY, DEFAULT_WORKSPACES_CSV);
      raw = DEFAULT_WORKSPACES_CSV;
    }
    return raw;
  },

  getWorkspaces: () => {
    return parseCSV(csvRepository.getWorkspacesCSV());
  },

  saveWorkspace: (workspace) => {
    const list = csvRepository.getWorkspaces();
    list.push(workspace);
    const csv = toCSV(list, ['ID', 'Name', 'Slug', 'Role', 'Plan', 'CreatedAt']);
    localStorage.setItem(WORKSPACES_KEY, csv);
    return workspace;
  },

  // SOCIAL ACCOUNTS
  getSocialAccountsCSV: () => {
    let raw = localStorage.getItem(SOCIAL_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(SOCIAL_ACCOUNTS_KEY, DEFAULT_SOCIAL_ACCOUNTS_CSV);
      raw = DEFAULT_SOCIAL_ACCOUNTS_CSV;
    }
    return raw;
  },

  getSocialAccounts: (workspaceId = null) => {
    const all = parseCSV(csvRepository.getSocialAccountsCSV());
    return workspaceId ? all.filter((a) => a.WorkspaceId === workspaceId) : all;
  },

  saveSocialAccount: (account) => {
    const list = parseCSV(csvRepository.getSocialAccountsCSV());
    list.push(account);
    const csv = toCSV(list, ['ID', 'WorkspaceId', 'Platform', 'Username', 'DisplayName', 'Status', 'Followers', 'TokenPreview', 'ConnectedAt']);
    localStorage.setItem(SOCIAL_ACCOUNTS_KEY, csv);
    return account;
  },

  removeSocialAccount: (id) => {
    const list = parseCSV(csvRepository.getSocialAccountsCSV()).filter((a) => a.ID !== id);
    const csv = toCSV(list, ['ID', 'WorkspaceId', 'Platform', 'Username', 'DisplayName', 'Status', 'Followers', 'TokenPreview', 'ConnectedAt']);
    localStorage.setItem(SOCIAL_ACCOUNTS_KEY, csv);
    return true;
  },

  // CAMPAIGNS
  getCampaignsCSV: () => {
    let raw = localStorage.getItem(CAMPAIGNS_KEY);
    if (!raw) {
      localStorage.setItem(CAMPAIGNS_KEY, DEFAULT_CAMPAIGNS_CSV);
      raw = DEFAULT_CAMPAIGNS_CSV;
    }
    return raw;
  },

  getCampaigns: (workspaceId = null) => {
    const all = parseCSV(csvRepository.getCampaignsCSV());
    return workspaceId ? all.filter((c) => c.WorkspaceId === workspaceId) : all;
  },

  saveCampaign: (campaign) => {
    const list = parseCSV(csvRepository.getCampaignsCSV());
    list.push(campaign);
    const csv = toCSV(list, ['ID', 'WorkspaceId', 'Name', 'Description', 'Status', 'StartDate', 'EndDate', 'Platforms', 'Tags']);
    localStorage.setItem(CAMPAIGNS_KEY, csv);
    return campaign;
  },

  // MEDIA ASSETS
  getMediaCSV: () => {
    let raw = localStorage.getItem(MEDIA_KEY);
    if (!raw) {
      localStorage.setItem(MEDIA_KEY, DEFAULT_MEDIA_CSV);
      raw = DEFAULT_MEDIA_CSV;
    }
    return raw;
  },

  getMedia: (workspaceId = null) => {
    const all = parseCSV(csvRepository.getMediaCSV());
    return workspaceId ? all.filter((m) => m.WorkspaceId === workspaceId) : all;
  },

  saveMedia: (mediaItem) => {
    const list = parseCSV(csvRepository.getMediaCSV());
    list.unshift(mediaItem);
    const csv = toCSV(list, ['ID', 'WorkspaceId', 'Title', 'Type', 'SizeMB', 'Url', 'UsedCount', 'CreatedAt']);
    localStorage.setItem(MEDIA_KEY, csv);
    return mediaItem;
  },

  deleteMedia: (id) => {
    const list = parseCSV(csvRepository.getMediaCSV()).filter((m) => m.ID !== id);
    const csv = toCSV(list, ['ID', 'WorkspaceId', 'Title', 'Type', 'SizeMB', 'Url', 'UsedCount', 'CreatedAt']);
    localStorage.setItem(MEDIA_KEY, csv);
    return true;
  },

  // AUDIT LOGS
  getAuditLogsCSV: () => {
    let raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_LOGS_KEY, DEFAULT_AUDIT_LOGS_CSV);
      raw = DEFAULT_AUDIT_LOGS_CSV;
    }
    return raw;
  },

  getAuditLogs: (workspaceId = null) => {
    const all = parseCSV(csvRepository.getAuditLogsCSV());
    return workspaceId ? all.filter((l) => l.WorkspaceId === workspaceId) : all;
  },

  logAction: (workspaceId, userEmail, action, resource, details) => {
    const list = parseCSV(csvRepository.getAuditLogsCSV());
    const newLog = {
      ID: `aud_${Date.now()}`,
      WorkspaceId: workspaceId || 'ws_1',
      UserEmail: userEmail || 'alex@example.com',
      Action: action,
      Resource: resource,
      Timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      Details: details || '',
    };
    list.unshift(newLog);
    const csv = toCSV(list, ['ID', 'WorkspaceId', 'UserEmail', 'Action', 'Resource', 'Timestamp', 'Details']);
    localStorage.setItem(AUDIT_LOGS_KEY, csv);
    return newLog;
  },

  // RESET ALL DEMO DATA
  resetAllRepositories: () => {
    localStorage.setItem(WORKSPACES_KEY, DEFAULT_WORKSPACES_CSV);
    localStorage.setItem(SOCIAL_ACCOUNTS_KEY, DEFAULT_SOCIAL_ACCOUNTS_CSV);
    localStorage.setItem(CAMPAIGNS_KEY, DEFAULT_CAMPAIGNS_CSV);
    localStorage.setItem(MEDIA_KEY, DEFAULT_MEDIA_CSV);
    localStorage.setItem(AUDIT_LOGS_KEY, DEFAULT_AUDIT_LOGS_CSV);
  },
};
