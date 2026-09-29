import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Activity,
  Database,
  Building2,
  Share2,
  FileText,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  ExternalLink,
  Search,
  Plus,
  ArrowLeft,
  RefreshCw,
  LogOut,
  Laptop,
  Check,
  ChevronRight,
  CreditCard,
  Flag,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  BarChart3,
  FileCheck,
  ShieldAlert,
  Clock,
  Settings,
  Cpu,
  Bell,
  Trash2,
  Edit3,
  Eye,
  CheckCircle,
  TrendingUp,
  Sliders,
  DollarSign,
  AlertCircle,
  X,
  Info
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { workspaceService } from '../services/workspaceService';
import { csvStorage } from '../utils/csvStorage';

export function SuperAdminDashboard({
  onNavigateToPanel,
  onNavigateToHome,
  onLogout,
  onImpersonateSuccess,
  showToast
}) {
  // Navigation State (20 Modules)
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Global Data States
  const [usersList, setUsersList] = useState([]);
  const [workspacesList, setWorkspacesList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [socialAccountsList, setSocialAccountsList] = useState([]);
  const [postsList, setPostsList] = useState([]);
  const [campaignsList, setCampaignsList] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [featureFlags, setFeatureFlags] = useState([]);
  const [platformSettings, setPlatformSettings] = useState({});
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [loginActivity, setLoginActivity] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [systemHealth, setSystemHealth] = useState([]);

  // UI / Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all'); // 'all' | 'Verified' | 'Pending' | 'Revoked'
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [postPlatformFilter, setPostPlatformFilter] = useState('all');
  const [showGlobalSearchModal, setShowGlobalSearchModal] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  // Modals & Action Dialogs
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [userDetailsTab, setUserDetailsTab] = useState('overview');
  const [userForEdit, setUserForEdit] = useState(null);
  const [userForDelete, setUserForDelete] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [userForPlanChange, setUserForPlanChange] = useState(null);
  const [selectedNewPlan, setSelectedNewPlan] = useState('Professional');
  const [userForVerificationModal, setUserForVerificationModal] = useState(null);
  const [verificationReason, setVerificationReason] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('pass1234');
  const [newUserRole, setNewUserRole] = useState('Editor');
  const [selectedPostForDetails, setSelectedPostForDetails] = useState(null);
  const [selectedPostForReject, setSelectedPostForReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedTxnForRefund, setSelectedTxnForRefund] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  // Refresh all data dynamically from service layer
  const loadAllAdminData = () => {
    setUsersList(adminService.getAllUsersDetailed());
    setWorkspacesList(workspaceService.getAllWorkspaces());
    setAuditLogs(adminService.getGlobalAuditLogs());
    setTransactionsList(adminService.getTransactions());
    setSocialAccountsList(adminService.getGlobalSocialAccounts());
    setPostsList(adminService.getGlobalPosts());
    setCampaignsList(adminService.getGlobalCampaigns());
    setMediaList(adminService.getGlobalMedia());
    setFeatureFlags(adminService.getFeatureFlags());
    setPlatformSettings(adminService.getPlatformSettings());
    setSecurityAlerts(adminService.getSecurityAlerts());
    setLoginActivity(adminService.getLoginActivity());
    setAdminNotifications(adminService.getAdminNotifications());
    setSystemHealth(adminService.getSystemHealth());
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Handlers for Sensitive Actions
  const handleToggleVerification = (email, nextStatus, reason = '') => {
    const res = adminService.setUserVerificationState(email, nextStatus, reason);
    if (res.success) {
      showToast(`User ${email} verification updated to ${nextStatus}`, 'success');
      loadAllAdminData();
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleToggleUserStatus = (email) => {
    const res = adminService.toggleUserStatus(email);
    if (res.success) {
      showToast(`User ${email} status changed to ${res.status}`, 'info');
      loadAllAdminData();
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleConfirmEditUser = (e) => {
    e.preventDefault();
    if (!userForEdit) return;
    const res = adminService.updateUserProfile(userForEdit.email, {
      name: userForEdit.name,
      role: userForEdit.role,
      status: userForEdit.status
    });
    if (res.success) {
      showToast(`User ${userForEdit.email} profile updated successfully`, 'success');
      setUserForEdit(null);
      loadAllAdminData();
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleConfirmDeleteUser = () => {
    if (!userForDelete) return;
    if (deleteConfirmationText.trim().toLowerCase() !== 'delete') {
      showToast('Please type DELETE to confirm deletion', 'error');
      return;
    }
    const res = adminService.deleteUser(userForDelete.email, 'Super Admin removal via Users dashboard');
    if (res.success) {
      showToast(`User ${userForDelete.name} (${userForDelete.email}) deleted from system`, 'info');
      setUserForDelete(null);
      setDeleteConfirmationText('');
      loadAllAdminData();
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleConfirmChangePlan = () => {
    if (!userForPlanChange) return;
    const res = adminService.updateSubscriptionPlan(userForPlanChange.email, selectedNewPlan, 'Admin override');
    if (res.success) {
      showToast(`Updated ${userForPlanChange.email} plan to ${selectedNewPlan}`, 'success');
      setUserForPlanChange(null);
      loadAllAdminData();
    } else {
      showToast('Failed to update plan', 'error');
    }
  };

  const handleImpersonate = (email) => {
    const user = adminService.impersonateUser(email);
    if (user) {
      showToast(`Switched active session to ${user.name} (${user.email}). Redirecting to /Pannel...`, 'info');
      if (onImpersonateSuccess) onImpersonateSuccess(user);
      onNavigateToPanel();
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }
    const res = csvStorage.registerUser(newUserName.trim(), newUserEmail.trim(), newUserPassword, newUserRole);
    if (res.success) {
      showToast(`User ${newUserName} created and verified!`, 'success');
      setIsAddUserModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      loadAllAdminData();
    } else {
      showToast(res.error || 'Failed to create user', 'error');
    }
  };

  const handleToggleFeatureFlag = (flagId, currentEnabled) => {
    const res = adminService.toggleFeatureFlag(flagId, !currentEnabled);
    if (res.success) {
      showToast(`Feature flag ${res.flag.name} is now ${!currentEnabled ? 'ENABLED' : 'DISABLED'}`, 'info');
      loadAllAdminData();
    }
  };

  const handleSavePlatformSettings = (e) => {
    e.preventDefault();
    adminService.updatePlatformSettings(platformSettings);
    showToast('Platform configuration settings saved & logged', 'success');
    loadAllAdminData();
  };

  const handleApprovePost = (postId) => {
    const res = adminService.approvePostAdmin(postId);
    if (res.success) {
      showToast(`Post ${postId} approved and published`, 'success');
      loadAllAdminData();
    }
  };

  const handleConfirmRejectPost = () => {
    if (!selectedPostForReject) return;
    const res = adminService.rejectPostAdmin(selectedPostForReject.id, rejectReason || 'Administrative editorial reject');
    if (res.success) {
      showToast(`Post ${selectedPostForReject.id} rejected`, 'info');
      setSelectedPostForReject(null);
      setRejectReason('');
      loadAllAdminData();
    }
  };

  const handleCancelPostSchedule = (postId) => {
    const res = adminService.cancelScheduleAdmin(postId);
    if (res.success) {
      showToast(`Scheduled post ${postId} cancelled and reverted to draft`, 'info');
      loadAllAdminData();
    }
  };

  const handleDeletePost = (postId) => {
    if (window.confirm(`Delete post ${postId}? This cannot be undone.`)) {
      adminService.deletePostAdmin(postId);
      showToast(`Post ${postId} deleted`, 'info');
      loadAllAdminData();
    }
  };

  const handleConfirmRefund = () => {
    if (!selectedTxnForRefund) return;
    const res = adminService.refundTransaction(selectedTxnForRefund.id, refundReason || 'Customer requested refund');
    if (res.success) {
      showToast(`Transaction ${selectedTxnForRefund.id} marked as Refunded (Simulated)`, 'success');
      setSelectedTxnForRefund(null);
      setRefundReason('');
      loadAllAdminData();
    }
  };

  const handleDisconnectSocial = (accountId) => {
    if (window.confirm(`Disconnect social account ID ${accountId}?`)) {
      adminService.disconnectSocialAccountAdmin(accountId);
      showToast(`Social account ${accountId} disconnected`, 'info');
      loadAllAdminData();
    }
  };

  const handleDeleteMedia = (mediaId) => {
    if (window.confirm(`Permanently remove media asset ${mediaId}?`)) {
      adminService.deleteMediaAdmin(mediaId);
      showToast(`Media asset ${mediaId} deleted`, 'info');
      loadAllAdminData();
    }
  };

  const handleResolveAlert = (alertId) => {
    adminService.resolveSecurityAlert(alertId);
    showToast('Security alert marked as resolved', 'success');
    loadAllAdminData();
  };

  // Calculations for Platform Overview
  const totalUsers = usersList.length;
  const verifiedUsersCount = usersList.filter((u) => u.verificationStatus === 'Verified').length;
  const pendingUsersCount = usersList.filter((u) => u.verificationStatus === 'Pending').length;
  const revokedUsersCount = usersList.filter((u) => u.verificationStatus === 'Revoked').length;
  const suspendedUsersCount = usersList.filter((u) => u.status === 'Suspended').length;
  const activeWorkspacesCount = workspacesList.length;
  const totalSocialAccountsCount = socialAccountsList.length;
  const publishedPostsCount = postsList.filter((p) => p.status === 'Published').length;
  const scheduledPostsCount = postsList.filter((p) => p.status === 'Scheduled').length;
  const draftPostsCount = postsList.filter((p) => p.status === 'Draft').length;
  const activeCampaignsCount = campaignsList.filter((c) => c.Status === 'Active' || c.Status === 'Running').length;
  const successfulTxns = transactionsList.filter((t) => t.status === 'Success');
  const totalRevenue = successfulTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const unreadAdminNotifs = adminNotifications.filter((n) => !n.read).length;
  const unresolvedAlerts = securityAlerts.filter((a) => !a.resolved).length;

  // Sidebar Items Definition (20 Modules)
  const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: ShieldCheck, group: 'CORE' },
    { id: 'users', label: 'Users', icon: Users, badge: totalUsers, group: 'CORE' },
    { id: 'workspaces', label: 'Workspaces', icon: Building2, badge: activeWorkspacesCount, group: 'CORE' },
    { id: 'verification', label: 'Verification', icon: FileCheck, badge: pendingUsersCount, group: 'CORE' },

    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, group: 'FINANCIAL & CHANNELS' },
    { id: 'transactions', label: 'Transactions', icon: DollarSign, badge: transactionsList.length, group: 'FINANCIAL & CHANNELS' },
    { id: 'social_accounts', label: 'Social Accounts', icon: Share2, badge: totalSocialAccountsCount, group: 'FINANCIAL & CHANNELS' },

    { id: 'posts', label: 'Posts', icon: FileText, badge: postsList.length, group: 'CONTENT & ASSETS' },
    { id: 'campaigns', label: 'Campaigns', icon: Flag, badge: campaignsList.length, group: 'CONTENT & ASSETS' },
    { id: 'media', label: 'Media', icon: ImageIcon, badge: mediaList.length, group: 'CONTENT & ASSETS' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, group: 'CONTENT & ASSETS' },

    { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'INTELLIGENCE & SECURITY' },
    { id: 'audit_logs', label: 'Audit Logs', icon: Activity, badge: auditLogs.length, group: 'INTELLIGENCE & SECURITY' },
    { id: 'security_center', label: 'Security Center', icon: ShieldAlert, alert: unresolvedAlerts > 0, group: 'INTELLIGENCE & SECURITY' },
    { id: 'login_activity', label: 'Login Activity', icon: Clock, group: 'INTELLIGENCE & SECURITY' },
    { id: 'admin_activity', label: 'Admin Activity', icon: Lock, group: 'INTELLIGENCE & SECURITY' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadAdminNotifs, group: 'INTELLIGENCE & SECURITY' },

    { id: 'settings', label: 'Platform Settings', icon: Settings, group: 'SYSTEM & INFRASTRUCTURE' },
    { id: 'feature_flags', label: 'Feature Flags', icon: Sliders, group: 'SYSTEM & INFRASTRUCTURE' },
    { id: 'system_health', label: 'System Health', icon: Cpu, group: 'SYSTEM & INFRASTRUCTURE' },
  ];

  // Global Search Filtered Results
  const globalSearchResults = {
    users: usersList.filter((u) =>
      (u.name || '').toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(globalSearchQuery.toLowerCase())
    ),
    workspaces: workspacesList.filter((w) =>
      (w.Name || w.name || '').toLowerCase().includes(globalSearchQuery.toLowerCase())
    ),
    posts: postsList.filter((p) =>
      (p.content || '').toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      (p.userEmail || '').toLowerCase().includes(globalSearchQuery.toLowerCase())
    ),
    campaigns: campaignsList.filter((c) =>
      (c.Name || c.name || '').toLowerCase().includes(globalSearchQuery.toLowerCase())
    ),
    transactions: transactionsList.filter((t) =>
      (t.id || '').toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      (t.userEmail || '').toLowerCase().includes(globalSearchQuery.toLowerCase())
    )
  };

  return (
    <div className="admin-enterprise-layout">
      {/* 1. SUPER ADMIN SIDEBAR */}
      <aside className={`admin-enterprise-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Brand & Authority Header */}
        <div className="admin-sidebar-header">
          <div className="admin-brand-cluster">
            <div className="admin-brand-icon">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <strong className="admin-brand-title">PERSONAL BRAND</strong>
                <span className="admin-crown-badge">👑 SUPER ADMIN (ROOT)</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items Grouped */}
        <div className="admin-sidebar-nav">
          {['CORE', 'FINANCIAL & CHANNELS', 'CONTENT & ASSETS', 'INTELLIGENCE & SECURITY', 'SYSTEM & INFRASTRUCTURE'].map((group) => {
            const items = SIDEBAR_ITEMS.filter((item) => item.group === group);
            return (
              <div key={group} className="admin-nav-group-block">
                {!sidebarCollapsed && <span className="admin-group-title">{group}</span>}
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveModule(item.id)}
                      className={`admin-nav-button ${isActive ? 'active' : ''}`}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4 nav-icon" />
                      {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                      {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                        <span className="nav-badge-pill">{item.badge}</span>
                      )}
                      {!sidebarCollapsed && item.alert && (
                        <span className="nav-alert-dot" />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer with Session Information */}
        <div className="admin-sidebar-footer">
          {!sidebarCollapsed && (
            <div className="admin-session-box">
              <div className="admin-avatar-chip">SD</div>
              <div className="admin-session-text">
                <strong>{adminService.SUPER_ADMIN_NAME}</strong>
                <span className="session-email">{adminService.SUPER_ADMIN_EMAIL}</span>
                <span className="session-role-tag">Super Admin • Root Access</span>
              </div>
            </div>
          )}

          <div className="admin-footer-links">
            <button
              type="button"
              onClick={onNavigateToPanel}
              className="btn-admin-switch-workspace"
              title="Open Personal Workspace Panel"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {!sidebarCollapsed && <span>Switch to Panel (/Pannel)</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN ADMIN VIEW AREA */}
      <div className="admin-enterprise-main">
        {/* Top Navbar */}
        <header className="admin-top-header">
          <div className="top-left-meta">
            <div className="breadcrumb-path">
              <span>Super Admin</span>
              <span className="crumb-sep">/</span>
              <strong className="crumb-active">
                {SIDEBAR_ITEMS.find((i) => i.id === activeModule)?.label || 'Dashboard'}
              </strong>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="top-global-search">
            <div
              className="global-search-trigger"
              onClick={() => setShowGlobalSearchModal(true)}
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search users, workspaces, posts, transactions, logs...</span>
              <kbd className="search-kbd">⌘K</kbd>
            </div>
          </div>

          {/* Controls & Profile Action Cluster */}
          <div className="top-right-controls">
            {/* Security Alert Pill */}
            <button
              type="button"
              onClick={() => setActiveModule('security_center')}
              className={`security-indicator-pill ${unresolvedAlerts > 0 ? 'has-alerts' : 'healthy'}`}
              title="Security Center Health"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{unresolvedAlerts > 0 ? `${unresolvedAlerts} Security Alerts` : 'Security 100%'}</span>
            </button>

            {/* Notifications Popover Button */}
            <div className="relative-dropdown-wrap">
              <button
                type="button"
                onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
                className="btn-admin-icon"
                title="Admin Notifications"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {unreadAdminNotifs > 0 && <span className="notif-count-bubble">{unreadAdminNotifs}</span>}
              </button>

              {showNotificationsMenu && (
                <div className="admin-popover-dropdown">
                  <div className="dropdown-head">
                    <strong>Admin Notifications</strong>
                    <button
                      type="button"
                      onClick={() => {
                        adminService.markAllAdminNotificationsRead();
                        loadAllAdminData();
                      }}
                      className="btn-text-action"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="dropdown-body-scroll">
                    {adminNotifications.length === 0 ? (
                      <div className="empty-drop">No notifications</div>
                    ) : (
                      adminNotifications.map((n) => (
                        <div key={n.id} className={`drop-notif-item ${!n.read ? 'unread' : ''}`}>
                          <div className="notif-title-row">
                            <strong>{n.title}</strong>
                            <span className="notif-time">{n.timestamp.slice(11, 16)}</span>
                          </div>
                          <p>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Navigation Buttons */}
            <button
              type="button"
              onClick={onNavigateToHome}
              className="btn-admin-nav-light"
              title="Return to Public Homepage"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Homepage (/)</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToPanel}
              className="btn-admin-nav-primary"
              title="Open Personal Brand Panel"
            >
              <span>Workspace (/Pannel)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Profile Menu & Log Out */}
            <div className="admin-top-profile-badge">
              <div className="profile-avatar-circle">SD</div>
              <div className="profile-text-cluster">
                <span className="profile-name">Shavit Daloutra</span>
                <span className="profile-role">Super Admin</span>
              </div>
              <button
                type="button"
                onClick={onLogout || onNavigateToHome}
                className="btn-admin-logout"
                title="Terminate Super Admin Session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC CONTENT AREA BASED ON ACTIVE MODULE */}
        <main className="admin-page-scroll">
          {/* ==================================================== */}
          {/* MODULE 1: DASHBOARD (OVERVIEW)                       */}
          {/* ==================================================== */}
          {activeModule === 'dashboard' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Super Admin Platform Overview</h2>
                  <p className="view-subheading">
                    Real-time operational metrics across registered accounts, multi-tenant workspaces, verification queues, and social publishing streams.
                  </p>
                </div>
                <div className="view-actions-group">
                  <button type="button" onClick={loadAllAdminData} className="btn-refresh">
                    <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh Data</span>
                  </button>
                </div>
              </div>

              {/* Top Statistics Cards with Direct Module Navigation Buttons */}
              <div className="admin-stat-cards-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrap blue">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total Users</span>
                    <strong className="stat-val">{totalUsers}</strong>
                    <div className="stat-meta">
                      <span>{verifiedUsersCount} Verified</span> · <span>{pendingUsersCount} Pending</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('users')}
                    className="stat-action-btn"
                  >
                    View Users →
                  </button>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap emerald">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Verification Queue</span>
                    <strong className="stat-val">{pendingUsersCount}</strong>
                    <div className="stat-meta">
                      <span className="text-amber-600 font-bold">{pendingUsersCount} awaiting review</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('verification')}
                    className="stat-action-btn"
                  >
                    View Verification →
                  </button>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap purple">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Active Subscriptions</span>
                    <strong className="stat-val">{usersList.filter((u) => u.plan !== 'Free').length}</strong>
                    <div className="stat-meta">
                      <span>Agency & Pro tiers</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('subscriptions')}
                    className="stat-action-btn"
                  >
                    View Subscriptions →
                  </button>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap green">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Simulated Volume</span>
                    <strong className="stat-val">${totalRevenue}.00</strong>
                    <div className="stat-meta">
                      <span>{successfulTxns.length} Successful txns</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('transactions')}
                    className="stat-action-btn"
                  >
                    View Transactions →
                  </button>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap sky">
                    <FileText className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total Posts Managed</span>
                    <strong className="stat-val">{postsList.length}</strong>
                    <div className="stat-meta">
                      <span>{publishedPostsCount} Published</span> · <span>{scheduledPostsCount} Scheduled</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('posts')}
                    className="stat-action-btn"
                  >
                    View Posts →
                  </button>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap indigo">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Platform Analytics</span>
                    <strong className="stat-val">99.8%</strong>
                    <div className="stat-meta">
                      <span>Publishing Success Rate</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('analytics')}
                    className="stat-action-btn"
                  >
                    View Analytics →
                  </button>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap amber">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Security Health</span>
                    <strong className="stat-val">{unresolvedAlerts === 0 ? '100% OK' : `${unresolvedAlerts} Alerts`}</strong>
                    <div className="stat-meta">
                      <span>{unresolvedAlerts === 0 ? 'No open breaches' : 'Action recommended'}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('security_center')}
                    className="stat-action-btn"
                  >
                    View Security →
                  </button>
                </div>
              </div>

              {/* Recent Audit & System Snapshot */}
              <div className="dashboard-double-columns">
                <div className="dash-card">
                  <div className="dash-card-head">
                    <div className="flex-center-gap">
                      <Activity className="w-4 h-4 text-primary" />
                      <strong>Recent Administrative Activity</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModule('audit_logs')}
                      className="btn-link"
                    >
                      View All Logs →
                    </button>
                  </div>
                  <div className="audit-mini-stream">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.ID} className="audit-mini-row">
                        <div className="mini-icon-dot" />
                        <div className="mini-row-content">
                          <div className="mini-row-top">
                            <span className="mini-action">{log.Action}</span>
                            <span className="mini-user">{log.UserEmail}</span>
                            <span className="mini-time">{log.Timestamp.slice(11, 19)}</span>
                          </div>
                          <p className="mini-details">{log.Details || log.Resource}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-card">
                  <div className="dash-card-head">
                    <div className="flex-center-gap">
                      <Users className="w-4 h-4 text-blue-600" />
                      <strong>User Accounts Quick Inspection</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModule('users')}
                      className="btn-link"
                    >
                      Manage Users →
                    </button>
                  </div>
                  <div className="users-mini-table">
                    {usersList.slice(0, 5).map((u) => (
                      <div key={u.id} className="user-mini-row">
                        <div className="mini-avatar">{u.name.slice(0, 2).toUpperCase()}</div>
                        <div className="mini-info">
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                        <span className={`status-pill ${u.status === 'Active' ? 'active' : 'suspended'}`}>
                          {u.status}
                        </span>
                        <span className={`verif-pill ${u.verificationStatus}`}>
                          {u.verificationStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 2: USERS MANAGEMENT                           */}
          {/* ==================================================== */}
          {activeModule === 'users' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">User Directory & Account Governance</h2>
                  <p className="view-subheading">
                    Monitor, inspect, verify, edit, and suspend all registered creators and team members across the platform.
                  </p>
                </div>
                <div className="view-actions-group">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="btn-primary-action"
                  >
                    <Plus className="w-3.5 h-3.5" /> <span>Add User to System</span>
                  </button>
                </div>
              </div>

              {/* Toolbar Search & Filter */}
              <div className="admin-toolbar-shell">
                <div className="search-box-pill">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by full name, email, role, or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button type="button" onClick={() => setSearchTerm('')} className="clear-btn">✕</button>
                  )}
                </div>
                <div className="toolbar-stats-counter">
                  Showing <strong>{usersList.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).length}</strong> of {totalUsers} accounts
                </div>
              </div>

              {/* Users Master Table */}
              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>User & Identity</th>
                      <th>Role</th>
                      <th>Verification</th>
                      <th>Plan</th>
                      <th>Channels</th>
                      <th>Posts</th>
                      <th>Status</th>
                      <th>Last Active</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList
                      .filter(
                        (u) =>
                          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.role.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((u) => (
                        <tr key={u.id} className={u.isSuperAdmin ? 'superadmin-row-highlight' : ''}>
                          <td>
                            <div className="user-cell">
                              <div className={`avatar-box ${u.isSuperAdmin ? 'super-avatar' : ''}`}>
                                {u.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex-center-gap">
                                  <strong>{u.name}</strong>
                                  {u.isSuperAdmin && <span className="super-crown-tag">SUPER ADMIN</span>}
                                </div>
                                <span className="sub-email">{u.email}</span>
                                <span className="sub-handle">@{u.username}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className={`role-badge ${u.role === 'Super Admin' ? 'role-super' : 'role-normal'}`}>
                              {u.role}
                            </span>
                          </td>

                          <td>
                            <span className={`verif-pill ${u.verificationStatus}`}>
                              {u.verificationStatus === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                              {u.verificationStatus === 'Pending' && <AlertTriangle className="w-3 h-3" />}
                              {u.verificationStatus === 'Revoked' && <XCircle className="w-3 h-3" />}
                              <span>{u.verificationStatus}</span>
                            </span>
                          </td>

                          <td>
                            <span className="plan-tag-cell">{u.plan}</span>
                          </td>

                          <td>
                            <div className="channels-cell">
                              {u.connectedAccounts.map((ch) => (
                                <span key={ch} className="channel-pill">{ch}</span>
                              ))}
                            </div>
                          </td>

                          <td>
                            <span className="post-count-cell"><strong>{u.postsCount}</strong> posts</span>
                          </td>

                          <td>
                            <span className={`status-pill ${u.status === 'Active' ? 'active' : 'suspended'}`}>
                              {u.status}
                            </span>
                          </td>

                          <td>
                            <span className="date-time-cell">{u.lastLogin}</span>
                          </td>

                          <td className="text-right">
                            <div className="action-buttons-flex">
                              {/* View User Details */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUserForDetails(adminService.getUserDetails(u.email));
                                  setUserDetailsTab('overview');
                                }}
                                className="btn-action-sm btn-view"
                                title="View Complete User Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>

                              {!u.isSuperAdmin && (
                                <>
                                  {/* Edit User */}
                                  <button
                                    type="button"
                                    onClick={() => setUserForEdit({ ...u })}
                                    className="btn-action-sm btn-edit"
                                    title="Edit User"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>

                                  {/* Change Plan */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setUserForPlanChange(u);
                                      setSelectedNewPlan(u.plan || 'Professional');
                                    }}
                                    className="btn-action-sm btn-plan"
                                    title="Change Plan"
                                  >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span>Plan</span>
                                  </button>

                                  {/* Suspend / Activate */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleUserStatus(u.email)}
                                    className={`btn-action-sm ${u.status === 'Active' ? 'btn-suspend' : 'btn-activate'}`}
                                    title={u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                                  >
                                    {u.status === 'Active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                    <span>{u.status === 'Active' ? 'Suspend' : 'Activate'}</span>
                                  </button>

                                  {/* Delete User */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setUserForDelete(u);
                                      setDeleteConfirmationText('');
                                    }}
                                    className="btn-action-sm btn-delete"
                                    title="Delete User from System"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </>
                              )}

                              {/* Impersonate */}
                              <button
                                type="button"
                                onClick={() => handleImpersonate(u.email)}
                                className="btn-action-sm btn-impersonate"
                                title="Log in to workspace as this user"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Login</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 3: WORKSPACES GOVERNANCE                      */}
          {/* ==================================================== */}
          {activeModule === 'workspaces' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Workspaces & Tenant Governance</h2>
                  <p className="view-subheading">
                    Manage multi-tenant client and brand workspaces, allocated resource quotas, and active team memberships.
                  </p>
                </div>
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Workspace</th>
                      <th>Workspace ID</th>
                      <th>Owner</th>
                      <th>Plan</th>
                      <th>Created Date</th>
                      <th>Posts</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspacesList.map((ws) => (
                      <tr key={ws.ID}>
                        <td>
                          <div className="flex-center-gap">
                            <Building2 className="w-4 h-4 text-primary" />
                            <strong>{ws.Name}</strong>
                          </div>
                        </td>
                        <td><code>{ws.ID}</code></td>
                        <td>{ws.OwnerEmail || 'daloutrashavit@gmail.com'}</td>
                        <td><span className="plan-tag-cell">{ws.Plan || 'FREE'}</span></td>
                        <td>{ws.CreatedAt}</td>
                        <td><strong>{postsList.filter((p) => p.workspaceId === ws.ID || !p.workspaceId).length}</strong></td>
                        <td><span className="status-pill active">Active</span></td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() => {
                              workspaceService.setActiveWorkspaceId(ws.ID);
                              showToast(`Switched active workspace context to ${ws.Name}`, 'info');
                            }}
                            className="btn-action-sm btn-view"
                          >
                            Set Context
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 4: VERIFICATION CENTER                        */}
          {/* ==================================================== */}
          {activeModule === 'verification' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Identity Verification & Trust Center</h2>
                  <p className="view-subheading">
                    Inspect creator identity credentials and manage Verified, Pending, and Revoked status across all accounts.
                  </p>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="verification-filter-tabs">
                {['all', 'Verified', 'Pending', 'Revoked'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setVerificationFilter(status)}
                    className={`verif-tab-btn ${verificationFilter === status ? 'active' : ''}`}
                  >
                    <span>{status === 'all' ? 'All Accounts' : status}</span>
                    <span className="count-pill">
                      {status === 'all'
                        ? usersList.length
                        : usersList.filter((u) => u.verificationStatus === status).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Current Status</th>
                      <th>Verified Date</th>
                      <th>Verified By</th>
                      <th className="text-right">Verification Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList
                      .filter((u) => verificationFilter === 'all' || u.verificationStatus === verificationFilter)
                      .map((u) => (
                        <tr key={u.id}>
                          <td>
                            <strong>{u.name}</strong>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`verif-pill ${u.verificationStatus}`}>
                              {u.verificationStatus}
                            </span>
                          </td>
                          <td>{u.verificationDate || '—'}</td>
                          <td>{u.verifiedBy || 'Pending Super Admin Review'}</td>
                          <td className="text-right">
                            <div className="action-buttons-flex">
                              {u.verificationStatus !== 'Verified' && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleVerification(u.email, 'Verified', 'Approved by Super Admin')}
                                  className="btn-action-sm btn-verify"
                                  title="Approve and Verify Identity"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Approve & Verify</span>
                                </button>
                              )}

                              {u.verificationStatus !== 'Revoked' && !u.isSuperAdmin && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUserForVerificationModal(u);
                                    setVerificationReason('');
                                  }}
                                  className="btn-action-sm btn-revoke"
                                  title="Revoke Verification"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>Revoke</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 5: SUBSCRIPTIONS GOVERNANCE                   */}
          {/* ==================================================== */}
          {activeModule === 'subscriptions' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Platform Subscriptions & Quota Overrides</h2>
                  <p className="view-subheading">
                    Inspect user subscription plans (Free, Creator, Professional, Agency), extend renewals, and grant administrative trials.
                  </p>
                </div>
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Subscriber</th>
                      <th>Email</th>
                      <th>Workspace</th>
                      <th>Current Plan</th>
                      <th>Billing Status</th>
                      <th>Renewal Date</th>
                      <th className="text-right">Super Admin Plan Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminService.getSubscriptions().map((sub) => (
                      <tr key={sub.id}>
                        <td><strong>{sub.userName}</strong></td>
                        <td>{sub.userEmail}</td>
                        <td>{sub.workspaceName}</td>
                        <td><span className="plan-tag-cell">{sub.plan}</span></td>
                        <td><span className="status-pill active">{sub.billingStatus}</span></td>
                        <td>{sub.renewalDate}</td>
                        <td className="text-right">
                          <div className="action-buttons-flex">
                            <button
                              type="button"
                              onClick={() => {
                                setUserForPlanChange({ email: sub.userEmail, plan: sub.plan });
                                setSelectedNewPlan(sub.plan);
                              }}
                              className="btn-action-sm btn-plan"
                            >
                              Change Plan
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                adminService.grantTrial(sub.userEmail, 14);
                                showToast(`Granted 14-day Pro Trial to ${sub.userEmail}`, 'success');
                                loadAllAdminData();
                              }}
                              className="btn-action-sm btn-view"
                            >
                              Grant 14-Day Trial
                            </button>
                            {sub.plan !== 'Free' && !sub.isSuperAdmin && (
                              <button
                                type="button"
                                onClick={() => {
                                  adminService.updateSubscriptionPlan(sub.userEmail, 'Free', 'Admin cancelled');
                                  showToast(`Cancelled subscription for ${sub.userEmail}`, 'info');
                                  loadAllAdminData();
                                }}
                                className="btn-action-sm btn-delete"
                              >
                                Cancel Sub
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 6: TRANSACTIONS                               */}
          {/* ==================================================== */}
          {activeModule === 'transactions' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Financial Transactions Stream</h2>
                  <p className="view-subheading">
                    Simulated platform transaction logs, payment method telemetry, and administrative refund controls.
                  </p>
                </div>
                <div className="demo-simulated-tag">DEMO MODE — Simulated Transactions</div>
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Customer</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Invoice Ref</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsList.map((t) => (
                      <tr key={t.id}>
                        <td><code>{t.id}</code></td>
                        <td>
                          <strong>{t.userName}</strong>
                          <span className="sub-email">{t.userEmail}</span>
                        </td>
                        <td>{t.plan}</td>
                        <td><strong>${t.amount}.00 {t.currency}</strong></td>
                        <td>{t.paymentMethod}</td>
                        <td>
                          <span className={`status-pill ${t.status === 'Success' ? 'active' : t.status === 'Refunded' ? 'warning' : 'suspended'}`}>
                            {t.status}
                          </span>
                        </td>
                        <td>{t.createdAt}</td>
                        <td><code>{t.invoiceRef}</code></td>
                        <td className="text-right">
                          {t.status === 'Success' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTxnForRefund(t);
                                setRefundReason('');
                              }}
                              className="btn-action-sm btn-delete"
                            >
                              Refund (Simulated)
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 7: SOCIAL ACCOUNTS PLATFORM-WIDE              */}
          {/* ==================================================== */}
          {activeModule === 'social_accounts' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Platform-Wide Connected Social Accounts</h2>
                  <p className="view-subheading">
                    Monitor connected OAuth channels (Twitter, LinkedIn, Instagram, Facebook, YouTube) and health status.
                  </p>
                </div>
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Handle / Username</th>
                      <th>Display Name</th>
                      <th>Workspace</th>
                      <th>Followers</th>
                      <th>Health</th>
                      <th>Connected Date</th>
                      <th className="text-right">Disconnect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socialAccountsList.map((acc) => (
                      <tr key={acc.ID}>
                        <td>
                          <span className="channel-badge-large">{acc.Platform}</span>
                        </td>
                        <td><strong>{acc.Username}</strong></td>
                        <td>{acc.DisplayName}</td>
                        <td><code>{acc.WorkspaceId}</code></td>
                        <td>{acc.Followers}</td>
                        <td>
                          <span className="status-pill active">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>{acc.Health || 'Healthy'}</span>
                          </span>
                        </td>
                        <td>{acc.ConnectedAt}</td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() => handleDisconnectSocial(acc.ID)}
                            className="btn-action-sm btn-delete"
                          >
                            Disconnect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 8: POSTS PLATFORM-WIDE                        */}
          {/* ==================================================== */}
          {activeModule === 'posts' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Platform-Wide Posts & Content Moderation</h2>
                  <p className="view-subheading">
                    Review character validation compliance, approve pending posts, reject violations, and cancel scheduled broadcasts.
                  </p>
                </div>
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Post ID</th>
                      <th>Author</th>
                      <th>Platform</th>
                      <th>Content Preview</th>
                      <th>Character Check</th>
                      <th>Status</th>
                      <th>Scheduled / Published</th>
                      <th className="text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postsList.map((p) => (
                      <tr key={p.id}>
                        <td><code>{p.id}</code></td>
                        <td>{p.userEmail}</td>
                        <td><span className="channel-pill">{p.platform}</span></td>
                        <td>
                          <p className="post-table-snippet">{p.content}</p>
                        </td>
                        <td>
                          <span className={`validation-badge ${p.isValidLength ? 'valid' : 'invalid'}`}>
                            {p.charCount} / {p.maxChars} chars
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${p.status === 'Published' ? 'active' : p.status === 'Scheduled' ? 'scheduled' : 'draft'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>{p.scheduledFor || p.publishedAt || 'Draft'}</td>
                        <td className="text-right">
                          <div className="action-buttons-flex">
                            <button
                              type="button"
                              onClick={() => setSelectedPostForDetails(p)}
                              className="btn-action-sm btn-view"
                            >
                              Details
                            </button>
                            {p.status === 'Scheduled' && (
                              <button
                                type="button"
                                onClick={() => handleApprovePost(p.id)}
                                className="btn-action-sm btn-verify"
                              >
                                Approve Now
                              </button>
                            )}
                            {p.status === 'Scheduled' && (
                              <button
                                type="button"
                                onClick={() => handleCancelPostSchedule(p.id)}
                                className="btn-action-sm btn-suspend"
                              >
                                Cancel Schedule
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeletePost(p.id)}
                              className="btn-action-sm btn-delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 9: CAMPAIGNS                                  */}
          {/* ==================================================== */}
          {activeModule === 'campaigns' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Campaign Management Hub</h2>
                  <p className="view-subheading">
                    Cross-workspace marketing waves and multi-channel campaign progress.
                  </p>
                </div>
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Campaign Name</th>
                      <th>Workspace</th>
                      <th>Platforms</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Tags</th>
                      <th className="text-right">Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignsList.map((c) => (
                      <tr key={c.ID}>
                        <td><strong>{c.Name}</strong></td>
                        <td><code>{c.WorkspaceId}</code></td>
                        <td>{c.Platforms}</td>
                        <td>{c.StartDate}</td>
                        <td>{c.EndDate}</td>
                        <td><span className="status-pill active">{c.Status}</span></td>
                        <td>{c.Tags}</td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const next = c.Status === 'Active' ? 'Paused' : 'Active';
                              adminService.updateCampaignStatusAdmin(c.ID, next);
                              showToast(`Campaign status changed to ${next}`, 'info');
                              loadAllAdminData();
                            }}
                            className="btn-action-sm btn-edit"
                          >
                            {c.Status === 'Active' ? 'Pause' : 'Resume'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 10: MEDIA MANAGEMENT                          */}
          {/* ==================================================== */}
          {activeModule === 'media' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Media Assets Metadata Directory</h2>
                  <p className="view-subheading">
                    Inspect uploaded creative images, videos, and platform storage usage.
                  </p>
                </div>
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Title</th>
                      <th>Workspace</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Used Count</th>
                      <th>Created At</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mediaList.map((m) => (
                      <tr key={m.ID}>
                        <td>
                          <img src={m.Url} alt={m.Title} className="media-mini-thumb" />
                        </td>
                        <td><strong>{m.Title}</strong></td>
                        <td><code>{m.WorkspaceId}</code></td>
                        <td><span className="plan-tag-cell">{m.Type}</span></td>
                        <td>{m.SizeMB} MB</td>
                        <td>{m.UsedCount || 0} times</td>
                        <td>{m.CreatedAt}</td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteMedia(m.ID)}
                            className="btn-action-sm btn-delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 11: CALENDAR (PLATFORM-WIDE)                  */}
          {/* ==================================================== */}
          {activeModule === 'calendar' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Global Social Calendar & Scheduling Grid</h2>
                  <p className="view-subheading">
                    All upcoming scheduled releases across all users and connected social networks.
                  </p>
                </div>
              </div>

              <div className="calendar-admin-grid">
                {postsList
                  .filter((p) => p.status === 'Scheduled' || p.scheduledFor)
                  .map((p) => (
                    <div key={p.id} className="calendar-admin-card">
                      <div className="cal-card-head">
                        <span className="channel-pill">{p.platform}</span>
                        <span className="cal-date">{p.scheduledFor || 'Scheduled'}</span>
                      </div>
                      <p className="cal-content-body">{p.content}</p>
                      <div className="cal-card-footer">
                        <span className="cal-author">Author: {p.userEmail}</span>
                        <button
                          type="button"
                          onClick={() => handleCancelPostSchedule(p.id)}
                          className="btn-link text-danger"
                        >
                          Cancel Schedule
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 12: ANALYTICS                                 */}
          {/* ==================================================== */}
          {activeModule === 'analytics' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Platform Intelligence & Telemetry</h2>
                  <p className="view-subheading">
                    Aggregate platform health, publishing throughput, and channel volume distribution.
                  </p>
                </div>
              </div>

              <div className="analytics-metrics-overview">
                <div className="telemetry-card">
                  <span className="telemetry-label">Active Users Ratio</span>
                  <strong className="telemetry-val">100%</strong>
                  <p className="telemetry-sub">All registered accounts in good standing</p>
                </div>
                <div className="telemetry-card">
                  <span className="telemetry-label">Publishing Success Rate</span>
                  <strong className="telemetry-val">99.8%</strong>
                  <p className="telemetry-sub">Simulated Zero API Rate Limits</p>
                </div>
                <div className="telemetry-card">
                  <span className="telemetry-label">Average Post Length</span>
                  <strong className="telemetry-val">184 Chars</strong>
                  <p className="telemetry-sub">Within optimal engagement thresholds</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 13: AUDIT LOGS (IMMUTABLE TRAIL)              */}
          {/* ==================================================== */}
          {activeModule === 'audit_logs' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Immutable Platform Audit Trail</h2>
                  <p className="view-subheading">
                    Cryptographic record of every administrative and user operation across all workspaces.
                  </p>
                </div>
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Audit ID</th>
                      <th>Timestamp</th>
                      <th>Actor</th>
                      <th>Action</th>
                      <th>Resource</th>
                      <th>Workspace</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.ID}>
                        <td><code>{log.ID}</code></td>
                        <td>{log.Timestamp}</td>
                        <td><strong>{log.UserEmail}</strong></td>
                        <td><span className="audit-action-tag">{log.Action}</span></td>
                        <td><code>{log.Resource}</code></td>
                        <td><code>{log.WorkspaceId}</code></td>
                        <td>{log.Details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 14: SECURITY CENTER                           */}
          {/* ==================================================== */}
          {activeModule === 'security_center' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Security Center & Risk Telemetry</h2>
                  <p className="view-subheading">
                    Authentication hygiene, suspicious activity detection, and privileged session oversight.
                  </p>
                </div>
              </div>

              <div className="security-alerts-container">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className={`sec-alert-card ${alert.severity}`}>
                    <div className="sec-alert-icon">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="sec-alert-body">
                      <div className="sec-alert-head">
                        <strong>{alert.title}</strong>
                        <span className="sec-time">{alert.timestamp}</span>
                      </div>
                      <p>{alert.description}</p>
                      <span className="sec-target">Affected: {alert.targetUser}</span>
                    </div>
                    <div className="sec-alert-actions">
                      {!alert.resolved ? (
                        <button
                          type="button"
                          onClick={() => handleResolveAlert(alert.id)}
                          className="btn-action-sm btn-verify"
                        >
                          Mark Reviewed
                        </button>
                      ) : (
                        <span className="verif-pill Verified">Resolved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 15: LOGIN ACTIVITY                            */}
          {/* ==================================================== */}
          {activeModule === 'login_activity' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Authentication & Login Activity Telemetry</h2>
                  <p className="view-subheading">
                    Historical login logs, IP geolocation, client devices, and blocked attempt telemetry.
                  </p>
                </div>
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Account</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>IP Address</th>
                      <th>Device / Browser</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginActivity.map((act) => (
                      <tr key={act.id}>
                        <td>{act.timestamp}</td>
                        <td>
                          <strong>{act.user}</strong>
                          <span className="sub-email">{act.email}</span>
                        </td>
                        <td>{act.role}</td>
                        <td>
                          <span className={`status-pill ${act.status === 'Success' ? 'active' : 'suspended'}`}>
                            {act.status}
                          </span>
                        </td>
                        <td><code>{act.ipAddress}</code></td>
                        <td>{act.device}</td>
                        <td>{act.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 16: ADMIN ACTIVITY                            */}
          {/* ==================================================== */}
          {activeModule === 'admin_activity' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Privileged Admin Operations Log</h2>
                  <p className="view-subheading">
                    Activity performed strictly by the Super Admin root account ({adminService.SUPER_ADMIN_EMAIL}).
                  </p>
                </div>
              </div>

              <div className="admin-table-shell">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Action</th>
                      <th>Affected Target</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs
                      .filter((l) => l.Action.startsWith('ADMIN_'))
                      .map((log) => (
                        <tr key={log.ID}>
                          <td>{log.Timestamp}</td>
                          <td><span className="audit-action-tag">{log.Action}</span></td>
                          <td><code>{log.Resource}</code></td>
                          <td>{log.Details}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 17: NOTIFICATIONS                             */}
          {/* ==================================================== */}
          {activeModule === 'notifications' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Platform Notifications Hub</h2>
                  <p className="view-subheading">
                    System broadcasts, compliance alerts, and subscription events.
                  </p>
                </div>
                <div className="view-actions-group">
                  <button
                    type="button"
                    onClick={() => {
                      adminService.markAllAdminNotificationsRead();
                      loadAllAdminData();
                      showToast('All notifications marked as read', 'info');
                    }}
                    className="btn-action-sm btn-view"
                  >
                    Mark All Read
                  </button>
                </div>
              </div>

              <div className="notifs-master-list">
                {adminNotifications.map((notif) => (
                  <div key={notif.id} className={`notif-card-row ${!notif.read ? 'unread' : ''}`}>
                    <div className="notif-card-icon">
                      <Bell className="w-4 h-4 text-primary" />
                    </div>
                    <div className="notif-card-body">
                      <div className="notif-card-top">
                        <strong>{notif.title}</strong>
                        <span className="notif-time">{notif.timestamp}</span>
                      </div>
                      <p>{notif.message}</p>
                    </div>
                    <div className="notif-card-actions">
                      {!notif.read && (
                        <button
                          type="button"
                          onClick={() => {
                            adminService.markAdminNotificationRead(notif.id);
                            loadAllAdminData();
                          }}
                          className="btn-action-sm btn-verify"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 18: PLATFORM SETTINGS                         */}
          {/* ==================================================== */}
          {activeModule === 'settings' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Global Platform Settings</h2>
                  <p className="view-subheading">
                    Manage platform brand name, default timezones, storage quotas, and verification enforcement.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePlatformSettings} className="settings-admin-form">
                <div className="form-grid-two">
                  <div className="form-item">
                    <label>Platform Name</label>
                    <input
                      type="text"
                      value={platformSettings.platformName || ''}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-item">
                    <label>Support Email Address</label>
                    <input
                      type="email"
                      value={platformSettings.supportEmail || ''}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-item">
                    <label>Default Timezone</label>
                    <input
                      type="text"
                      value={platformSettings.defaultTimezone || ''}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, defaultTimezone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-item">
                    <label>Max Storage Quota Per User (MB)</label>
                    <input
                      type="number"
                      value={platformSettings.maxStorageMB || 5000}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, maxStorageMB: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!platformSettings.enforceStrictValidation}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, enforceStrictValidation: e.target.checked })}
                    />
                    <span>Enforce Strict Platform Character Limits before Scheduling/Publishing</span>
                  </label>
                </div>

                <div className="form-actions-foot">
                  <button type="submit" className="btn-primary-action">
                    Save Configuration & Record Audit Log
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 19: FEATURE FLAGS                             */}
          {/* ==================================================== */}
          {activeModule === 'feature_flags' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">Runtime Feature Flags & Toggles</h2>
                  <p className="view-subheading">
                    Instantly enable or disable capabilities platform-wide with full audit logging.
                  </p>
                </div>
              </div>

              <div className="feature-flags-grid">
                {featureFlags.map((flag) => (
                  <div key={flag.id} className="flag-card">
                    <div className="flag-card-top">
                      <div>
                        <strong>{flag.name}</strong>
                        <span className="flag-category">{flag.category}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatureFlag(flag.id, flag.enabled)}
                        className={`flag-toggle-btn ${flag.enabled ? 'enabled' : 'disabled'}`}
                      >
                        {flag.enabled ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>
                    <p className="flag-desc">{flag.description}</p>
                    <span className="flag-meta">Updated: {flag.lastUpdated} by {flag.updatedBy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODULE 20: SYSTEM HEALTH                             */}
          {/* ==================================================== */}
          {activeModule === 'system_health' && (
            <div className="admin-module-view">
              <div className="view-intro-row">
                <div>
                  <h2 className="view-heading">System Infrastructure & Service Health</h2>
                  <p className="view-subheading">
                    Real-time operational status of authentication, local database repositories, and simulated social APIs.
                  </p>
                </div>
                <div className="view-actions-group">
                  <button
                    type="button"
                    onClick={() => {
                      setSystemHealth(adminService.getSystemHealth());
                      showToast('Service health checks refreshed', 'info');
                    }}
                    className="btn-refresh"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh Health Check</span>
                  </button>
                </div>
              </div>

              <div className="system-health-grid">
                {systemHealth.map((svc) => (
                  <div key={svc.service} className="health-card">
                    <div className="health-card-head">
                      <strong>{svc.service}</strong>
                      <span className="health-status-badge operational">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>{svc.status}</span>
                      </span>
                    </div>
                    <p className="health-desc">{svc.details}</p>
                    <div className="health-foot">
                      <span>Latency: <strong>{svc.latency}</strong></span>
                      {svc.isSimulated && <span className="sim-tag">Simulated Sandbox</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================================================== */}
      {/* GLOBAL SEARCH MODAL (CMD+K)                          */}
      {/* ==================================================== */}
      {showGlobalSearchModal && (
        <div className="modal-overlay" onClick={() => setShowGlobalSearchModal(false)}>
          <div className="modal-card global-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="search-modal-input-wrap">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type anything to search across users, posts, campaigns, transactions..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="button" onClick={() => setShowGlobalSearchModal(false)} className="modal-close-btn">✕</button>
            </div>

            <div className="search-modal-results">
              {globalSearchQuery.trim() === '' ? (
                <div className="search-hint">Type to start searching...</div>
              ) : (
                <>
                  {globalSearchResults.users.length > 0 && (
                    <div className="search-group">
                      <h4>Users ({globalSearchResults.users.length})</h4>
                      {globalSearchResults.users.map((u) => (
                        <div
                          key={u.id}
                          className="search-result-row"
                          onClick={() => {
                            setSelectedUserForDetails(adminService.getUserDetails(u.email));
                            setShowGlobalSearchModal(false);
                          }}
                        >
                          <strong>{u.name}</strong> <span>({u.email})</span> — <em>{u.role}</em>
                        </div>
                      ))}
                    </div>
                  )}

                  {globalSearchResults.posts.length > 0 && (
                    <div className="search-group">
                      <h4>Posts ({globalSearchResults.posts.length})</h4>
                      {globalSearchResults.posts.map((p) => (
                        <div
                          key={p.id}
                          className="search-result-row"
                          onClick={() => {
                            setSelectedPostForDetails(p);
                            setShowGlobalSearchModal(false);
                          }}
                        >
                          <strong>[{p.platform}]</strong> <span>{p.content?.slice(0, 70)}...</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {globalSearchResults.transactions.length > 0 && (
                    <div className="search-group">
                      <h4>Transactions ({globalSearchResults.transactions.length})</h4>
                      {globalSearchResults.transactions.map((t) => (
                        <div
                          key={t.id}
                          className="search-result-row"
                          onClick={() => {
                            setActiveModule('transactions');
                            setShowGlobalSearchModal(false);
                          }}
                        >
                          <strong>{t.id}</strong> — ${t.amount} ({t.userEmail}) [{t.status}]
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* USER DETAILS MODAL (WITH TABS & ZERO SECRETS)        */}
      {/* ==================================================== */}
      {selectedUserForDetails && (
        <div className="modal-overlay" onClick={() => setSelectedUserForDetails(null)}>
          <div className="modal-card user-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex-center-gap">
                <div className="modal-avatar">{selectedUserForDetails.user.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <h3 className="modal-title">{selectedUserForDetails.user.name}</h3>
                  <span className="modal-sub">{selectedUserForDetails.user.email}</span>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedUserForDetails(null)} className="modal-close-btn">✕</button>
            </div>

            {/* Modal Internal Tabs */}
            <div className="modal-nav-tabs">
              <button
                type="button"
                onClick={() => setUserDetailsTab('overview')}
                className={`m-tab ${userDetailsTab === 'overview' ? 'active' : ''}`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setUserDetailsTab('posts')}
                className={`m-tab ${userDetailsTab === 'posts' ? 'active' : ''}`}
              >
                Posts ({selectedUserForDetails.posts.length})
              </button>
              <button
                type="button"
                onClick={() => setUserDetailsTab('audit')}
                className={`m-tab ${userDetailsTab === 'audit' ? 'active' : ''}`}
              >
                Activity Audit ({selectedUserForDetails.auditHistory.length})
              </button>
            </div>

            <div className="modal-tab-content">
              {userDetailsTab === 'overview' && (
                <div className="user-overview-grid">
                  <div className="meta-pair">
                    <span>User ID:</span> <strong>{selectedUserForDetails.user.id}</strong>
                  </div>
                  <div className="meta-pair">
                    <span>Role:</span> <strong>{selectedUserForDetails.user.role}</strong>
                  </div>
                  <div className="meta-pair">
                    <span>Verification:</span> <strong className="text-primary">{selectedUserForDetails.user.verificationStatus}</strong>
                  </div>
                  <div className="meta-pair">
                    <span>Plan:</span> <strong>{selectedUserForDetails.user.plan}</strong>
                  </div>
                  <div className="meta-pair">
                    <span>Account Status:</span> <strong>{selectedUserForDetails.user.status}</strong>
                  </div>
                  <div className="meta-pair">
                    <span>Last Active IP:</span> <code>{selectedUserForDetails.user.ipAddress}</code>
                  </div>
                  <div className="meta-pair">
                    <span>Client Device:</span> <span>{selectedUserForDetails.user.device}</span>
                  </div>
                  <div className="meta-pair">
                    <span>Connected Social Channels:</span>
                    <div>{selectedUserForDetails.user.connectedAccounts.join(', ')}</div>
                  </div>
                </div>
              )}

              {userDetailsTab === 'posts' && (
                <div className="modal-posts-list">
                  {selectedUserForDetails.posts.length === 0 ? (
                    <div>No posts created by this user yet.</div>
                  ) : (
                    selectedUserForDetails.posts.map((p) => (
                      <div key={p.ID} className="m-post-card">
                        <div className="m-post-head">
                          <span className="channel-pill">{p.Platform}</span>
                          <span className="m-post-status">{p.Status}</span>
                        </div>
                        <p>{p.Content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {userDetailsTab === 'audit' && (
                <div className="modal-audit-list">
                  {selectedUserForDetails.auditHistory.map((log) => (
                    <div key={log.ID} className="m-audit-row">
                      <span className="m-action">{log.Action}</span>
                      <span className="m-time">{log.Timestamp}</span>
                      <p>{log.Details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer-row">
              <button
                type="button"
                onClick={() => setSelectedUserForDetails(null)}
                className="btn-cancel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* EDIT USER MODAL                                      */}
      {/* ==================================================== */}
      {userForEdit && (
        <div className="modal-overlay" onClick={() => setUserForEdit(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit User Profile</h3>
              <button type="button" onClick={() => setUserForEdit(null)} className="modal-close-btn">✕</button>
            </div>
            <form onSubmit={handleConfirmEditUser} className="admin-form">
              <div className="form-group-item">
                <label>Full Name</label>
                <input
                  type="text"
                  value={userForEdit.name}
                  onChange={(e) => setUserForEdit({ ...userForEdit, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-item">
                <label>Role</label>
                <select
                  value={userForEdit.role}
                  onChange={(e) => setUserForEdit({ ...userForEdit, role: e.target.value })}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Manager">Manager</option>
                  <option value="Editor">Editor</option>
                  <option value="Contributor">Contributor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="form-group-item">
                <label>Account Status</label>
                <select
                  value={userForEdit.status}
                  onChange={(e) => setUserForEdit({ ...userForEdit, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="modal-action-row">
                <button type="button" onClick={() => setUserForEdit(null)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save-confirm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* DELETE USER CONFIRMATION DIALOG                      */}
      {/* ==================================================== */}
      {userForDelete && (
        <div className="modal-overlay" onClick={() => setUserForDelete(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex-center-gap">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="modal-title text-rose-600">Delete User Account</h3>
              </div>
              <button type="button" onClick={() => setUserForDelete(null)} className="modal-close-btn">✕</button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to permanently delete user <strong>{userForDelete.name}</strong> ({userForDelete.email})?
              </p>
              <p className="text-muted text-sm mt-2">
                This will remove the user from users.csv, disconnect all social channels, and record a Super Admin deletion audit record.
              </p>
              <div className="confirm-delete-box mt-3">
                <label>Please type <strong>DELETE</strong> to confirm:</label>
                <input
                  type="text"
                  placeholder="DELETE"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="modal-action-row">
              <button type="button" onClick={() => setUserForDelete(null)} className="btn-cancel">Cancel</button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                disabled={deleteConfirmationText.trim().toLowerCase() !== 'delete'}
                className="btn-danger-confirm"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* CHANGE PLAN OVERRIDE MODAL                           */}
      {/* ==================================================== */}
      {userForPlanChange && (
        <div className="modal-overlay" onClick={() => setUserForPlanChange(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Override Subscription Plan</h3>
              <button type="button" onClick={() => setUserForPlanChange(null)} className="modal-close-btn">✕</button>
            </div>
            <div className="modal-body">
              <p>Change subscription tier for <strong>{userForPlanChange.email}</strong>:</p>
              <div className="form-group-item mt-3">
                <label>Designated Plan</label>
                <select
                  value={selectedNewPlan}
                  onChange={(e) => setSelectedNewPlan(e.target.value)}
                >
                  <option value="Free">Free (Starter tier, 2 accounts)</option>
                  <option value="Creator">Creator ($19/mo, 5 accounts)</option>
                  <option value="Professional">Professional ($49/mo, 15 accounts)</option>
                  <option value="Agency">Agency ($149/mo, 50 accounts)</option>
                </select>
              </div>
            </div>
            <div className="modal-action-row">
              <button type="button" onClick={() => setUserForPlanChange(null)} className="btn-cancel">Cancel</button>
              <button type="button" onClick={handleConfirmChangePlan} className="btn-save-confirm">
                Apply Plan Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* REVOKE VERIFICATION MODAL WITH REASON                */}
      {/* ==================================================== */}
      {userForVerificationModal && (
        <div className="modal-overlay" onClick={() => setUserForVerificationModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Revoke Verification Status</h3>
              <button type="button" onClick={() => setUserForVerificationModal(null)} className="modal-close-btn">✕</button>
            </div>
            <div className="modal-body">
              <p>Revoke verification credentials for <strong>{userForVerificationModal.email}</strong>?</p>
              <div className="form-group-item mt-3">
                <label>Reason for Revocation</label>
                <input
                  type="text"
                  placeholder="e.g. Identity discrepancy, violation of community guidelines"
                  value={verificationReason}
                  onChange={(e) => setVerificationReason(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-action-row">
              <button type="button" onClick={() => setUserForVerificationModal(null)} className="btn-cancel">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  handleToggleVerification(userForVerificationModal.email, 'Revoked', verificationReason);
                  setUserForVerificationModal(null);
                }}
                className="btn-danger-confirm"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* POST DETAILS & CHARACTER VALIDATION MODAL            */}
      {/* ==================================================== */}
      {selectedPostForDetails && (
        <div className="modal-overlay" onClick={() => setSelectedPostForDetails(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex-center-gap">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="modal-title">Post Inspection & Validation Telemetry</h3>
              </div>
              <button type="button" onClick={() => setSelectedPostForDetails(null)} className="modal-close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="meta-pair">
                <span>Platform:</span> <strong>{selectedPostForDetails.platform}</strong>
              </div>
              <div className="meta-pair">
                <span>Author:</span> <strong>{selectedPostForDetails.userEmail}</strong>
              </div>
              <div className="meta-pair">
                <span>Character Count:</span>
                <strong>{selectedPostForDetails.charCount} / {selectedPostForDetails.maxChars} chars ({selectedPostForDetails.isValidLength ? 'VALID' : 'OVER LIMIT'})</strong>
              </div>
              <div className="mt-3">
                <label>Full Content:</label>
                <div className="post-content-preview-box">
                  {selectedPostForDetails.content}
                </div>
              </div>
            </div>
            <div className="modal-action-row">
              <button type="button" onClick={() => setSelectedPostForDetails(null)} className="btn-cancel">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ADD USER MODAL                                       */}
      {/* ==================================================== */}
      {isAddUserModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add User to System (users.csv)</h3>
              <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="modal-close-btn">✕</button>
            </div>
            <form onSubmit={handleCreateUser} className="admin-form">
              <div className="form-group-item">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-item">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="elena@agency.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-item">
                <label>Password</label>
                <input
                  type="text"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-item">
                <label>Designated Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Manager">Manager</option>
                  <option value="Editor">Editor</option>
                  <option value="Contributor">Contributor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="modal-action-row">
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save-confirm">Create & Verify User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
