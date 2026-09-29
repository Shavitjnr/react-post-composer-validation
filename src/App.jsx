import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { Dashboard } from './components/Dashboard';
import { PostComposer } from './components/PostComposer';
import { CalendarView } from './components/CalendarView';
import { PostsManager } from './components/PostsManager';
import { DraftsManager } from './components/DraftsManager';
import { MediaLibrary } from './components/MediaLibrary';
import { SocialAccountsManager } from './components/SocialAccountsManager';
import { CampaignsManager } from './components/CampaignsManager';
import { AnalyticsView } from './components/AnalyticsView';
import { TeamManager } from './components/TeamManager';
import { BillingView } from './components/BillingView';
import { AuditLogView } from './components/AuditLogView';
import { WorkspaceSettingsView } from './components/WorkspaceSettingsView';
import { AdminAccessDenied } from './components/AdminAccessDenied';
import { WorkspaceModal } from './components/WorkspaceModal';
import { UpgradeModal } from './components/UpgradeModal';
import { AuthModal } from './components/AuthModal';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { LandingPage } from './components/LandingPage';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { ClerkUserBridge } from './components/ClerkAuthControls';

import { workspaceService } from './services/workspaceService';
import { subscriptionService } from './services/subscriptionService';
import { adminService } from './services/adminService';
import { csvStorage } from './utils/csvStorage';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const parseRouteFromLocation = () => {
  if (typeof window === 'undefined') return 'home';
  const p = window.location.pathname.toLowerCase();
  if (p.startsWith('/admin')) return 'admin';
  if (p.startsWith('/pannel') || p.startsWith('/panel')) return 'panel';
  return 'home';
};

