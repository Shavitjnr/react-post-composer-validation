/**
 * Centralized Social Media Platform Rules and Validation Logic
 */

export const PLATFORMS = {
  Twitter: {
    id: 'Twitter',
    name: 'Twitter / X',
    limit: 280,
    warningThreshold: 20, // Warn when 20 chars left
    color: '#1d9bf0',
    badge: 'X',
    supportsMedia: true,
  },
  LinkedIn: {
    id: 'LinkedIn',
    name: 'LinkedIn',
    limit: 3000,
    warningThreshold: 150, // Warn when 150 chars left
    color: '#0a66c2',
    badge: 'in',
    supportsMedia: true,
  },
  Instagram: {
    id: 'Instagram',
    name: 'Instagram',
    limit: 2200,
    warningThreshold: 100,
    color: '#e1306c',
    badge: 'IG',
    supportsMedia: true,
  },
  Facebook: {
    id: 'Facebook',
    name: 'Facebook',
    limit: 5000,
    warningThreshold: 200,
    color: '#1877f2',
    badge: 'FB',
    supportsMedia: true,
  },
};

export function getPlatformLimit(platform) {
  return PLATFORMS[platform]?.limit || 280;
}

export function validatePost(content, platform) {
  const cfg = PLATFORMS[platform] || PLATFORMS.Twitter;
  const charCount = content ? Array.from(content).length : 0;
  const limit = cfg.limit;
  const remaining = limit - charCount;
  const wordCount = content?.trim() ? content.trim().split(/\s+/).length : 0;

  const isExceeded = charCount > limit;
  const excess = isExceeded ? charCount - limit : 0;
  const isWarning = !isExceeded && remaining <= cfg.warningThreshold && charCount > 0;
  const isValid = charCount > 0 && !isExceeded;

  let message = '';
  if (charCount === 0) {
    message = 'Post cannot be empty.';
  } else if (isExceeded) {
    message = `Character limit exceeded by ${excess} character${excess > 1 ? 's' : ''}! (${charCount} / ${limit})`;
  } else if (isWarning) {
    message = `Near character limit: only ${remaining} character${remaining > 1 ? 's' : ''} remaining.`;
  }

  return {
    charCount,
    limit,
    remaining,
    wordCount,
    isExceeded,
    isWarning,
    isValid,
    excess,
    message,
  };
}
