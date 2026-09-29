import React, { useState } from 'react';
import { PlatformSelector } from './PlatformSelector';
import { CharacterCounter } from './CharacterCounter';
import { PostPreview } from './PostPreview';
import { ScheduleModal } from './ScheduleModal';
import { AddMediaModal } from './AddMediaModal';
import { HashtagsModal } from './HashtagsModal';
import { TagsModal } from './TagsModal';
import { LocationCtaModal } from './LocationCtaModal';
import { validateContentLength, getPlatformConfig } from '../constants/platformRules';
import { postService } from '../services/postService';
import { socialService } from '../services/socialService';
import { workspaceService } from '../services/workspaceService';
import {
  Smile,
  Hash,
  AtSign,
  Trash2,
  Bookmark,
  Calendar,
  Send,
  List,
  Image,
  Tag,
  MapPin,
  Link as LinkIcon,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

const COMMON_HASHTAGS = ['#Engineering', '#Architecture', '#Tech', '#Software', '#React', '#SaaS'];
const CURATED_EMOJIS = ['🚀', '💡', '🔥', '✨', '🎙️', '👍', '📈', '👏', '🎯', '🧵', '😊', '🙌', '💼', '📊', '⚡'];

export function PostComposer({
  currentUser,
  activeWorkspace,
  showToast,
  onPostCreated,
  onDraftSaved
}) {
  const [platform, setPlatform] = useState('Instagram');
  const [content, setContent] = useState('');
  const [attachedMedia, setAttachedMedia] = useState(null);
  const [assignedTags, setAssignedTags] = useState(['Product Launch']);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showHashtagsModal, setShowHashtagsModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [locationCtaMode, setLocationCtaMode] = useState(null); // 'location' or 'cta'

  // Centralized Validation Engine
  const validation = validateContentLength(content, platform);

  const connectedAccounts = socialService.getConnectedAccounts(activeWorkspace?.ID);
  const isPlatformConnected = connectedAccounts.some((a) => a.Platform === platform);

  const insertEmoji = (emoji) => {
    setContent((prev) => (prev.endsWith(' ') || prev.length === 0 ? prev : prev + ' ') + emoji + ' ');
  };

  const insertHashtag = (tag) => {
    setContent((prev) => (prev.endsWith(' ') || prev.length === 0 ? prev : prev + ' ') + tag + ' ');
  };

  const insertMention = () => {
    const handle = prompt('Enter username without @:');
    if (handle && handle.trim()) {
      setContent((prev) => (prev.endsWith(' ') || prev.length === 0 ? prev : prev + ' ') + `@${handle.trim()} `);
    }
  };

  const insertBullet = () => {
    setContent((prev) => (prev.length === 0 ? '' : prev + '\n') + '• ');
  };

  const handleClear = () => {
    if (content.length > 0 && confirm('Clear the current text in the post editor?')) {
      setContent('');
      setAttachedMedia(null);
    }
  };

  const handleToggleTag = (tag) => {
    setAssignedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Immediate Publish (Demo Mode Simulated)
  const handlePublish = () => {
    if (!validation.isValid) return;

    const res = postService.publishPost({
      content,
      platform,
      authorEmail: currentUser?.email || 'shavitdaloutra28@gmail.com',
      mediaUrl: attachedMedia?.Url || '',
      tags: assignedTags.join(','),
    });

    showToast(res.message, 'success');
    setContent('');
    setAttachedMedia(null);
    if (onPostCreated) onPostCreated();
  };

  // Save to Drafts
  const handleSaveDraft = () => {
    if (!content.trim()) return;

    postService.saveDraft({
      content,
      platform,
      userEmail: currentUser?.email || 'shavitdaloutra28@gmail.com',
    });

    showToast(`Draft saved for ${platform} in ${activeWorkspace?.Name || 'workspace'}.`, 'success');
    setContent('');
    setAttachedMedia(null);
    if (onDraftSaved) onDraftSaved();
  };

  // Submit for Review (Approval Workflow)
  const handleSubmitReview = () => {
    if (!validation.isValid) return;

    postService.submitForReview({
      content,
      platform,
      authorEmail: currentUser?.email || 'shavitdaloutra28@gmail.com',
    });

    showToast(`Post submitted for managerial review!`, 'info');
    setContent('');
    setAttachedMedia(null);
    if (onPostCreated) onPostCreated();
  };

  // Confirm Schedule
  const handleConfirmSchedule = (scheduledAt) => {
    setShowScheduleModal(false);

    const res = postService.schedulePost({
      content,
      platform,
      authorEmail: currentUser?.email || 'shavitdaloutra28@gmail.com',
      scheduledAt,
    });

    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }

    showToast(`Post successfully queued for ${new Date(scheduledAt).toLocaleString()}!`, 'success');
    setContent('');
    setAttachedMedia(null);
    if (onPostCreated) onPostCreated();
  };

  return (
    <div className="composer-layout-grid">
      {/* Left: Classic SaaS Editorial Composer Card */}
      <div className="composer-card-main">
        {/* Header */}
        <div className="composer-card-header">
          <div className="header-meta-flex">
            <div className="header-pill">
              Workspace: {activeWorkspace?.Name || 'Personal Brand'}
            </div>
            <div className="connection-status-pill">
              <span className={`status-dot ${isPlatformConnected ? 'online' : 'demo'}`} />
              <span>{isPlatformConnected ? `${platform} Connected` : `${platform} (Demo Mode)`}</span>
            </div>
          </div>
          <h2 className="composer-heading">Social Post Composer</h2>
          <p className="composer-subheading">
            Compose, format, validate, and orchestrate publications across all five supported social networks.
          </p>
        </div>

        {/* 1. Target Platform Channel Selector */}
        <PlatformSelector
          selectedPlatform={platform}
          onSelectPlatform={setPlatform}
        />

        {/* 2. Controlled Textarea Component */}
        <div className="composer-editor-wrapper">
          <div className="editor-label-bar">
            <label htmlFor="composer-textarea" className="editor-label">
              Post Composition Text
            </label>
            <span className="editor-hint">
              Synchronized live with preview mockup & validation rules
            </span>
          </div>

          <div className={`textarea-container ${validation.isExceeded ? 'has-error' : ''}`}>
            <textarea
              id="composer-textarea"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your ${platform} publication here... (Max limit: ${validation.limit} characters)`}
              className="composer-textarea"
            />

            {/* Attached Media Asset Chip */}
            {attachedMedia && (
              <div className="attached-media-banner">
                <div className="media-chip-info">
                  <Image className="w-4 h-4 text-primary" />
                  <span>Attached: <strong>{attachedMedia.Title}</strong> ({attachedMedia.SizeMB} MB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedMedia(null)}
                  className="btn-remove-attachment"
                  title="Remove attached asset"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Assigned Tags Badges */}
            {assignedTags.length > 0 && (
              <div className="composer-tags-strip">
                <span className="tags-strip-label">Tags:</span>
                {assignedTags.map((t) => (
                  <span key={t} className="composer-tag-chip">
                    #{t}
                    <button type="button" onClick={() => handleToggleTag(t)}>×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Professional Text Utility Toolbar */}
            <div className="editor-toolbar">
              <div className="toolbar-left">
                {/* + Add Media Button */}
                <button
                  type="button"
                  onClick={() => setShowMediaModal(true)}
                  className="toolbar-btn"
                  title="Attach image or video from media library"
                >
                  <Image className="w-3.5 h-3.5 text-primary" />
                  <span>+ Media</span>
                </button>

                {/* + Add Hashtag Button */}
                <button
                  type="button"
                  onClick={() => setShowHashtagsModal(true)}
                  className="toolbar-btn"
                  title="Open hashtag vault"
                >
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  <span>+ Hashtag</span>
                </button>

                {/* + Add Mention Button */}
                <button
                  type="button"
                  onClick={insertMention}
                  className="toolbar-btn"
                  title="Insert profile mention"
                >
                  <AtSign className="w-3.5 h-3.5 text-slate-500" />
                  <span>+ Mention</span>
                </button>

                {/* + Add Tag Button */}
                <button
                  type="button"
                  onClick={() => setShowTagsModal(true)}
                  className="toolbar-btn"
                  title="Assign organizational tags"
                >
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span>+ Tag</span>
                </button>

                {/* + Add Location */}
                <button
                  type="button"
                  onClick={() => setLocationCtaMode('location')}
                  className="toolbar-btn"
                  title="Append location marker"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>+ Location</span>
                </button>

                {/* + Add CTA */}
                <button
                  type="button"
                  onClick={() => setLocationCtaMode('cta')}
                  className="toolbar-btn"
                  title="Append Call-To-Action link"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>+ CTA</span>
                </button>

                {/* Emoji button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`toolbar-btn ${showEmojiPicker ? 'active-tool' : ''}`}
                  title="Insert Emoji"
                >
                  <Smile className="w-3.5 h-3.5 text-amber-500" />
                  <span>Emoji</span>
                </button>

                {/* Bullet */}
                <button
                  type="button"
                  onClick={insertBullet}
                  className="toolbar-btn"
                  title="Insert Bullet Point"
                >
                  <List className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bullet</span>
                </button>

                {/* Clear */}
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

              {/* Quick Hashtag Chips */}
              <div className="toolbar-right">
                <Hash className="w-3 h-3 text-slate-400" />
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

            {/* Emoji Quick Picker Bar */}
            {showEmojiPicker && (
              <div className="emoji-picker-tray">
                <span className="tray-label">Emojis:</span>
                <div className="emoji-list">
                  {CURATED_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      className="emoji-btn"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
            <span>Save Draft</span>
          </button>

          <div className="actions-right">
            <button
              type="button"
              onClick={handleSubmitReview}
              disabled={!validation.isValid}
              className="btn-secondary"
              title="Submit for managerial review and approval"
            >
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Submit for Review</span>
            </button>

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
              <span>Publish Now (Demo)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right: Live Platform Mockup Sticky Preview */}
      <div className="preview-panel-sticky">
        <PostPreview
          platform={platform}
          content={content}
          authorName={currentUser?.name || 'Shavit Daloutra'}
          mediaUrl={attachedMedia?.Url || null}
        />
      </div>

      {/* MODALS */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onConfirm={handleConfirmSchedule}
        platform={platform}
      />

      <AddMediaModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onSelectMedia={(media) => setAttachedMedia(media)}
        showToast={showToast}
      />

      <HashtagsModal
        isOpen={showHashtagsModal}
        onClose={() => setShowHashtagsModal(false)}
        onInsertHashtag={insertHashtag}
        showToast={showToast}
      />

      <TagsModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        selectedTags={assignedTags}
        onToggleTag={handleToggleTag}
        showToast={showToast}
      />

      <LocationCtaModal
        isOpen={Boolean(locationCtaMode)}
        onClose={() => setLocationCtaMode(null)}
        mode={locationCtaMode}
        onApply={(text) => setContent((prev) => prev + text)}
        showToast={showToast}
      />
    </div>
  );
}