function App({ hasClerkConfigured = false }) {
  const [currentRoute, setCurrentRoute] = useState(parseRouteFromLocation);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(() => csvStorage.getActiveUser());
  const [workspaces, setWorkspaces] = useState(() => workspaceService.getAllWorkspaces());
  const [activeWorkspace, setActiveWorkspace] = useState(() => workspaceService.getActiveWorkspace());

  // Modal states
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const navigate = (newRoute) => {
    let targetPath = '/';
    if (newRoute === 'panel') targetPath = '/Pannel';
    else if (newRoute === 'admin') targetPath = '/admin';

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setCurrentRoute(newRoute);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(parseRouteFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [clerkState, setClerkState] = useState({
    isSignedIn: false,
    user: null,
    signOut: null
  });

  // Calculate active effective user and super admin authorization
  const effectiveUser = clerkState.isSignedIn && clerkState.user ? clerkState.user : currentUser;
  const isUserSuperAdmin = adminService.isSuperAdmin(
    effectiveUser,
    effectiveUser?.orgId || clerkState.user?.orgId
  );

  // STRICT URL PROTECTION: Nobody can view /Pannel without logging in / signing up first!
  useEffect(() => {
    if (currentRoute === 'panel' && !effectiveUser) {
      navigate('home');
      setIsAuthOpen(true);
      showToast('Authentication required: Please sign in or click "Get Started Free" to access your workspace panel.', 'info');
    }
  }, [currentRoute, effectiveUser]);

  const handleSelectWorkspace = (workspaceId) => {
    workspaceService.setActiveWorkspaceId(workspaceId);
    setActiveWorkspace(workspaceService.getActiveWorkspace());
    showToast(`Switched active workspace to "${workspaceService.getActiveWorkspace()?.Name}"`, 'info');
  };

  const handleWorkspaceCreated = (newWs) => {
    setWorkspaces(workspaceService.getAllWorkspaces());
    setActiveWorkspace(newWs);
  };

  const handleLogout = () => {
    if (clerkState.signOut) {
      try {
        clerkState.signOut();
      } catch (err) {
        console.error('Clerk signOut error', err);
      }
    }
    csvStorage.logoutUser();
    setCurrentUser(null);
    showToast('Logged out of session', 'info');
    navigate('home');
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    const isSuper = adminService.isSuperAdmin(user);
    if (isSuper) {
      navigate('admin');
      showToast(`Super Admin authenticated: Welcome ${user.name}`, 'success');
    } else {
      navigate('panel');
      showToast(`Logged in as ${user.name}. Welcome to Personal Brand!`, 'success');
    }
  };

  // Only Get Started Free prompts login and moves to /Pannel
  const handleGetStartedFree = () => {
    if (effectiveUser) {
      navigate('panel');
    } else {
      setIsAuthOpen(true);
    }
  };

  // Transparent pricing plans trigger verified checkout flow (NEVER directly to panel)
  const handleSelectPaidPlan = (plan) => {
    setSelectedCheckoutPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (plan, authenticatedUser) => {
    if (authenticatedUser) {
      setCurrentUser(authenticatedUser);
    }
    setActiveWorkspace(workspaceService.getActiveWorkspace());
    showToast(`Payment of $${plan.price} verified! Plan upgraded to ${plan.name}.`, 'success');
    navigate('panel');
  };

  return (
    <>
      {/* Clerk User & Org Bridge */}
      <ClerkUserBridge
        hasClerkConfigured={hasClerkConfigured}
        onSyncClerkState={setClerkState}
      />

      {currentRoute === 'home' && (
        <LandingPage
          onGetStartedFree={handleGetStartedFree}
          onOpenAuth={() => setIsAuthOpen(true)}
          onSelectPaidPlan={handleSelectPaidPlan}
        />
      )}

      {/* Admin Route: STRICTLY guarded for Super Admin; others receive 403 Forbidden */}
      {currentRoute === 'admin' && (
        isUserSuperAdmin ? (
          <SuperAdminDashboard
            onNavigateToPanel={() => navigate('panel')}
            onNavigateToHome={() => navigate('home')}
            onLogout={handleLogout}
            onImpersonateSuccess={(user) => {
              setCurrentUser(user);
            }}
            showToast={showToast}
          />
        ) : (
          <AdminAccessDenied
            currentUser={effectiveUser}
            onNavigateToPanel={() => navigate('panel')}
            onNavigateToHome={() => navigate('home')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )
      )}

      {currentRoute === 'panel' && (
        <div className="saas-app-layout">
          {/* 1. Left SaaS Collapsible Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeWorkspace={activeWorkspace}
            workspaces={workspaces}
            onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
            currentUser={effectiveUser}
            onLogout={handleLogout}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          />

          {/* 2. Main Viewport & Header */}
          <div className="saas-main-viewport">
            {/* Top Navbar */}
            <TopNavbar
              activeWorkspace={activeWorkspace}
              onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenMediaUpload={() => setActiveTab('media')}
              showToast={showToast}
              currentUser={effectiveUser}
              onLogout={handleLogout}
            />

            {/* Dynamic Main Workspace Content */}
            <main className="saas-page-content-wrapper">
              {activeTab === 'dashboard' && (
                <Dashboard
                  currentUser={effectiveUser}
                  activeWorkspace={activeWorkspace}
                  onNavigateToComposer={() => setActiveTab('composer')}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                  showToast={showToast}
                />
              )}

              {activeTab === 'composer' && (
                <PostComposer
                  currentUser={effectiveUser}
                  activeWorkspace={activeWorkspace}
                  showToast={showToast}
                  onPostCreated={() => {}}
                  onDraftSaved={() => {}}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarView
                  onNavigateToComposer={() => setActiveTab('composer')}
                  showToast={showToast}
                />
              )}

              {activeTab === 'posts' && (
                <PostsManager
                  onNavigateToComposer={() => setActiveTab('composer')}
                  showToast={showToast}
                />
              )}

              {activeTab === 'drafts' && (
                <DraftsManager
                  onOpenComposerWithContent={(content, platform) => {
                    setActiveTab('composer');
                  }}
                  onNavigateToComposer={() => setActiveTab('composer')}
                  showToast={showToast}
                />
              )}

              {activeTab === 'media' && (
                <MediaLibrary
                  onNavigateToComposer={() => setActiveTab('composer')}
                  showToast={showToast}
                />
              )}

              {activeTab === 'social' && (
                <SocialAccountsManager
                  activeWorkspace={activeWorkspace}
                  showToast={showToast}
                />
              )}

              {activeTab === 'campaigns' && (
                <CampaignsManager
                  showToast={showToast}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView />
              )}

              {activeTab === 'team' && (
                <TeamManager
                  showToast={showToast}
                />
              )}

              {activeTab === 'billing' && (
                <BillingView
                  activeWorkspace={activeWorkspace}
                  showToast={showToast}
                />
              )}

              {activeTab === 'audit' && (
                <AuditLogView
                  showToast={showToast}
                />
              )}

              {(activeTab === 'settings' || activeTab === 'csv') && (
                <WorkspaceSettingsView
                  activeWorkspace={activeWorkspace}
                  showToast={showToast}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Universal MODALS */}
      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={handleSelectWorkspace}
        onWorkspaceCreated={handleWorkspaceCreated}
        showToast={showToast}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlan={subscriptionService.getCurrentPlan()}
        onPlanUpgraded={() => {
          setActiveWorkspace(workspaceService.getActiveWorkspace());
        }}
        showToast={showToast}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        showToast={showToast}
      />

      <PaymentCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={selectedCheckoutPlan}
        currentUser={effectiveUser}
        onPaymentSuccess={handlePaymentSuccess}
        showToast={showToast}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-primary" />}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="toast-close-btn"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}

export default App;
