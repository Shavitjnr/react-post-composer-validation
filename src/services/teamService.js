/**
 * Post Composer Pro — Team Management & Role Permissions Service
 * Roles: Owner, Admin, Manager, Editor, Creator, Viewer
 */
import { workspaceService } from './workspaceService';
import { csvRepository } from '../repositories/csvRepository';
import { SUBSCRIPTION_PLANS } from '../constants/subscriptionPlans';
import { notificationService } from './notificationService';

const TEAM_MEMBERS_KEY = 'pcp_team_members_db';

const DEFAULT_TEAM = [
  {
    id: 'mem_1',
    workspaceId: 'ws_1',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'Owner',
    status: 'Active',
    lastActive: 'Just now',
    avatar: 'AM',
  },
  {
    id: 'mem_2',
    workspaceId: 'ws_1',
    name: 'Sarah Connor',
    email: 'sarah@tech.org',
    role: 'Editor',
    status: 'Active',
    lastActive: '2 hours ago',
    avatar: 'SC',
  },
  {
    id: 'mem_3',
    workspaceId: 'ws_1',
    name: 'David Chen',
    email: 'david@startup.io',
    role: 'Creator',
    status: 'Active',
    lastActive: 'Yesterday',
    avatar: 'DC',
  },
  {
    id: 'mem_4',
    workspaceId: 'ws_1',
    name: 'Elena Rostova',
    email: 'elena@agency.co',
    role: 'Manager',
    status: 'Active',
    lastActive: '3 days ago',
    avatar: 'ER',
  },
];

export const teamService = {
  getTeamMembers: (workspaceId = null) => {
    const wsId = workspaceId || workspaceService.getActiveWorkspaceId();
    try {
      const raw = localStorage.getItem(TEAM_MEMBERS_KEY);
      const all = raw ? JSON.parse(raw) : DEFAULT_TEAM;
      return all.filter((m) => m.workspaceId === wsId);
    } catch (e) {
      return DEFAULT_TEAM.filter((m) => m.workspaceId === wsId);
    }
  },

  getAllMembers: () => {
    try {
      const raw = localStorage.getItem(TEAM_MEMBERS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_TEAM;
    } catch (e) {
      return DEFAULT_TEAM;
    }
  },

  inviteMember: ({ name, email, role }) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const activeWs = workspaceService.getActiveWorkspace();
    const planConfig = SUBSCRIPTION_PLANS[activeWs.Plan?.toUpperCase()] || SUBSCRIPTION_PLANS.PROFESSIONAL;

    const currentMembers = teamService.getTeamMembers(wsId);
    if (currentMembers.length >= planConfig.limits.teamMembers) {
      return {
        success: false,
        error: `Team capacity reached: Your ${planConfig.name} plan includes max ${planConfig.limits.teamMembers} team members. Upgrade plan to invite more collaborators.`,
      };
    }

    if (currentMembers.some((m) => m.email.toLowerCase() === email.trim().toLowerCase())) {
      return { success: false, error: 'A team member with this email already exists in this workspace.' };
    }

    const all = teamService.getAllMembers();
    const newMember = {
      id: `mem_${Date.now()}`,
      workspaceId: wsId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || 'Creator',
      status: 'Active',
      lastActive: 'Invited just now',
      avatar: name.trim().split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
    };

    all.push(newMember);
    localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(all));
    csvRepository.logAction(wsId, 'alex@example.com', 'INVITE_MEMBER', newMember.id, `Invited ${newMember.name} as ${newMember.role}`);
    notificationService.notify(
      wsId,
      'New Team Member',
      `${newMember.name} has been added to the team workspace.`,
      'info'
    );

    return { success: true, member: newMember };
  },

  updateRole: (memberId, newRole) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    const all = teamService.getAllMembers();
    const target = all.find((m) => m.id === memberId);
    if (target) {
      target.role = newRole;
      localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(all));
      csvRepository.logAction(wsId, 'alex@example.com', 'UPDATE_ROLE', memberId, `Changed role to ${newRole}`);
      return { success: true };
    }
    return { success: false, error: 'Member not found' };
  },

  removeMember: (memberId) => {
    const wsId = workspaceService.getActiveWorkspaceId();
    let all = teamService.getAllMembers();
    const target = all.find((m) => m.id === memberId);
    if (target && target.role === 'Owner') {
      return { success: false, error: 'Cannot remove the workspace Owner.' };
    }
    all = all.filter((m) => m.id !== memberId);
    localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(all));
    csvRepository.logAction(wsId, 'alex@example.com', 'REMOVE_MEMBER', memberId, 'Removed member from workspace');
    return { success: true };
  },

  // Role permissions checking
  canPerform: (userRole, action) => {
    const permissions = {
      Owner: ['create_post', 'edit_post', 'delete_post', 'publish', 'schedule', 'approve', 'manage_team', 'manage_accounts', 'billing'],
      Admin: ['create_post', 'edit_post', 'delete_post', 'publish', 'schedule', 'approve', 'manage_team', 'manage_accounts'],
      Manager: ['create_post', 'edit_post', 'publish', 'schedule', 'approve', 'manage_accounts'],
      Editor: ['create_post', 'edit_post', 'schedule', 'submit_review'],
      Creator: ['create_post', 'edit_post', 'submit_review'],
      Viewer: ['view_only'],
    };
    return (permissions[userRole] || permissions.Creator).includes(action);
  },
};
