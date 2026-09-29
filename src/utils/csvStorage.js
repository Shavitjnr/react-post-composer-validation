/**
 * CSV Storage & Engine
 * Manages full CRUD operations for Users (with passwords), Posts, and Drafts stored in CSV format.
 */

// Initial default CSV datasets
export const DEFAULT_USERS_CSV = `ID,Name,Email,Password,Role,CreatedAt
usr_1,"Alex Morgan","alex@example.com","password123","Admin","2026-09-29 09:00:00"
usr_2,"Sarah Connor","sarah@tech.org","sarahSecure#2026","Creator","2026-09-29 09:15:00"
usr_3,"David Chen","david@startup.io","davidPass!789","Editor","2026-09-29 09:30:00"`;

export const DEFAULT_POSTS_CSV = `ID,UserEmail,Platform,Status,CharCount,Limit,ScheduledAt,PublishedAt,Content
post_1,"alex@example.com","Twitter","Published",126,280,"","2026-09-29 09:30:00","Excited to launch our new product today! Real-time platform character validation is finally here. 🚀 #Tech #Innovation"
post_2,"alex@example.com","LinkedIn","Published",248,3000,"","2026-09-29 09:45:00","Clean architecture and controlled components in React make scaling modern frontend applications seamless. Continuous learning and strict validation rules are essential in modern software engineering."
post_3,"alex@example.com","Twitter","Scheduled",114,280,"2026-10-01 10:00:00","","Upcoming Webinar: 'Mastering Database Relations and CSV Pipelines with React'. Reserve your free seat now! 🎙️"
post_4,"sarah@tech.org","LinkedIn","Scheduled",182,3000,"2026-10-02 14:30:00","","We are looking for passionate frontend engineers who love building responsive UIs, controlled inputs, and real-time validation engines. DM me for career opportunities!"`;

export const DEFAULT_DRAFTS_CSV = `ID,UserEmail,Platform,IsFavorite,CreatedAt,Content
draft_1,"alex@example.com","Twitter","true","2026-09-29 08:30:00","Draft thoughts on custom React hooks and memoization strategies for heavy UI rerenders..."
draft_2,"alex@example.com","LinkedIn","false","2026-09-29 08:45:00","Reflecting on 5 lessons learned while building high-traffic SaaS applications. Stay tuned for the complete breakdown next Tuesday!"
draft_3,"sarah@tech.org","Twitter","true","2026-09-29 09:10:00","Top 5 productivity tools every software developer should try in 2026 🧵👇"`;

/**
 * Robust RFC-4180 compliant CSV parser
 * Correctly parses cells containing escaped quotes, commas, and line breaks
 */
export function parseCSV(csvText) {
  if (!csvText || !csvText.trim()) return [];
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c !== '')) rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c !== '')) rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.replace(/^"|"$/g, ''));
  return rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, idx) => {
      let val = row[idx] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      obj[header] = val;
    });
    return obj;
  });
}

/**
 * Converts array of objects into RFC-4180 CSV string
 */
