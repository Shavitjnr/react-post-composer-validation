import React from 'react';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageSquare,
  Send,
  MoreHorizontal,
  CheckCircle,
  Globe,
  Youtube,
  Play
} from 'lucide-react';

export function PostPreview({ platform, content, authorName = 'Personal Brand', mediaUrl = null }) {
  const displayContent = content.trim() || 'Your live post preview will render here in real-time as you type in the editor.';

  const renderFormattedText = (text) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, i) => {
      if (part.startsWith('#') || part.startsWith('@')) {
        return (
          <span
            key={i}
            className="hashtag-colored"
            style={{
              color: platform === 'Twitter' ? '#0f172a' : platform === 'LinkedIn' ? '#0a66c2' : platform === 'Instagram' ? '#e1306c' : '#1877f2',
              fontWeight: 600
            }}
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
        <div>
          <span className="preview-label">Live Platform Mockup</span>
          <span className="preview-disclaimer">Preview — Simulation</span>
        </div>
        <span className="preview-platform-tag">{platform} Feed</span>
      </div>

      {/* 1. X / TWITTER MOCKUP */}
      {platform === 'Twitter' && (
        <div className="mockup-twitter-card">
          <div className="mockup-author-row">
            <div className="mockup-avatar twitter-avatar">{initials}</div>
            <div className="mockup-author-meta">
              <div className="mockup-names">
                <span className="mockup-name">{authorName}</span>
                <CheckCircle className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
                <span className="mockup-handle">@{authorName.toLowerCase().replace(/\s+/g, '_')}</span>
                <span className="mockup-time">· Just now</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="mockup-content-body">
            {renderFormattedText(displayContent)}
          </div>

          {mediaUrl && (
            <div className="mockup-media-wrapper">
              <img src={mediaUrl} alt="Attached asset" className="mockup-image" />
            </div>
          )}

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
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. LINKEDIN MOCKUP */}
      {platform === 'LinkedIn' && (
        <div className="mockup-linkedin-card">
          <div className="mockup-author-row">
            <div className="mockup-avatar linkedin-avatar">{initials}</div>
            <div className="mockup-author-meta">
              <div>
                <div className="mockup-linkedin-title-row">
                  <span className="mockup-name">{authorName}</span>
                  <span className="linkedin-degree">· 1st</span>
                </div>
                <div className="mockup-headline">Senior Technical Architect & Founder</div>
                <div className="mockup-time-globe">
                  <span>Just now</span>
                  <span>·</span>
                  <Globe className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="mockup-content-body">
            {renderFormattedText(displayContent)}
          </div>

          {mediaUrl && (
            <div className="mockup-media-wrapper">
              <img src={mediaUrl} alt="Attached asset" className="mockup-image" />
            </div>
          )}

          <div className="mockup-linkedin-stats">
            <div className="linkedin-reactions">
              <span className="reaction-icon-box">👍</span>
              <span className="reaction-count">142 reactions</span>
            </div>
            <span>19 comments · 8 reposts</span>
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

      {/* 3. INSTAGRAM MOCKUP */}
      {platform === 'Instagram' && (
        <div className="mockup-instagram-card">
          <div className="mockup-author-row">
            <div className="mockup-avatar instagram-avatar">{initials}</div>
            <div className="mockup-author-meta">
              <div>
                <div className="mockup-name">{authorName.toLowerCase().replace(/\s+/g, '_')}</div>
                <span className="mockup-time">Original audio</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="instagram-media-stage">
            {mediaUrl ? (
              <img src={mediaUrl} alt="Post visual" className="instagram-photo" />
            ) : (
              <div className="instagram-placeholder-box">
                <span className="placeholder-tag">Image / Carousel Asset</span>
              </div>
            )}
          </div>

          <div className="instagram-action-bar">
            <div className="action-bar-left">
              <Heart className="w-5 h-5 text-slate-700" />
              <MessageCircle className="w-5 h-5 text-slate-700" />
              <Send className="w-5 h-5 text-slate-700" />
            </div>
            <Bookmark className="w-5 h-5 text-slate-700" />
          </div>

          <div className="instagram-caption-block">
            <span className="instagram-likes-count">1,842 likes</span>
            <p className="instagram-caption-text">
              <strong>{authorName.toLowerCase().replace(/\s+/g, '_')}</strong>{' '}
              {renderFormattedText(displayContent)}
            </p>
            <span className="view-comments-label">View all 48 comments</span>
            <span className="post-date-label">JUST NOW</span>
          </div>
        </div>
      )}

      {/* 4. FACEBOOK MOCKUP */}
      {platform === 'Facebook' && (
        <div className="mockup-facebook-card">
          <div className="mockup-author-row">
            <div className="mockup-avatar facebook-avatar">{initials}</div>
            <div className="mockup-author-meta">
              <div>
                <div className="mockup-name">{authorName}</div>
                <div className="mockup-time-globe">
                  <span>Just now</span> · <Globe className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="mockup-content-body">
            {renderFormattedText(displayContent)}
          </div>

          {mediaUrl && (
            <div className="mockup-media-wrapper">
              <img src={mediaUrl} alt="Attached asset" className="mockup-image" />
            </div>
          )}

          <div className="facebook-reaction-bar">
            <span>👍 ❤️ 284</span>
            <span>42 Comments · 18 Shares</span>
          </div>

          <div className="facebook-actions-grid">
            <button type="button" className="facebook-action-btn">
              <ThumbsUp className="w-4 h-4" /> <span>Like</span>
            </button>
            <button type="button" className="facebook-action-btn">
              <MessageSquare className="w-4 h-4" /> <span>Comment</span>
            </button>
            <button type="button" className="facebook-action-btn">
              <Share2 className="w-4 h-4" /> <span>Share</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. YOUTUBE MOCKUP */}
      {platform === 'YouTube' && (
        <div className="mockup-youtube-card">
          <div className="mockup-author-row">
            <div className="mockup-avatar youtube-avatar">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div className="mockup-author-meta">
              <div>
                <div className="mockup-name">{authorName} Channel</div>
                <span className="mockup-time">Community post · Just now</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="mockup-content-body">
            {renderFormattedText(displayContent)}
          </div>

          {mediaUrl && (
            <div className="youtube-media-box">
              <img src={mediaUrl} alt="Video thumbnail / community image" className="mockup-image" />
              <div className="play-overlay-badge">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          )}

          <div className="youtube-actions-row">
            <div className="youtube-likes-group">
              <button type="button" className="youtube-action-btn">
                <ThumbsUp className="w-4 h-4" /> <span>3.4K</span>
              </button>
            </div>
            <button type="button" className="youtube-action-btn">
              <MessageSquare className="w-4 h-4" /> <span>218</span>
            </button>
            <button type="button" className="youtube-action-btn">
              <Share2 className="w-4 h-4" /> <span>Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
