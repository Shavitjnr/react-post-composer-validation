import React, { useState } from 'react';
import { csvStorage } from '../utils/csvStorage';
import { PLATFORMS } from '../utils/validation';
import {
  FileText,
  Star,
  Copy,
  Trash2,
  Search,
  Plus
} from 'lucide-react';

export function DraftsManager({ onOpenComposerWithContent, showToast }) {
  const [drafts, setDrafts] = useState(() => csvStorage.getDrafts());
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const refreshDrafts = () => {
    setDrafts(csvStorage.getDrafts());
  };

  const filteredDrafts = drafts.filter((d) => {
    if (platformFilter !== 'All' && d.Platform !== platformFilter) return false;
    if (onlyFavorites && d.IsFavorite !== 'true') return false;
    if (search.trim() && !d.Content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleToggleFavorite = (id) => {
    csvStorage.toggleDraftFavorite(id);
    refreshDrafts();
  };

  const handleDuplicate = (draft) => {
    csvStorage.saveDraft({
      userEmail: draft.UserEmail,
      platform: draft.Platform,
      content: `${draft.Content} (Copy)`,
      isFavorite: false,
    });
    showToast('Draft duplicated in drafts.csv', 'success');
    refreshDrafts();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this draft from drafts.csv?')) {
      csvStorage.deleteDraft(id);
      showToast('Draft deleted', 'info');
      refreshDrafts();
    }
  };

  return (
    <div className="section-container">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Drafts Repository (drafts.csv)</h2>
          <p className="section-subtitle">
            Saved drafts are stored in <code>data/drafts.csv</code> and can be edited or duplicated.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-search-card">
        <div className="search-input-box">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search within drafts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-field"
          />
        </div>

        <div className="filter-pills-row">
          {['All', ...Object.keys(PLATFORMS)].map((plt) => (
            <button
              key={plt}
              type="button"
              onClick={() => setPlatformFilter(plt)}
              className={`filter-pill-btn ${platformFilter === plt ? 'active' : ''}`}
            >
              {plt}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`filter-pill-btn fav-btn ${onlyFavorites ? 'active' : ''}`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber text-amber' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Drafts Grid */}
      {filteredDrafts.length === 0 ? (
        <div className="empty-state-box">
          <FileText className="w-8 h-8 text-slate-500 mb-2" />
          <p>No drafts match your filters.</p>
        </div>
      ) : (
        <div className="cards-grid-3">
          {filteredDrafts.map((d) => {
            const cfg = PLATFORMS[d.Platform] || PLATFORMS.Twitter;
            const isFav = d.IsFavorite === 'true';

            return (
              <div key={d.ID} className="draft-item-card">
                <div>
                  <div className="draft-card-header">
                    <span className="platform-tag" style={{ backgroundColor: cfg.color }}>
                      {d.Platform}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(d.ID)}
                      className="star-fav-btn"
                      title={isFav ? 'Remove favorite' : 'Mark favorite'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber text-amber' : 'text-slate-500'}`} />
                    </button>
                  </div>
                  <p className="draft-body-text">{d.Content}</p>
                </div>

                <div className="draft-card-footer">
                  <span className="draft-timestamp">{d.CreatedAt}</span>
                  <div className="draft-actions">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(d)}
                      className="btn-icon-action"
                      title="Duplicate draft"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(d.ID)}
                      className="btn-icon-action delete"
                      title="Delete draft"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
