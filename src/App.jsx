import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PostComposer } from './components/PostComposer';
import { Dashboard } from './components/Dashboard';
import { DraftsManager } from './components/DraftsManager';
import { ScheduledList } from './components/ScheduledList';
import { CsvDatabaseView } from './components/CsvDatabaseView';
import { AuthModal } from './components/AuthModal';
import { csvStorage } from './utils/csvStorage';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('composer'); // 'composer', 'dashboard', 'drafts', 'scheduled', 'csv'
  const [currentUser, setCurrentUser] = useState(() => csvStorage.getActiveUser());
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

  const handleLogout = () => {
    csvStorage.logoutUser();
    setCurrentUser(null);
    showToast('Logged out of session', 'info');
  };

  return (
    <div className="app-root">
      {/* Top Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        showToast={showToast}
      />

      {/* Main Content Area */}
      <main className="main-content-area">
        {activeTab === 'composer' && (
          <PostComposer
            currentUser={currentUser}
            showToast={showToast}
            onPostCreated={() => {}}
            onDraftSaved={() => {}}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigateToComposer={() => setActiveTab('composer')}
            showToast={showToast}
          />
        )}

        {activeTab === 'drafts' && (
          <DraftsManager
            showToast={showToast}
            onOpenComposerWithContent={() => setActiveTab('composer')}
          />
        )}

        {activeTab === 'scheduled' && (
          <ScheduledList showToast={showToast} />
        )}

        {activeTab === 'csv' && (
          <CsvDatabaseView showToast={showToast} />
        )}
      </main>

      {/* Authentication Modal (Stores passwords and users directly in CSV) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
        showToast={showToast}
      />

      {/* Toast Banner */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
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
