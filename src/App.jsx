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
import { CsvDatabaseView } from './components/CsvDatabaseView';
import { WorkspaceModal } from './components/WorkspaceModal';
import { UpgradeModal } from './components/UpgradeModal';
import { AuthModal } from './components/AuthModal';

import { workspaceService } from './services/workspaceService';
import { subscriptionService } from './services/subscriptionService';
import { csvStorage } from './utils/csvStorage';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(() => csvStorage.getActiveUser());
  const [workspaces, setWorkspaces] = useState(() => workspaceService.getAllWorkspaces());
  const [activeWorkspace, setActiveWorkspace] = useState(() => workspaceService.getActiveWorkspace());

  // Modal states
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
    csvStorage.logoutUser();
    setCurrentUser(null);
    showToast('Logged out of session', 'info');
  };

  return (
    <div className="saas-app-layout">
      {/* 1. Left SaaS Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeWorkspace={activeWorkspace}
        workspaces={workspaces}
        onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
        currentUser={currentUser}
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
        />

        {/* Dynamic Main Workspace Content */}
        <main className="saas-page-content-wrapper">
          {activeTab === 'dashboard' && (
            <Dashboard
              currentUser={currentUser}
              activeWorkspace={activeWorkspace}
              onNavigateToComposer={() => setActiveTab('composer')}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              showToast={showToast}
            />
          )}

          {activeTab === 'composer' && (
            <PostComposer
              currentUser={currentUser}
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

          {activeTab === 'csv' && (
            <CsvDatabaseView
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
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
        onAuthSuccess={(user) => setCurrentUser(user)}
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
    </div>
  );
}

export default App;
