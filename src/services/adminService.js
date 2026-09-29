import { csvStorage } from '../utils/csvStorage';
import { csvRepository } from '../repositories/csvRepository';
import { workspaceService } from './workspaceService';

const ADMIN_USERS_EXTRA_KEY = 'pcp_admin_users_meta_db';

const DEFAULT_USERS_META = {
  'shavitdaloutra28@gmail.com': {
    verified: true,
    status: 'Active',
    username: 'shavitdaloutra',
    connectedAccounts: ['Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'YouTube'],
    lastLogin: 'Just now',
    ipAddress: '192.168.1.100',
    device: 'Desktop (Windows / Chrome)'
  },
  'sarah@tech.org': {
    verified: true,
    status: 'Active',
    username: 'sarah_connor',
    connectedAccounts: ['LinkedIn', 'Twitter'],
    lastLogin: '2 hours ago',
    ipAddress: '192.168.1.105',
    device: 'Laptop (MacOS / Safari)'
  },
  'david@startup.io': {
    verified: false,
    status: 'Active',
    username: 'david_chen',
    connectedAccounts: ['Twitter'],
    lastLogin: 'Yesterday',
    ipAddress: '10.0.0.42',
    device: 'Mobile (Android / Chrome)'
  }
};

export const adminService = {
  // Super Admin identification
  SUPER_ADMIN_EMAIL: 'shavitdaloutra28@gmail.com',
  SUPER_ADMIN_NAME: 'Shavit Daloutra',
  SUPER_ADMIN_USER: 'shavitdaloutra',

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

  // Returns consolidated user list with CSV data, post stats, and verification status
  getAllUsersDetailed: () => {
    const rawCsvUsers = csvStorage.getUsers();
    const meta = adminService.getUsersMeta();
    const allPosts = csvStorage.getPosts();
    const allDrafts = csvStorage.getDrafts();

    return rawCsvUsers.map((u) => {
      const userMeta = meta[u.Email] || {
        verified: false,
        status: 'Active',
        username: u.Email.split('@')[0],
        connectedAccounts: ['Twitter'],
        lastLogin: '2 hours ago',
        ipAddress: '192.168.1.50',
        device: 'Desktop (Browser)'
      };

      const userPosts = allPosts.filter((p) => p.UserEmail?.toLowerCase() === u.Email?.toLowerCase());
      const userDrafts = allDrafts.filter((d) => d.UserEmail?.toLowerCase() === u.Email?.toLowerCase());

      const isSuperAdmin = u.Email.toLowerCase() === adminService.SUPER_ADMIN_EMAIL.toLowerCase() || u.Role === 'Super Admin';

      return {
        id: u.ID,
        name: u.Name,
        email: u.Email,
        password: u.Password,
        role: isSuperAdmin ? 'Super Admin' : u.Role || 'Member',
        createdAt: u.CreatedAt,
        isSuperAdmin,
        verified: isSuperAdmin ? true : !!userMeta.verified,
        status: userMeta.status || 'Active',
        username: userMeta.username || u.Email.split('@')[0],
        connectedAccounts: userMeta.connectedAccounts || [],
        lastLogin: userMeta.lastLogin || 'Recent',
        ipAddress: userMeta.ipAddress || '127.0.0.1',
        device: userMeta.device || 'Web Client',
        postsCount: userPosts.length,
        draftsCount: userDrafts.length
      };
    });
  },

  // Toggle user verification
  toggleUserVerification: (userEmail) => {
    if (userEmail.toLowerCase() === adminService.SUPER_ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: 'Super Admin is permanently verified.' };
    }

    const meta = adminService.getUsersMeta();
    const current = meta[userEmail] || { verified: false, status: 'Active' };
    current.verified = !current.verified;
    meta[userEmail] = current;
    adminService.saveUsersMeta(meta);

    csvRepository.logAction(
      workspaceService.getActiveWorkspaceId(),
      adminService.SUPER_ADMIN_EMAIL,
      'ADMIN_TOGGLE_VERIFY',
      userEmail,
      `Super Admin changed verification for ${userEmail} to ${current.verified ? 'VERIFIED' : 'UNVERIFIED'}`
    );

    return { success: true, verified: current.verified };
  },

  // Toggle user account suspension
  toggleUserStatus: (userEmail) => {
    if (userEmail.toLowerCase() === adminService.SUPER_ADMIN_EMAIL.toLowerCase()) {
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

    if (userEmail.toLowerCase() === adminService.SUPER_ADMIN_EMAIL.toLowerCase() && newRole !== 'Super Admin') {
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
      email: adminService.SUPER_ADMIN_EMAIL,
      role: 'Super Admin'
    };
    csvStorage.setActiveUser(adminUser);
    return adminUser;
  },

  // Global activity audit logs across all workspaces
  getGlobalAuditLogs: () => {
    return csvRepository.getAuditLogs();
  }
};
