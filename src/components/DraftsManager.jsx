import React, { useState } from 'react';
import {
  FileText,
  Star,
  Copy,
  Trash2,
  Search,
  PenSquare,
  Plus
} from 'lucide-react';
import { postService } from '../services/postService';
import { PLATFORM_RULES } from '../constants/platformRules';

export function DraftsManager({ onOpenComposerWithContent, onNavigateToComposer, showToast }) {
  const [drafts, setDrafts] = useState(() => postService.getDrafts());
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const refreshDrafts = () => {
    setDrafts(postService.getDrafts());
  };

  const filteredDrafts = drafts.filter((d) => {
    if (platformFilter !== 'All' && d.Platform !== platformFilter) return false;
    if (onlyFavorites && d.IsFavorite !== 'true') return false;
    if (search.trim() && !d.Content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleToggleFavorite = (id) => {
    postService.toggleFavoriteDraft(id);
    refreshDrafts();
  };

  const handleDuplicate = (draft) => {
    postService.duplicateDraft(draft);
    showToast('Draft duplicated successfully!', 'success');
    refreshDrafts();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this draft permanently?')) {
      postService.deleteDraft(id);
      showToast('Draft deleted', 'info');
      refreshDrafts();
    }
  };

  return (
    <div className="section-container">
      <div className="section-header-row">
        <div>
          <div className="header-pill">Editorial Ideas & Staging</div>
          <h2 className="section-title">Drafts Library</h2>
          <p className="section-subtitle">
            Saved drafts are isolated per workspace and can be reviewed, edited, duplicated, or scheduled.
          </p>
        </div>

        <div className="section-actions-group">
          {onNavigateToComposer && (
            <button
              type="button"
              onClick={onNavigateToComposer}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Draft</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-search-card">
        <div className="filter-pills-row">
          {['All', 'Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube'].map((plat) => (
            <button
              key={plat}
              type="button"
              onClick={() => setPlatformFilter(plat)}
              className={`filter-pill-btn ${platformFilter === plat ? 'active' : ''}`}
            >
              {plat}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`filter-pill-btn fav-btn ${onlyFavorites ? 'active' : ''}`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>

        <div className="search-input-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search drafts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-field"
          />
        </div>
      </div>

      {/* Drafts Cards Grid */}
      <div className="cards-grid-3">
        {filteredDrafts.length === 0 ? (
          <div className="empty-state-box" style={{ gridColumn: '1 / -1' }}>
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p>No drafts match your current filter.</p>
          </div>
        ) : (
          filteredDrafts.map((d) => {
            const cfg = PLATFORM_RULES[d.Platform] || { color: '#0f172a', badge: d.Platform };
            const isFav = d.IsFavorite === 'true';

            return (
              <div key={d.ID} className="draft-item-card">
                <div className="draft-card-header">
                  <span
                    className="platform-tag"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {cfg.name || d.Platform}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(d.ID)}
                    className="star-fav-btn"
                    title={isFav ? 'Remove from favorites' : 'Mark as favorite'}
                  >
                    <Star
                      className={`w-4 h-4 ${isFav ? 'fill-amber text-amber' : 'text-slate-400'}`}
                    />
                  </button>
                </div>

                <p className="draft-body-text">{d.Content}</p>

                <div className="draft-card-footer">
                  <span className="draft-timestamp">{d.CreatedAt ? d.CreatedAt.slice(0, 16) : '—'}</span>

                  <div className="draft-actions">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenComposerWithContent) {
                          onOpenComposerWithContent(d.Content, d.Platform);
                        }
                      }}
                      className="btn-icon-action"
                      title="Edit in Post Composer"
                    >
                      <PenSquare className="w-3.5 h-3.5 text-primary" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(d)}
                      className="btn-icon-action"
                      title="Duplicate draft"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(d.ID)}
                      className="btn-icon-action delete"
                      title="Delete draft"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
