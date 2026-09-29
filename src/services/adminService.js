import { csvStorage } from '../utils/csvStorage';
import { csvRepository } from '../repositories/csvRepository';
import { workspaceService } from './workspaceService';

const ADMIN_USERS_EXTRA_KEY = 'pcp_admin_users_meta_db';
const ADMIN_TRANSACTIONS_KEY = 'pcp_admin_transactions_db';
const ADMIN_FEATURE_FLAGS_KEY = 'pcp_admin_feature_flags_db';
const ADMIN_SETTINGS_KEY = 'pcp_admin_settings_db';
const ADMIN_SECURITY_ALERTS_KEY = 'pcp_admin_security_alerts_db';
const ADMIN_NOTIFICATIONS_KEY = 'pcp_admin_notifications_db';
const ADMIN_LOGIN_ACTIVITY_KEY = 'pcp_admin_login_activity_db';

const DEFAULT_USERS_META = {
  'daloutrashavit@gmail.com': {
    verified: true,
    verificationStatus: 'Verified',
    verificationDate: '2026-09-01 10:00:00',
    verifiedBy: 'System Master Authority',
    status: 'Active',
    plan: 'Agency (Unlimited)',
    username: 'daloutrashavit',
    connectedAccounts: ['Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'YouTube'],
    lastLogin: 'Just now',
    ipAddress: '192.168.1.100',
    device: 'Desktop (Windows / Chrome)'
  },
  'shavitdaloutra28@gmail.com': {
    verified: true,
    verificationStatus: 'Verified',
    verificationDate: '2026-09-01 10:00:00',
    verifiedBy: 'System Master Authority',
    status: 'Active',
    plan: 'Agency (Unlimited)',
    username: 'daloutrashavit',
    connectedAccounts: ['Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'YouTube'],
    lastLogin: 'Just now',
    ipAddress: '192.168.1.100',
    device: 'Desktop (Windows / Chrome)'
  },
  'sarah@tech.org': {
    verified: true,
    verificationStatus: 'Verified',
    verificationDate: '2026-09-20 14:30:00',
    verifiedBy: 'Shavit Daloutra',
    status: 'Active',
    plan: 'Professional',
    username: 'sarahjenkins',
    connectedAccounts: ['LinkedIn', 'Twitter'],
    lastLogin: '2 hours ago',
    ipAddress: '192.168.1.105',
    device: 'Laptop (MacOS / Safari)'
  },
  'david@startup.io': {
    verified: false,
    verificationStatus: 'Pending',
    verificationDate: null,
    verifiedBy: null,
    status: 'Active',
    plan: 'Creator',
    username: 'david_chen',
    connectedAccounts: ['Twitter'],
    lastLogin: 'Yesterday',
    ipAddress: '10.0.0.42',
    device: 'Mobile (Android / Chrome)'
  },
  'elena@agency.com': {
    verified: false,
    verificationStatus: 'Revoked',
    verificationDate: null,
    verifiedBy: 'Shavit Daloutra (Revocation on compliance review)',
    status: 'Active',
    plan: 'Free',
    username: 'elena_rostova',
    connectedAccounts: ['Facebook', 'Instagram'],
    lastLogin: '3 days ago',
    ipAddress: '172.16.0.8',
    device: 'Desktop (Ubuntu / Firefox)'
  }
};

const DEFAULT_TRANSACTIONS = [
  {
    id: 'txn_1091',
    userEmail: 'sarah@tech.org',
    userName: 'Sarah Jenkins',
    workspaceId: 'ws_1',
    plan: 'Professional',
    amount: 49.00,
    currency: 'USD',
    status: 'Success',
    paymentMethod: 'Visa •••• 4242',
    createdAt: '2026-09-29 11:20:00',
    invoiceRef: 'INV-2026-0901',
    isSimulated: true
  },
  {
    id: 'txn_1090',
    userEmail: 'david@startup.io',
    userName: 'David Chen',
    workspaceId: 'ws_2',
    plan: 'Creator',
    amount: 19.00,
    currency: 'USD',
    status: 'Success',
    paymentMethod: 'Mastercard •••• 8819',
    createdAt: '2026-09-28 15:45:00',
    invoiceRef: 'INV-2026-0899',
    isSimulated: true
  },
  {
    id: 'txn_1089',
    userEmail: 'elena@agency.com',
    userName: 'Elena Rostova',
    workspaceId: 'ws_3',
    plan: 'Agency',
    amount: 149.00,
    currency: 'USD',
    status: 'Refunded',
    paymentMethod: 'PayPal Express',
    createdAt: '2026-09-27 09:10:00',
    invoiceRef: 'INV-2026-0892',
    isSimulated: true
  },
  {
    id: 'txn_1088',
    userEmail: 'marcus@venture.io',
    userName: 'Marcus Sterling',
    workspaceId: 'ws_1',
    plan: 'Professional',
    amount: 49.00,
    currency: 'USD',
    status: 'Failed',
    paymentMethod: 'Visa •••• 1009 (Declined: Insufficient Funds)',
    createdAt: '2026-09-26 18:22:00',
    invoiceRef: 'INV-2026-0885',
    isSimulated: true
  },
  {
    id: 'txn_1087',
    userEmail: 'sarah@tech.org',
    userName: 'Sarah Jenkins',
    workspaceId: 'ws_1',
    plan: 'Professional',
    amount: 49.00,
    currency: 'USD',
    status: 'Success',
    paymentMethod: 'Visa •••• 4242',
    createdAt: '2026-08-29 11:20:00',
    invoiceRef: 'INV-2026-0801',
    isSimulated: true
  }
];

const DEFAULT_FEATURE_FLAGS = [
  {
    id: 'flag_composer_v2',
    name: 'Enhanced Multi-Channel Composer',
    description: 'Enables advanced character validation, live multi-platform feed simulator, and hashtag auto-tagger.',
    category: 'Publishing',
    enabled: true,
    lastUpdated: '2026-09-29 08:00:00',
    updatedBy: 'Shavit Daloutra'
  },
  {
    id: 'flag_ai_copilot',
    name: 'AI Copy & Hook Assistant',
    description: 'Simulates neural language suggestion for Twitter and LinkedIn thought leadership hooks.',
    category: 'AI Tools',
    enabled: true,
    lastUpdated: '2026-09-28 12:00:00',
    updatedBy: 'Shavit Daloutra'
  },
  {
    id: 'flag_campaign_orchestration',
    name: 'Campaign Synchronization Hub',
    description: 'Allows grouping posts into synchronized marketing waves across Meta, X, and LinkedIn.',
    category: 'Workspaces',
    enabled: true,
    lastUpdated: '2026-09-27 10:15:00',
    updatedBy: 'Shavit Daloutra'
  },
  {
    id: 'flag_advanced_analytics',
    name: 'Predictive Audience Reach Metrics',
    description: 'Calculates simulated platform reach trends and high-engagement time suggestions.',
    category: 'Analytics',
    enabled: true,
    lastUpdated: '2026-09-25 14:00:00',
    updatedBy: 'Shavit Daloutra'
  },
  {
    id: 'flag_agency_workspaces',
    name: 'Multi-Tenant Agency Workspace Isolation',
    description: 'Enforces strict data boundaries between client workspaces and member permission tiers.',
    category: 'Security',
    enabled: true,
    lastUpdated: '2026-09-24 16:30:00',
    updatedBy: 'Shavit Daloutra'
  },
  {
    id: 'flag_video_transcoder',
    name: 'Cloud Video Transcoder Engine',
    description: 'Automated video encoding for YouTube Shorts and Instagram Reels (Experimental).',
    category: 'Media',
    enabled: false,
    lastUpdated: '2026-09-20 09:00:00',
    updatedBy: 'Shavit Daloutra'
  },
  {
    id: 'flag_evergreen_recycling',
    name: 'Automated Evergreen Post Recycling',
    description: 'Auto-schedules top-performing tweets to re-post every 90 days with revised captions.',
    category: 'Automation',
    enabled: false,
    lastUpdated: '2026-09-19 11:30:00',
    updatedBy: 'Shavit Daloutra'
  }
];

const DEFAULT_SETTINGS = {
  platformName: 'Personal Brand',
  supportEmail: 'support@personalbrand.io',
  defaultTimezone: 'UTC (Coordinated Universal Time)',
  defaultPlan: 'Free',
  maxStorageMB: 50000,
  maxDailyPostsPerUser: 50,
  enforceStrictValidation: true,
  requireVerificationForPublishing: false,
  maintenanceMode: false,
  authProviderStatus: 'Clerk Cloud + Local RFC-4180 CSV Engine (Active)',
  lastUpdated: '2026-09-29 10:00:00',
  updatedBy: 'Shavit Daloutra'
};

const DEFAULT_SECURITY_ALERTS = [
  {
    id: 'sec_1',
    severity: 'info',
    title: 'New Session from Trusted IP',
    description: 'Super Admin Shavit Daloutra logged in from 192.168.1.100.',
    timestamp: '2026-09-29 10:00:00',
    resolved: true,
    targetUser: 'daloutrashavit@gmail.com'
  },
  {
    id: 'sec_2',
    severity: 'warning',
    title: 'Repeated Failed Password Attempt',
    description: '2 failed sign-in attempts detected on user account elena@agency.com from IP 185.220.101.5.',
    timestamp: '2026-09-28 22:14:00',
    resolved: false,
    targetUser: 'elena@agency.com'
  },
  {
    id: 'sec_3',
    severity: 'high',
    title: 'Unusual OAuth Reconnect Request',
    description: 'Instagram token refresh requested outside of standard expiration window for account @personalbrand_official.',
    timestamp: '2026-09-27 16:40:00',
    resolved: false,
    targetUser: 'sarah@tech.org'
  }
];

const DEFAULT_LOGIN_ACTIVITY = [
  {
    id: 'log_act_1',
    user: 'Shavit Daloutra',
    email: 'daloutrashavit@gmail.com',
    role: 'Super Admin',
    status: 'Success',
    ipAddress: '192.168.1.100',
    device: 'Desktop (Windows / Chrome 129)',
    location: 'Delhi, India',
    timestamp: '2026-09-29 10:00:15'
  },
  {
    id: 'log_act_2',
    user: 'Sarah Jenkins',
    email: 'sarah@tech.org',
    role: 'Member',
    status: 'Success',
    ipAddress: '192.168.1.105',
    device: 'Laptop (MacOS / Safari 18)',
    location: 'California, USA',
    timestamp: '2026-09-29 08:35:40'
  },
  {
    id: 'log_act_3',
    user: 'David Chen',
    email: 'david@startup.io',
    role: 'Editor',
    status: 'Success',
    ipAddress: '10.0.0.42',
    device: 'Mobile (Android 14 / Chrome)',
    location: 'Singapore',
    timestamp: '2026-09-28 17:12:05'
  },
  {
    id: 'log_act_4',
    user: 'Unknown / Bot',
    email: 'elena@agency.com',
    role: 'Unauthorized',
    status: 'Blocked',
    ipAddress: '185.220.101.5',
    device: 'Python Requests / Script',
    location: 'Frankfurt, Germany',
    timestamp: '2026-09-28 22:14:12'
  }
];

const DEFAULT_ADMIN_NOTIFICATIONS = [
  {
    id: 'adm_notif_1',
    type: 'verification',
    title: 'New Verification Request',
    message: 'David Chen (david@startup.io) submitted creator verification credentials for review.',
    timestamp: '2026-09-29 09:15:00',
    read: false,
    link: 'verification'
  },
  {
    id: 'adm_notif_2',
    type: 'subscription',
    title: 'Subscription Upgrade Event',
    message: 'Sarah Jenkins upgraded Workspace ws_1 to Professional ($49/mo).',
    timestamp: '2026-09-29 07:30:00',
    read: false,
    link: 'subscriptions'
  },
  {
    id: 'adm_notif_3',
    type: 'security',
    title: 'Security Notice',
    message: '2 failed login attempts recorded for account elena@agency.com.',
    timestamp: '2026-09-28 22:15:00',
    read: true,
    link: 'security'
  }
];

export const adminService = {
  // Master Super Admin identification
  SUPER_ADMIN_EMAIL: 'daloutrashavit@gmail.com',
  SUPER_ADMIN_EMAILS: ['daloutrashavit@gmail.com', 'shavitdaloutra28@gmail.com'],
  SUPER_ADMIN_USERNAMES: ['daloutrashavit', 'shavitdaloutra'],
  SUPER_ADMIN_ORG_ID: 'org_3JzmVi9pR3cE8KEwBWeAAqBmTAK',
  SUPER_ADMIN_NAME: 'Shavit Daloutra',

  // Authorization check for Super Admin access
  isSuperAdmin: (user, orgId = null) => {
    if (!user) return false;
    if (orgId && orgId === adminService.SUPER_ADMIN_ORG_ID) return true;
    if (user.orgId && user.orgId === adminService.SUPER_ADMIN_ORG_ID) return true;
    if (user.organizationId && user.organizationId === adminService.SUPER_ADMIN_ORG_ID) return true;
    if (user.role === 'Super Admin' || user.Role === 'Super Admin') return true;

    // Check Clerk organization memberships if present
    if (Array.isArray(user.organizationMemberships)) {
      const hasSuperOrg = user.organizationMemberships.some(
        (m) => m?.organization?.id === adminService.SUPER_ADMIN_ORG_ID
      );
      if (hasSuperOrg) return true;
    }

    // Extract all possible email addresses (Clerk or standard)
    const userEmails = [];
    if (user.email) userEmails.push(user.email.toLowerCase());
    if (user.Email) userEmails.push(user.Email.toLowerCase());
    if (user.primaryEmailAddress?.emailAddress) {
      userEmails.push(user.primaryEmailAddress.emailAddress.toLowerCase());
    }
    if (Array.isArray(user.emailAddresses)) {
      user.emailAddresses.forEach((ea) => {
        if (ea?.emailAddress) userEmails.push(ea.emailAddress.toLowerCase());
      });
    }

    const username = (user.username || user.Username || '').toLowerCase();

    const isAuthorizedEmail = userEmails.some((e) =>
      adminService.SUPER_ADMIN_EMAILS.some((adminE) => adminE.toLowerCase() === e)
    );
    if (isAuthorizedEmail) return true;

    if (adminService.SUPER_ADMIN_USERNAMES.some((u) => u.toLowerCase() === username)) return true;
    return false;
  },

  // USERS METADATA STORAGE
  getUsersMeta: () => {
    try {
      const raw = localStorage.getItem(ADMIN_USERS_EXTRA_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_USERS_META;
    } catch {
      return DEFAULT_USERS_META;
    }
  },

  saveUsersMeta: (meta) => {
    localStorage.setItem(ADMIN_USERS_EXTRA_KEY, JSON.stringify(meta));
  },

  // Consolidated user list with CSV data, post stats, and verification status
  getAllUsersDetailed: () => {
    const rawCsvUsers = csvStorage.getUsers();
    const meta = adminService.getUsersMeta();
    const allPosts = csvStorage.getPosts();
    const allDrafts = csvStorage.getDrafts();
    const allWorkspaces = workspaceService.getAllWorkspaces();

    return rawCsvUsers.map((u) => {
      const userMeta = meta[u.Email] || {
        verified: false,
        verificationStatus: 'Pending',
        verificationDate: null,
        verifiedBy: null,
        status: 'Active',
        plan: 'Free',
        username: u.Email.split('@')[0],
        connectedAccounts: ['Twitter'],
        lastLogin: '2 hours ago',
        ipAddress: '192.168.1.50',
        device: 'Desktop (Browser)'
      };

      const userPosts = allPosts.filter((p) => p.UserEmail?.toLowerCase() === u.Email?.toLowerCase());
      const userDrafts = allDrafts.filter((d) => d.UserEmail?.toLowerCase() === u.Email?.toLowerCase());
      const isSuperAdmin = adminService.isSuperAdmin({ email: u.Email, role: u.Role });

      // Determine verification state
      const verificationStatus = isSuperAdmin ? 'Verified' : (userMeta.verificationStatus || (userMeta.verified ? 'Verified' : 'Pending'));

      return {
        id: u.ID,
        name: u.Name,
        email: u.Email,
        role: isSuperAdmin ? 'Super Admin' : u.Role || 'Member',
        createdAt: u.CreatedAt,
        isSuperAdmin,
        verified: verificationStatus === 'Verified',
        verificationStatus,
        verificationDate: userMeta.verificationDate || (isSuperAdmin ? '2026-09-01' : null),
        verifiedBy: userMeta.verifiedBy || (isSuperAdmin ? 'Root Master' : null),
        status: userMeta.status || 'Active',
        plan: isSuperAdmin ? 'Agency (Master)' : (userMeta.plan || 'Free'),
        workspaceName: allWorkspaces[0]?.Name || 'Personal Brand',
        workspaceId: allWorkspaces[0]?.ID || 'ws_1',
        username: userMeta.username || u.Email.split('@')[0],
        connectedAccounts: userMeta.connectedAccounts || ['Twitter'],
        lastLogin: userMeta.lastLogin || 'Recent',
        ipAddress: userMeta.ipAddress || '127.0.0.1',
        device: userMeta.device || 'Web Client',
        postsCount: userPosts.length,
        draftsCount: userDrafts.length
      };
    });
  },

  // Retrieve user full details without exposing passwords or OAuth secrets
  getUserDetails: (userEmail) => {
    const allUsers = adminService.getAllUsersDetailed();
    const user = allUsers.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
    if (!user) return null;

    const allPosts = csvStorage.getPosts().filter((p) => p.UserEmail?.toLowerCase() === userEmail.toLowerCase());
    const allDrafts = csvStorage.getDrafts().filter((d) => d.UserEmail?.toLowerCase() === userEmail.toLowerCase());
    const allAudit = csvRepository.getAuditLogs().filter((l) => l.UserEmail?.toLowerCase() === userEmail.toLowerCase());
    const allTxns = adminService.getTransactions().filter((t) => t.userEmail?.toLowerCase() === userEmail.toLowerCase());

    return {
      user,
      posts: allPosts,
      drafts: allDrafts,
      auditHistory: allAudit,
      transactions: allTxns
    };
  },

  // Edit user profile (permitted fields only: name, role, status)
  updateUserProfile: (userEmail, updates) => {
    const users = csvStorage.getUsers();
    const target = users.find((u) => u.Email.toLowerCase() === userEmail.toLowerCase());
    if (!target) return { success: false, error: 'User not found in system.' };

    const isSuper = adminService.isSuperAdmin({ email: userEmail });
    if (isSuper && updates.role && updates.role !== 'Super Admin') {
      return { success: false, error: 'Cannot alter root Super Admin role.' };
    }

    if (updates.name) target.Name = updates.name.trim();
    if (updates.role && !isSuper) target.Role = updates.role;
    csvStorage.saveAllUsers(users);

    const meta = adminService.getUsersMeta();
    const currentMeta = meta[userEmail] || {};
    if (updates.status && !isSuper) currentMeta.status = updates.status;
    if (updates.plan) currentMeta.plan = updates.plan;
    meta[userEmail] = currentMeta;
    adminService.saveUsersMeta(meta);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_EDIT_USER',
      userEmail,
      `Super Admin updated user fields for ${userEmail}: Name="${target.Name}", Role="${target.Role}", Status="${currentMeta.status || 'Active'}"`
    );

    return { success: true, user: target };
  },

  // Delete user from system (destructive action requiring audit logging)
  deleteUser: (userEmail, reason = 'Administrative deletion') => {
    if (adminService.isSuperAdmin({ email: userEmail })) {
      return { success: false, error: 'Security Exception: Cannot delete the Super Admin root account.' };
    }

    const users = csvStorage.getUsers();
    const filtered = users.filter((u) => u.Email.toLowerCase() !== userEmail.toLowerCase());
    if (filtered.length === users.length) {
      return { success: false, error: 'User not found in system database.' };
    }

    csvStorage.saveAllUsers(filtered);

    // Remove metadata
    const meta = adminService.getUsersMeta();
    delete meta[userEmail];
    adminService.saveUsersMeta(meta);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_DELETE_USER',
      userEmail,
      `Super Admin deleted user ${userEmail}. Reason: ${reason}`
    );

    return { success: true };
  },

  // Toggle or explicitly set user verification status (Verified, Pending, Revoked)
  setUserVerificationState: (userEmail, targetStatus, reason = '') => {
    if (adminService.isSuperAdmin({ email: userEmail })) {
      return { success: false, error: 'Super Admin is permanently verified.' };
    }

    const meta = adminService.getUsersMeta();
    const current = meta[userEmail] || { verified: false, verificationStatus: 'Pending', status: 'Active' };
    const prevStatus = current.verificationStatus || (current.verified ? 'Verified' : 'Pending');

    current.verificationStatus = targetStatus;
    current.verified = targetStatus === 'Verified';
    current.verificationDate = targetStatus === 'Verified' ? new Date().toISOString().replace('T', ' ').slice(0, 19) : null;
    current.verifiedBy = targetStatus === 'Verified' ? adminService.SUPER_ADMIN_NAME : (targetStatus === 'Revoked' ? `Revoked by ${adminService.SUPER_ADMIN_NAME}: ${reason || 'Administrative action'}` : null);

    meta[userEmail] = current;
    adminService.saveUsersMeta(meta);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_VERIFICATION_CHANGE',
      userEmail,
      `Super Admin changed verification for ${userEmail} from [${prevStatus}] to [${targetStatus}]. Details: ${reason || 'Status review'}`
    );

    return { success: true, status: targetStatus };
  },

  toggleUserVerification: (userEmail) => {
    const meta = adminService.getUsersMeta();
    const current = meta[userEmail] || { verified: false, verificationStatus: 'Pending' };
    const nextStatus = (current.verificationStatus === 'Verified' || current.verified) ? 'Revoked' : 'Verified';
    return adminService.setUserVerificationState(userEmail, nextStatus, 'Quick toggle by Super Admin');
  },

  // Toggle user account suspension
  toggleUserStatus: (userEmail) => {
    if (adminService.isSuperAdmin({ email: userEmail })) {
      return { success: false, error: 'Cannot suspend the Super Admin account.' };
    }

    const meta = adminService.getUsersMeta();
    const current = meta[userEmail] || { verified: true, status: 'Active' };
    current.status = current.status === 'Active' ? 'Suspended' : 'Active';
    meta[userEmail] = current;
    adminService.saveUsersMeta(meta);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_TOGGLE_SUSPEND',
      userEmail,
      `Super Admin changed account status for ${userEmail} to ${current.status}`
    );

    return { success: true, status: current.status };
  },

  // Update user role
  updateUserRole: (userEmail, newRole) => {
    const users = csvStorage.getUsers();
    const target = users.find((u) => u.Email.toLowerCase() === userEmail.toLowerCase());
    if (!target) return { success: false, error: 'User not found.' };

    if (adminService.isSuperAdmin({ email: userEmail }) && newRole !== 'Super Admin') {
      return { success: false, error: 'Cannot downgrade the Super Admin role.' };
    }

    target.Role = newRole;
    csvStorage.saveAllUsers(users);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_UPDATE_ROLE',
      userEmail,
      `Super Admin promoted/changed ${userEmail} role to ${newRole}`
    );

    return { success: true, role: newRole };
  },

  // Impersonate / switch session to user
  impersonateUser: (userEmail) => {
    const users = csvStorage.getUsers();
    const target = users.find((u) => u.Email.toLowerCase() === userEmail.toLowerCase());
    if (!target) return null;

    const userObj = {
      id: target.ID,
      name: target.Name,
      email: target.Email,
      role: target.Role
    };
    csvStorage.setActiveUser(userObj);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_IMPERSONATE',
      userEmail,
      `Super Admin logged into workspace as ${target.Name} (${userEmail})`
    );

    return userObj;
  },

  // Restore Super Admin session
  restoreSuperAdminSession: () => {
    const adminUser = {
      id: 'usr_1',
      name: adminService.SUPER_ADMIN_NAME,
      email: 'daloutrashavit@gmail.com',
      role: 'Super Admin',
      orgId: adminService.SUPER_ADMIN_ORG_ID
    };
    csvStorage.setActiveUser(adminUser);
    return adminUser;
  },

  // TRANSACTIONS
  getTransactions: () => {
    try {
      const raw = localStorage.getItem(ADMIN_TRANSACTIONS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_TRANSACTIONS;
    } catch {
      return DEFAULT_TRANSACTIONS;
    }
  },

  saveTransactions: (txns) => {
    localStorage.setItem(ADMIN_TRANSACTIONS_KEY, JSON.stringify(txns));
  },

  // Refund transaction (clearly simulated in demo mode)
  refundTransaction: (txnId, reason = 'Customer requested refund') => {
    const txns = adminService.getTransactions();
    const target = txns.find((t) => t.id === txnId);
    if (!target) return { success: false, error: 'Transaction not found.' };

    target.status = 'Refunded';
    target.refundReason = reason;
    target.refundedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    adminService.saveTransactions(txns);

    csvRepository.logAction(
      target.workspaceId || 'ws_1',
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_REFUND_TRANSACTION',
      txnId,
      `Super Admin processed simulated refund for ${txnId} ($${target.amount}). Reason: ${reason}`
    );

    return { success: true, transaction: target };
  },

  // SUBSCRIPTIONS GOVERNANCE
  getSubscriptions: () => {
    const users = adminService.getAllUsersDetailed();
    return users.map((u, i) => {
      let status = 'Active';
      if (u.status === 'Suspended') status = 'Suspended';
      else if (u.plan === 'Free') status = 'Active Free';

      return {
        id: `sub_${1000 + i}`,
        userEmail: u.email,
        userName: u.name,
        workspaceName: u.workspaceName,
        plan: u.plan,
        status,
        startDate: u.createdAt || '2026-09-01',
        renewalDate: '2026-10-29',
        billingStatus: u.plan === 'Free' ? 'None (Free Plan)' : 'Paid (Auto-renews)',
        isSuperAdmin: u.isSuperAdmin
      };
    });
  },

  updateSubscriptionPlan: (userEmail, newPlan, reason = 'Super Admin plan change') => {
    const meta = adminService.getUsersMeta();
    const currentMeta = meta[userEmail] || {};
    currentMeta.plan = newPlan;
    meta[userEmail] = currentMeta;
    adminService.saveUsersMeta(meta);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_CHANGE_PLAN',
      userEmail,
      `Super Admin overrode subscription plan for ${userEmail} to "${newPlan}". Reason: ${reason}`
    );

    return { success: true, plan: newPlan };
  },

  grantTrial: (userEmail, days = 14) => {
    const meta = adminService.getUsersMeta();
    const currentMeta = meta[userEmail] || {};
    currentMeta.plan = `Pro Trial (${days} Days)`;
    meta[userEmail] = currentMeta;
    adminService.saveUsersMeta(meta);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_GRANT_TRIAL',
      userEmail,
      `Super Admin granted ${days}-day Pro Trial to ${userEmail}`
    );

    return { success: true };
  },

  // SOCIAL ACCOUNTS PLATFORM-WIDE
  getGlobalSocialAccounts: () => {
    const accounts = csvRepository.getSocialAccounts();
    const allUsers = adminService.getAllUsersDetailed();

    return accounts.map((acc) => {
      const owner = allUsers[0]?.name || 'Creator';
      return {
        ...acc,
        OwnerName: owner,
        Health: acc.Status === 'Connected' ? 'Healthy' : 'Needs Reconnection'
      };
    });
  },

  disconnectSocialAccountAdmin: (accountId, reason = 'Super Admin security disconnection') => {
    csvRepository.removeSocialAccount(accountId);
    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_DISCONNECT_SOCIAL',
      accountId,
      `Super Admin disconnected social account ID ${accountId}. Reason: ${reason}`
    );
    return { success: true };
  },

  // POSTS PLATFORM-WIDE
  getGlobalPosts: () => {
    const posts = csvStorage.getPosts();
    const drafts = csvStorage.getDrafts();

    const formattedPosts = posts.map((p) => {
      return {
        id: p.ID,
        userEmail: p.UserEmail,
        platform: p.Platform,
        status: p.Status || 'Published',
        charCount: Number(p.CharCount) || p.Content?.length || 0,
        maxChars: Number(p.MaxChars) || 280,
        scheduledFor: p.ScheduledFor,
        publishedAt: p.PublishedAt,
        content: p.Content,
        mediaUrl: p.MediaUrl,
        isValidLength: (Number(p.CharCount) || p.Content?.length || 0) <= (Number(p.MaxChars) || 280),
        isDraft: false
      };
    });

    const formattedDrafts = drafts.map((d) => {
      return {
        id: d.ID,
        userEmail: d.UserEmail,
        platform: d.Platform,
        status: 'Draft',
        charCount: d.Content?.length || 0,
        maxChars: 280,
        scheduledFor: null,
        publishedAt: null,
        content: d.Content,
        mediaUrl: null,
        isValidLength: true,
        isDraft: true
      };
    });

    return [...formattedPosts, ...formattedDrafts];
  },

  approvePostAdmin: (postId) => {
    const posts = csvStorage.getPosts();
    const target = posts.find((p) => p.ID === postId);
    if (!target) return { success: false, error: 'Post not found.' };

    target.Status = 'Published';
    target.PublishedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    csvStorage.saveAllPosts(posts);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_APPROVE_POST',
      postId,
      `Super Admin approved and released publication for post ${postId}`
    );

    return { success: true };
  },

  rejectPostAdmin: (postId, reason = 'Violates editorial standards') => {
    const posts = csvStorage.getPosts();
    const target = posts.find((p) => p.ID === postId);
    if (!target) return { success: false, error: 'Post not found.' };

    target.Status = 'Rejected';
    target.RejectionReason = reason;
    csvStorage.saveAllPosts(posts);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_REJECT_POST',
      postId,
      `Super Admin rejected post ${postId}. Reason: ${reason}`
    );

    return { success: true };
  },

  cancelScheduleAdmin: (postId) => {
    const posts = csvStorage.getPosts();
    const target = posts.find((p) => p.ID === postId);
    if (!target) return { success: false, error: 'Post not found.' };

    target.Status = 'Draft';
    target.ScheduledFor = '';
    csvStorage.saveAllPosts(posts);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_CANCEL_SCHEDULE',
      postId,
      `Super Admin cancelled scheduled release for post ${postId}`
    );

    return { success: true };
  },

  deletePostAdmin: (postId) => {
    csvStorage.deletePost(postId);
    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_DELETE_POST',
      postId,
      `Super Admin deleted post ${postId}`
    );
    return { success: true };
  },

  // CAMPAIGNS PLATFORM-WIDE
  getGlobalCampaigns: () => {
    return csvRepository.getCampaigns();
  },

  updateCampaignStatusAdmin: (campaignId, newStatus) => {
    const camps = csvRepository.getCampaigns();
    const target = camps.find((c) => c.ID === campaignId);
    if (!target) return { success: false, error: 'Campaign not found' };

    target.Status = newStatus;
    localStorage.setItem(
      'csv_campaigns_database',
      `ID,WorkspaceId,Name,Description,Status,StartDate,EndDate,Platforms,Tags\r\n` +
      camps.map((c) => `"${c.ID}","${c.WorkspaceId}","${c.Name}","${c.Description}","${c.Status}","${c.StartDate}","${c.EndDate}","${c.Platforms}","${c.Tags}"`).join('\r\n')
    );

    csvRepository.logAction(
      target.WorkspaceId || 'ws_1',
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_CAMPAIGN_STATUS',
      campaignId,
      `Super Admin changed campaign status to ${newStatus}`
    );

    return { success: true };
  },

  // MEDIA PLATFORM-WIDE
  getGlobalMedia: () => {
    return csvRepository.getMedia();
  },

  deleteMediaAdmin: (mediaId) => {
    csvRepository.deleteMedia(mediaId);
    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_DELETE_MEDIA',
      mediaId,
      `Super Admin deleted media asset ${mediaId}`
    );
    return { success: true };
  },

  // FEATURE FLAGS
  getFeatureFlags: () => {
    try {
      const raw = localStorage.getItem(ADMIN_FEATURE_FLAGS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_FEATURE_FLAGS;
    } catch {
      return DEFAULT_FEATURE_FLAGS;
    }
  },

  toggleFeatureFlag: (flagId, enabled) => {
    const flags = adminService.getFeatureFlags();
    const target = flags.find((f) => f.id === flagId);
    if (!target) return { success: false, error: 'Feature flag not found.' };

    target.enabled = enabled;
    target.lastUpdated = new Date().toISOString().replace('T', ' ').slice(0, 19);
    target.updatedBy = adminService.SUPER_ADMIN_NAME;
    localStorage.setItem(ADMIN_FEATURE_FLAGS_KEY, JSON.stringify(flags));

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_TOGGLE_FLAG',
      flagId,
      `Super Admin set feature flag "${target.name}" to ${enabled ? 'ENABLED' : 'DISABLED'}`
    );

    return { success: true, flag: target };
  },

  // PLATFORM SETTINGS
  getPlatformSettings: () => {
    try {
      const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updatePlatformSettings: (settingsUpdates) => {
    const current = adminService.getPlatformSettings();
    const updated = {
      ...current,
      ...settingsUpdates,
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedBy: adminService.SUPER_ADMIN_NAME
    };
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(updated));

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_UPDATE_SETTINGS',
      'platform_settings',
      `Super Admin updated platform configuration settings.`
    );

    return { success: true, settings: updated };
  },

  // SECURITY CENTER & ALERTS
  getSecurityAlerts: () => {
    try {
      const raw = localStorage.getItem(ADMIN_SECURITY_ALERTS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_SECURITY_ALERTS;
    } catch {
      return DEFAULT_SECURITY_ALERTS;
    }
  },

  resolveSecurityAlert: (alertId) => {
    const alerts = adminService.getSecurityAlerts();
    const target = alerts.find((a) => a.id === alertId);
    if (!target) return { success: false };

    target.resolved = true;
    localStorage.setItem(ADMIN_SECURITY_ALERTS_KEY, JSON.stringify(alerts));

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_RESOLVE_ALERT',
      alertId,
      `Super Admin marked security alert "${target.title}" as resolved.`
    );

    return { success: true };
  },

  // LOGIN ACTIVITY
  getLoginActivity: () => {
    try {
      const raw = localStorage.getItem(ADMIN_LOGIN_ACTIVITY_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_LOGIN_ACTIVITY;
    } catch {
      return DEFAULT_LOGIN_ACTIVITY;
    }
  },

  // ADMIN NOTIFICATIONS
  getAdminNotifications: () => {
    try {
      const raw = localStorage.getItem(ADMIN_NOTIFICATIONS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_ADMIN_NOTIFICATIONS;
    } catch {
      return DEFAULT_ADMIN_NOTIFICATIONS;
    }
  },

  markAdminNotificationRead: (id) => {
    const notifs = adminService.getAdminNotifications();
    const target = notifs.find((n) => n.id === id);
    if (target) {
      target.read = true;
      localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(notifs));
    }
    return { success: true };
  },

  markAllAdminNotificationsRead: () => {
    const notifs = adminService.getAdminNotifications().map((n) => ({ ...n, read: true }));
    localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(notifs));
    return { success: true };
  },

  deleteAdminNotification: (id) => {
    const notifs = adminService.getAdminNotifications().filter((n) => n.id !== id);
    localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(notifs));
    return { success: true };
  },

  // SYSTEM HEALTH
  getSystemHealth: () => {
    return [
      {
        service: 'Authentication Engine',
        status: 'Operational',
        latency: '18ms',
        details: 'Clerk Cloud JWT & Local RFC-4180 CSV Fallback online',
        isSimulated: false
      },
      {
        service: 'Local CSV Storage Layer',
        status: 'Operational',
        latency: '2ms',
        details: 'LocalStorage tables (users, posts, drafts, media, audit) healthy',
        isSimulated: false
      },
      {
        service: 'Asset Storage Engine',
        status: 'Operational',
        latency: '45ms',
        details: 'Simulated CDN media asset repository active',
        isSimulated: true
      },
      {
        service: 'Social APIs (Meta, LinkedIn, X, YT)',
        status: 'Operational',
        latency: '94ms',
        details: 'Publishing & character validation sandbox simulated',
        isSimulated: true
      },
      {
        service: 'Email & Notification Dispatcher',
        status: 'Operational',
        latency: '31ms',
        details: 'Internal notification queues operating normally',
        isSimulated: true
      },
      {
        service: 'Background Cron & Job Scheduler',
        status: 'Operational',
        latency: '5ms',
        details: 'Post queue timers and heartbeat check healthy',
        isSimulated: false
      }
    ];
  },

  // Global activity audit logs across all workspaces
  getGlobalAuditLogs: () => {
    return csvRepository.getAuditLogs();
  }
};
