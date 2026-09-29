import React from 'react';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  ThumbsUp,
  MessageSquare,
  Send,
  MoreHorizontal,
  CheckCircle,
  Globe
} from 'lucide-react';

export function PostPreview({ platform, content, authorName = 'Alex Morgan' }) {
  const displayContent = content.trim() || 'Your live post preview will render here in real-time as you type in the editor.';

  const renderFormattedText = (text) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, i) => {
      if (part.startsWith('#') || part.startsWith('@')) {
        return (
          <span
            key={i}
            className={platform === 'Twitter' ? 'hashtag-twitter' : 'hashtag-linkedin'}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const initials = authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="preview-container">
      <div className="preview-header-row">
        <span className="preview-label">Live Platform Mockup</span>
        <span className="preview-platform-tag">{platform} Feed</span>
      </div>

      {/* TWITTER / X CARD */}
      {platform === 'Twitter' && (
        <div className="mockup-twitter-card">
          <div className="mockup-author-row">
            <div className="mockup-avatar twitter-avatar">{initials}</div>
            <div className="mockup-author-meta">
              <div className="mockup-names">
                <span className="mockup-name">{authorName}</span>
                <CheckCircle className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                <span className="mockup-handle">@{authorName.toLowerCase().replace(/\s+/g, '_')}</span>
                <span className="mockup-time">· Just now</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div className="mockup-content-body">
            {renderFormattedText(displayContent)}
          </div>

          <div className="mockup-twitter-actions">
            <button type="button" className="twitter-action-btn">
              <MessageCircle className="w-4 h-4" /> <span>28</span>
            </button>
            <button type="button" className="twitter-action-btn">
              <Repeat2 className="w-4 h-4" /> <span>14</span>
            </button>
            <button type="button" className="twitter-action-btn">
              <Heart className="w-4 h-4" /> <span>245</span>
            </button>
            <button type="button" className="twitter-action-btn">
              <Bookmark className="w-4 h-4" /> <span>9</span>
            </button>
            <button type="button" className="twitter-action-btn">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LINKEDIN CARD */}
      {platform === 'LinkedIn' && (
        <div className="mockup-linkedin-card">
          <div className="mockup-author-row">
            <div className="mockup-avatar linkedin-avatar">{initials}</div>
            <div className="mockup-author-meta">
              <div className="mockup-linkedin-title-row">
                <span className="mockup-name">{authorName}</span>
                <span className="linkedin-degree">• 1st</span>
              </div>
              <p className="mockup-headline">Software Architect & Engineering Lead</p>
              <div className="mockup-time-globe">
                <span>Just now</span>
                <span>•</span>
                <Globe className="w-3 h-3 text-slate-400" />
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-400 ml-auto" />
          </div>

          <div className="mockup-content-body">
            {renderFormattedText(displayContent)}
          </div>

          <div className="mockup-linkedin-stats">
            <div className="linkedin-reactions">
              <span className="reaction-icon-box">
                <ThumbsUp className="w-3 h-3 text-blue-400" />
              </span>
              <span className="reaction-count">112 reactions</span>
            </div>
            <span className="linkedin-counts">24 comments • 8 reposts</span>
          </div>

          <div className="mockup-linkedin-actions">
            <button type="button" className="linkedin-action-btn">
              <ThumbsUp className="w-4 h-4" /> <span>Like</span>
            </button>
            <button type="button" className="linkedin-action-btn">
              <MessageSquare className="w-4 h-4" /> <span>Comment</span>
            </button>
            <button type="button" className="linkedin-action-btn">
              <Repeat2 className="w-4 h-4" /> <span>Repost</span>
            </button>
            <button type="button" className="linkedin-action-btn">
              <Send className="w-4 h-4" /> <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* INSTAGRAM / FACEBOOK FALLBACK */}
      {(platform === 'Instagram' || platform === 'Facebook') && (
        <div className="mockup-general-card">
          <div className="mockup-author-row">
            <div className="mockup-avatar general-avatar">{initials}</div>
            <div>
              <span className="mockup-name">{authorName}</span>
              <p className="mockup-headline">{platform} Preview</p>
            </div>
          </div>
          <div className="mockup-content-body">
            {renderFormattedText(displayContent)}
          </div>
        </div>
      )}
    </div>
  );
}
