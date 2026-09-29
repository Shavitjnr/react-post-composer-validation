import React, { useState } from 'react';
import { PlatformSelector } from './PlatformSelector';
import { CharacterCounter } from './CharacterCounter';
import { PostPreview } from './PostPreview';
import { ScheduleModal } from './ScheduleModal';
import { validatePost, getPlatformLimit } from '../utils/validation';
import { csvStorage } from '../utils/csvStorage';
import {
  Hash,
  AtSign,
  Trash2,
  Bookmark,
  Calendar,
  Send,
  Quote,
  List
} from 'lucide-react';

const COMMON_HASHTAGS = ['#Engineering', '#Architecture', '#Tech', '#Software', '#React', '#NextJS'];

export function PostComposer({ currentUser, showToast, onPostCreated, onDraftSaved }) {
  const [platform, setPlatform] = useState('Twitter');
  const [content, setContent] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Dynamic Validation Engine
  const validation = validatePost(content, platform);

  const insertHashtag = (tag) => {
    setContent((prev) => (prev.endsWith(' ') || prev.length === 0 ? prev : prev + ' ') + tag + ' ');
  };

  const insertMention = () => {
    const handle = prompt('Enter handle or username without @:');
    if (handle && handle.trim()) {
      setContent((prev) => (prev.endsWith(' ') || prev.length === 0 ? prev : prev + ' ') + `@${handle.trim()} `);
    }
  };

  const insertQuote = () => {
    const quoteText = prompt('Enter quote text:');
    if (quoteText && quoteText.trim()) {
      setContent((prev) => (prev.length === 0 ? '' : prev + '\n') + `"${quoteText.trim()}"\n`);
    }
  };

  const insertBullet = () => {
    setContent((prev) => (prev.length === 0 ? '' : prev + '\n') + '• ');
  };

  const handleClear = () => {
    if (content.length > 0 && confirm('Clear the current text in the post editor?')) {
      setContent('');
    }
  };

  // Publish immediate post -> saves to posts.csv
  const handlePublish = () => {
    if (!validation.isValid) return;

    csvStorage.savePost({
      userEmail: currentUser?.email || 'alex@example.com',
      platform,
      content: content.trim(),
      status: 'Published',
      charCount: validation.charCount,
      limit: validation.limit,
    });

    showToast(`Post published and recorded to posts.csv for ${platform}.`, 'success');
    setContent('');
    if (onPostCreated) onPostCreated();
  };

  // Save to drafts.csv
  const handleSaveDraft = () => {
    if (!content.trim()) return;

    csvStorage.saveDraft({
      userEmail: currentUser?.email || 'alex@example.com',
      platform,
      content: content.trim(),
      isFavorite: false,
    });

    showToast(`Draft saved to drafts.csv for ${platform}.`, 'success');
    setContent('');
    if (onDraftSaved) onDraftSaved();
  };

  // Schedule future release -> saves to posts.csv with Scheduled status
  const handleConfirmSchedule = (scheduledAt) => {
    setShowScheduleModal(false);

    csvStorage.savePost({
      userEmail: currentUser?.email || 'alex@example.com',
      platform,
      content: content.trim(),
      status: 'Scheduled',
      charCount: validation.charCount,
      limit: validation.limit,
      scheduledAt,
    });

    showToast(`Post scheduled for ${scheduledAt} and recorded to posts.csv.`, 'success');
    setContent('');
    if (onPostCreated) onPostCreated();
  };

  return (
    <div className="composer-layout-grid">
      {/* Left: Classic Editorial Composer Card */}
      <div className="composer-card-main">
        {/* Header */}
        <div className="composer-card-header">
          <div className="header-pill">Controlled Component Engine</div>
          <h2 className="composer-heading">
            Post Composer
          </h2>
          <p className="composer-subheading">
            Validate platform character limits in real-time and store records into structured CSV files.
          </p>
        </div>

        {/* 1. Platform Switcher */}
        <PlatformSelector
          selectedPlatform={platform}
          onSelectPlatform={setPlatform}
        />

        {/* 2. Controlled Textarea Component */}
        <div className="composer-editor-wrapper">
          <div className="editor-label-bar">
            <label htmlFor="composer-textarea" className="editor-label">
              Composition Text
            </label>
            <span className="editor-hint">
              Synchronized with preview and CSV storage
            </span>
          </div>

          <div className={`textarea-container ${validation.isExceeded ? 'has-error' : ''}`}>
            <textarea
              id="composer-textarea"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Enter your ${platform} publication content here... (Maximum limit: ${validation.limit} characters)`}
              className="composer-textarea"
            />

            {/* Professional Text Utility Toolbar (No emojis) */}
            <div className="editor-toolbar">
              <div className="toolbar-left">
                <button
                  type="button"
                  onClick={insertQuote}
                  className="toolbar-btn"
                  title="Insert Quote block"
                >
                  <Quote className="w-3.5 h-3.5 text-slate-400" />
                  <span>Quote</span>
                </button>
                <button
                  type="button"
                  onClick={insertBullet}
                  className="toolbar-btn"
                  title="Insert Bullet Point"
                >
                  <List className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bullet</span>
                </button>
                <button
                  type="button"
                  onClick={insertMention}
                  className="toolbar-btn"
                  title="Insert Mention"
                >
                  <AtSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mention</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={content.length === 0}
                  className="toolbar-btn text-danger disabled-btn"
                  title="Clear editor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Hashtag Quick Chips */}
              <div className="toolbar-right">
                <Hash className="w-3 h-3 text-slate-500" />
                {COMMON_HASHTAGS.slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertHashtag(tag)}
                    className="hashtag-chip"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Character Counter with Dynamic Limit */}
        <CharacterCounter validation={validation} platformName={platform} />

        {/* 4. Action Buttons */}
        <div className="composer-actions-bar">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={!content.trim()}
            className="btn-draft"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save to drafts.csv</span>
          </button>

          <div className="actions-right">
            <button
              type="button"
              onClick={() => setShowScheduleModal(true)}
              disabled={!validation.isValid}
              className="btn-schedule"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={!validation.isValid}
              className="btn-publish"
            >
              <Send className="w-4 h-4" />
              <span>Publish to {platform}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right: Platform Mockup Panel */}
      <div className="preview-panel-sticky">
        <PostPreview
          platform={platform}
          content={content}
          authorName={currentUser?.name || 'Alex Morgan'}
        />
      </div>

      {/* Schedule Picker Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onConfirmSchedule={handleConfirmSchedule}
        platform={platform}
      />
    </div>
  );
}
