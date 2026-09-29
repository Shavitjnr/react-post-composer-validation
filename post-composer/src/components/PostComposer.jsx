import { useState, useEffect } from 'react';

function PostComposer() {
  // 1. State for selected platform (defaults to "Twitter")
  const [platform, setPlatform] = useState("Twitter");

  // 2. State for the user's post text (controlled component value)
  const [post, setPost] = useState("");

  // 3. State to store saved posts list for CSV storage & export
  const [savedPosts, setSavedPosts] = useState(() => {
    const saved = localStorage.getItem("composer_posts_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse saved posts:", err);
      }
    }
    // Default initial mock data matching public/posts.csv
    return [
      {
        id: 1,
        timestamp: "2026-09-29 09:30:00",
        platform: "Twitter",
        characterCount: 68,
        limit: 280,
        status: "Valid",
        content: "Excited to launch our new product today! Stay tuned for updates. 🚀",
      },
      {
        id: 2,
        timestamp: "2026-09-29 09:45:00",
        platform: "LinkedIn",
        characterCount: 142,
        limit: 3000,
        status: "Valid",
        content: "Thrilled to share insights on modern React state management and controlled components. Continuous learning is key in tech leadership.",
      },
    ];
  });

  // 4. Toast alert feedback state
  const [toastMessage, setToastMessage] = useState("");

  // Sync saved posts to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("composer_posts_data", JSON.stringify(savedPosts));
  }, [savedPosts]);

  // Toast auto-dismiss timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Determine character limit dynamically based on chosen platform
  const limit = platform === "Twitter" ? 280 : 3000;

  // Check whether the character count exceeds the allowed limit
  const exceeded = post.length > limit;

  // Calculate percentage used for visual progress bar
  const progressPercent = Math.min(100, Math.round((post.length / limit) * 100));

  // Determine status color theme
  const getProgressColor = () => {
    if (exceeded) return "#ef4444"; // Red (Exceeded)
    if (progressPercent > 80) return "#f59e0b"; // Warning Amber (>80%)
    return platform === "Twitter" ? "#1d9bf0" : "#0a66c2"; // Platform brand
  };

  // Handler to clear textarea input
  const handleClear = () => {
    setPost("");
  };

  // Handler to submit and store the post
  const handleSubmit = (e) => {
    e.preventDefault();
    if (exceeded || post.trim().length === 0) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newEntry = {
      id: Date.now(),
      timestamp: formattedDate,
      platform: platform,
      characterCount: post.length,
      limit: limit,
      status: "Valid",
      content: post.trim(),
    };

    setSavedPosts([newEntry, ...savedPosts]);
    setPost("");
    setToastMessage(`✓ Post saved & added to CSV dataset for ${platform}!`);
  };

  // Handler to delete a single post entry
  const handleDeletePost = (id) => {
    setSavedPosts(savedPosts.filter((item) => item.id !== id));
    setToastMessage("Item removed from dataset.");
  };

  // Function to format and download current data as a CSV file
  const handleDownloadCSV = () => {
    if (savedPosts.length === 0) {
      alert("No posts available to export!");
      return;
    }

    // CSV Header row
    const headers = ["ID", "Timestamp", "Platform", "CharacterCount", "Limit", "Status", "PostContent"];

    // Escape CSV cell values to handle quotes, commas, and multiline text
    const escapeCsvValue = (val) => {
      const stringVal = String(val ?? "");
      return `"${stringVal.replace(/"/g, '""')}"`;
    };

    // Format all rows
    const rows = savedPosts.map((row) => [
      row.id,
      escapeCsvValue(row.timestamp),
      row.platform,
      row.characterCount,
      row.limit,
      row.status,
      escapeCsvValue(row.content),
    ]);

    // Build complete CSV string
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `posts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage("✓ CSV file downloaded successfully!");
  };

  return (
    <div className="layout-wrapper">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-banner">{toastMessage}</div>}

      {/* Main Composer Card */}
      <div className="composer-card">
        {/* Header with Title and Platform Badges */}
        <div className="card-header">
          <div className="header-badge">React Controlled Component</div>
          <h1 className="title">Post Composer Pro</h1>
          <p className="subtitle">
            Validate platform character limits in real-time and export posts directly to CSV.
          </p>
        </div>

        {/* Platform Selection */}
        <div className="form-group">
          <label className="label">
            <span>Select Target Platform</span>
            <span className="limit-pill">Limit: {limit.toLocaleString()} chars</span>
          </label>
          <div className="platform-selector">
            <button
              type="button"
              className={`platform-btn twitter-btn ${platform === "Twitter" ? "active" : ""}`}
              onClick={() => setPlatform("Twitter")}
            >
              <svg className="platform-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Twitter (280)</span>
            </button>

            <button
              type="button"
              className={`platform-btn linkedin-btn ${platform === "LinkedIn" ? "active" : ""}`}
              onClick={() => setPlatform("LinkedIn")}
            >
              <svg className="platform-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.763z"/>
              </svg>
              <span>LinkedIn (3,000)</span>
            </button>
          </div>
        </div>

        {/* Controlled Textarea Component */}
        {/* EXPLANATION FOR VIVA/EXAM:
            The textarea below is a controlled component because its value is bound to the
            'post' React state, and changes are intercepted via onChange to update that state. */}
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="post-textarea" className="label">
              Compose Message
            </label>
            <span className="character-stats">
              <strong className={exceeded ? "stat-error" : ""}>
                {post.length.toLocaleString()}
              </strong>{" "}
              / {limit.toLocaleString()}
            </span>
          </div>

          <div className="textarea-wrapper">
            <textarea
              id="post-textarea"
              className={`textarea-input ${exceeded ? "textarea-error" : ""}`}
              rows="5"
              placeholder={`Write your ${platform} post here... (Validation rules: max ${limit} characters)`}
              value={post}
              onChange={(e) => setPost(e.target.value)}
            />
            {/* Live Progress Bar */}
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: getProgressColor(),
                }}
              />
            </div>
          </div>
        </div>

        {/* Conditional Error Notification */}
        {exceeded && (
          <div className="error-banner">
            <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="error-text">
              <strong>Character limit exceeded!</strong>
              <span>
                Your post has {post.length - limit} excess characters. Twitter limit is 280, LinkedIn limit is 3000.
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="button-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={post.length === 0}
          >
            Clear Text
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={exceeded || post.trim().length === 0}
          >
            <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <span>Post & Save to CSV</span>
          </button>
        </div>
      </div>

      {/* CSV Dataset Storage & History Section */}
      <div className="history-card">
        <div className="history-header">
          <div>
            <h2 className="history-title">Stored Posts Dataset (CSV)</h2>
            <p className="history-subtitle">
              All validated posts are recorded into the database and can be exported as standard CSV.
            </p>
          </div>
          <div className="history-actions">
            <button
              type="button"
              className="btn btn-csv"
              onClick={handleDownloadCSV}
              disabled={savedPosts.length === 0}
            >
              <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Download posts.csv ({savedPosts.length})</span>
            </button>
          </div>
        </div>

        {/* Dataset Table */}
        {savedPosts.length === 0 ? (
          <div className="empty-state">
            <p>No posts saved yet. Compose a post above and click "Post & Save to CSV".</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="posts-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Timestamp</th>
                  <th>Length / Limit</th>
                  <th>Content Preview</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {savedPosts.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={`tag-badge tag-${item.platform.toLowerCase()}`}>
                        {item.platform}
                      </span>
                    </td>
                    <td className="time-cell">{item.timestamp}</td>
                    <td className="count-cell">
                      <span className="mono-count">{item.characterCount}</span> / {item.limit}
                    </td>
                    <td className="content-cell" title={item.content}>
                      {item.content.length > 90 ? `${item.content.substring(0, 90)}...` : item.content}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleDeletePost(item.id)}
                        title="Delete entry"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostComposer;