export function toCSV(data, headers) {
  if (!data || data.length === 0) return headers.join(',') + '\r\n';

  const escapeValue = (val) => {
    const str = String(val ?? '');
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headerRow = headers.join(',');
  const dataRows = data.map((item) =>
    headers.map((h) => escapeValue(item[h])).join(',')
  );

  return [headerRow, ...dataRows].join('\r\n');
}

/**
 * Triggers instant browser file download of CSV content
 */
export function downloadCSVFile(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// LocalStorage Keys
const USERS_KEY = 'csv_users_database';
const POSTS_KEY = 'csv_posts_database';
const DRAFTS_KEY = 'csv_drafts_database';
const ACTIVE_USER_KEY = 'csv_active_user_session';

export const csvStorage = {
  // ================= USERS & PASSWORDS =================
  getUsersCSV: () => {
    let raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, DEFAULT_USERS_CSV);
      raw = DEFAULT_USERS_CSV;
    }
    return raw;
  },

  getUsers: () => {
    const csv = csvStorage.getUsersCSV();
    return parseCSV(csv);
  },

  authenticateUser: (email, password) => {
    const users = csvStorage.getUsers();
    const user = users.find(
      (u) => u.Email.toLowerCase() === email.toLowerCase() && u.Password === password
    );
    if (user) {
      const session = { id: user.ID, name: user.Name, email: user.Email, role: user.Role };
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(session));
      return { success: true, user: session };
    }
    return { success: false, error: 'Invalid email or password' };
  },

  registerUser: (name, email, password) => {
    const users = csvStorage.getUsers();
    if (users.some((u) => u.Email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'User with this email already exists in CSV database' };
    }

    const newUser = {
      ID: `usr_${Date.now()}`,
      Name: name,
      Email: email,
      Password: password, // Stored directly in CSV database
      Role: 'Creator',
      CreatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    users.push(newUser);
    const updatedCSV = toCSV(users, ['ID', 'Name', 'Email', 'Password', 'Role', 'CreatedAt']);
    localStorage.setItem(USERS_KEY, updatedCSV);

    const session = { id: newUser.ID, name: newUser.Name, email: newUser.Email, role: newUser.Role };
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(session));
    return { success: true, user: session };
  },

  getActiveUser: () => {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    // Default demo user Alex Morgan
    return {
      id: 'usr_1',
      name: 'Alex Morgan',
      email: 'alex@example.com',
      role: 'Admin',
    };
  },

  logoutUser: () => {
    localStorage.removeItem(ACTIVE_USER_KEY);
  },

  // ================= POSTS =================
  getPostsCSV: () => {
    let raw = localStorage.getItem(POSTS_KEY);
    if (!raw) {
      localStorage.setItem(POSTS_KEY, DEFAULT_POSTS_CSV);
      raw = DEFAULT_POSTS_CSV;
    }
    return raw;
  },

  getPosts: () => {
    const csv = csvStorage.getPostsCSV();
    return parseCSV(csv);
  },

  savePost: (postData) => {
    const posts = csvStorage.getPosts();
    const newPost = {
      ID: `post_${Date.now()}`,
      UserEmail: postData.userEmail || 'alex@example.com',
      Platform: postData.platform,
      Status: postData.status || 'Published',
      CharCount: postData.charCount || postData.content.length,
      Limit: postData.limit,
      ScheduledAt: postData.scheduledAt || '',
      PublishedAt: postData.status === 'Published' ? new Date().toISOString().replace('T', ' ').slice(0, 19) : '',
      Content: postData.content,
    };

    posts.unshift(newPost);
    const updatedCSV = toCSV(posts, [
      'ID',
      'UserEmail',
      'Platform',
      'Status',
      'CharCount',
      'Limit',
      'ScheduledAt',
      'PublishedAt',
      'Content',
    ]);
    localStorage.setItem(POSTS_KEY, updatedCSV);
    return newPost;
  },

  deletePost: (id) => {
    const posts = csvStorage.getPosts().filter((p) => p.ID !== id);
    const updatedCSV = toCSV(posts, [
      'ID',
      'UserEmail',
      'Platform',
      'Status',
      'CharCount',
      'Limit',
      'ScheduledAt',
      'PublishedAt',
      'Content',
    ]);
    localStorage.setItem(POSTS_KEY, updatedCSV);
  },

  updatePostStatus: (id, newStatus) => {
    const posts = csvStorage.getPosts().map((p) => (p.ID === id ? { ...p, Status: newStatus } : p));
    const updatedCSV = toCSV(posts, [
      'ID',
      'UserEmail',
      'Platform',
      'Status',
      'CharCount',
      'Limit',
      'ScheduledAt',
      'PublishedAt',
      'Content',
    ]);
    localStorage.setItem(POSTS_KEY, updatedCSV);
  },

  // ================= DRAFTS =================
  getDraftsCSV: () => {
    let raw = localStorage.getItem(DRAFTS_KEY);
    if (!raw) {
      localStorage.setItem(DRAFTS_KEY, DEFAULT_DRAFTS_CSV);
      raw = DEFAULT_DRAFTS_CSV;
    }
    return raw;
  },

  getDrafts: () => {
    const csv = csvStorage.getDraftsCSV();
    return parseCSV(csv);
  },

  saveDraft: (draftData) => {
    const drafts = csvStorage.getDrafts();
    const newDraft = {
      ID: `draft_${Date.now()}`,
      UserEmail: draftData.userEmail || 'alex@example.com',
      Platform: draftData.platform,
      IsFavorite: draftData.isFavorite ? 'true' : 'false',
      CreatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      Content: draftData.content,
    };

    drafts.unshift(newDraft);
    const updatedCSV = toCSV(drafts, ['ID', 'UserEmail', 'Platform', 'IsFavorite', 'CreatedAt', 'Content']);
    localStorage.setItem(DRAFTS_KEY, updatedCSV);
    return newDraft;
  },

  toggleDraftFavorite: (id) => {
    const drafts = csvStorage.getDrafts().map((d) =>
      d.ID === id ? { ...d, IsFavorite: d.IsFavorite === 'true' ? 'false' : 'true' } : d
    );
    const updatedCSV = toCSV(drafts, ['ID', 'UserEmail', 'Platform', 'IsFavorite', 'CreatedAt', 'Content']);
    localStorage.setItem(DRAFTS_KEY, updatedCSV);
  },

  deleteDraft: (id) => {
    const drafts = csvStorage.getDrafts().filter((d) => d.ID !== id);
    const updatedCSV = toCSV(drafts, ['ID', 'UserEmail', 'Platform', 'IsFavorite', 'CreatedAt', 'Content']);
    localStorage.setItem(DRAFTS_KEY, updatedCSV);
  },

  // Reset to initial demo CSV files
  resetAllToDefault: () => {
    localStorage.setItem(USERS_KEY, DEFAULT_USERS_CSV);
    localStorage.setItem(POSTS_KEY, DEFAULT_POSTS_CSV);
    localStorage.setItem(DRAFTS_KEY, DEFAULT_DRAFTS_CSV);
  },
};
