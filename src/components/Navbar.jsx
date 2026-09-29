import React from 'react';
import {
  PenTool,
  LayoutDashboard,
  FileText,
  CalendarClock,
  Database,
  Download,
  User,
  LogOut,
  Sparkles,
  Share2
} from 'lucide-react';
import { downloadCSVFile, csvStorage } from '../utils/csvStorage';

export function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuth, onLogout, showToast }) {
  const handleDownloadAllCSV = () => {
    // Downloads posts.csv
    const postsCSV = csvStorage.getPostsCSV();
    downloadCSVFile(postsCSV, `posts_database_${new Date().toISOString().slice(0, 10)}.csv`);

    // Downloads users.csv
    const usersCSV = csvStorage.getUsersCSV();
    downloadCSVFile(usersCSV, `users_passwords_database_${new Date().toISOString().slice(0, 10)}.csv`);

    showToast('Downloaded posts.csv & users.csv with password credentials!', 'success');
  };

  const navLinks = [
    { id: 'composer', label: 'Composer', icon: PenTool },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'scheduled', label: 'Scheduled', icon: CalendarClock },
    { id: 'csv', label: 'CSV Database', icon: Database, badge: 'CSV' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-logo">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="brand-title">
              PostComposer<span className="brand-pro">Pro</span>
            </span>
            <span className="brand-tag">Platform Validation & CSV Database</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-nav">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && <span className="tab-badge">{tab.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile & CSV Export CTA */}
        <div className="navbar-actions">
          <button
            type="button"
            onClick={handleDownloadAllCSV}
            className="btn-download-csv"
            title="Download CSV files (posts, users & passwords)"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Download CSVs</span>
          </button>

          {currentUser ? (
            <div className="user-profile-badge">
              <div className="user-avatar">
                {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AM'}
              </div>
              <div className="user-info">
                <span className="user-name">{currentUser.name}</span>
                <span className="user-email">{currentUser.email}</span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="btn-logout"
                title="Logout of session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="btn-signin"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
