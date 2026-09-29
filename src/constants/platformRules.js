/**
 * Post Composer Pro — Centralized Platform Rules & Character Limits
 * Supported Platforms ONLY: Instagram, Facebook, LinkedIn, X / Twitter, YouTube
 * (TikTok is strictly excluded)
 */

export const PLATFORM_RULES = {
  Instagram: {
    id: 'Instagram',
    name: 'Instagram',
    characterLimit: 2200,
    warningThreshold: 150,
    color: '#e1306c',
    badge: 'IG',
    brandColor: '#e1306c',
    supportsMedia: true,
    supportsHashtags: true,
    mediaTypes: ['image', 'video', 'carousel'],
    description: 'Photo & Reel Captions (Max 2,200 chars)',
  },
  Facebook: {
    id: 'Facebook',
    name: 'Facebook',
    characterLimit: 5000,
    warningThreshold: 250,
    color: '#1877f2',
    badge: 'FB',
    brandColor: '#1877f2',
    supportsMedia: true,
    supportsHashtags: true,
    mediaTypes: ['image', 'video', 'link'],
    description: 'Page & Group Publications (Max 5,000 chars)',
  },
  LinkedIn: {
    id: 'LinkedIn',
    name: 'LinkedIn',
    characterLimit: 3000,
    warningThreshold: 200,
    color: '#0a66c2',
    badge: 'in',
    brandColor: '#0a66c2',
    supportsMedia: true,
    supportsHashtags: true,
    mediaTypes: ['image', 'document', 'video'],
    description: 'Professional Articles & Posts (Max 3,000 chars)',
  },
  Twitter: {
    id: 'Twitter',
    name: 'X',
    characterLimit: 280,
    warningThreshold: 25,
    color: '#0f172a',
    badge: 'X',
    brandColor: '#000000',
    supportsMedia: true,
    supportsHashtags: true,
    mediaTypes: ['image', 'video', 'poll'],
    description: 'Real-time Micro-broadcasts (Max 280 chars)',
  },
  YouTube: {
    id: 'YouTube',
    name: 'YouTube',
    characterLimit: 5000,
    warningThreshold: 200,
    color: '#ef4444',
    badge: 'YT',
    brandColor: '#ff0000',
    supportsMedia: true,
    supportsHashtags: true,
    mediaTypes: ['video', 'community_image'],
    description: 'Community Posts & Video Descriptions (Max 5,000 chars)',
  },
};

export const SUPPORTED_PLATFORMS = Object.keys(PLATFORM_RULES);

export function getPlatformConfig(platform) {
  return PLATFORM_RULES[platform] || PLATFORM_RULES.Twitter;
}

export function validateContentLength(content, platform) {
  const config = getPlatformConfig(platform);
  const charCount = content ? Array.from(content).length : 0;
  const limit = config.characterLimit;
  const remaining = limit - charCount;
  const wordCount = content?.trim() ? content.trim().split(/\s+/).length : 0;
  const isExceeded = charCount > limit;
  const isWarning = !isExceeded && remaining <= config.warningThreshold && charCount > 0;
  const isValid = charCount > 0 && !isExceeded;
  const excess = isExceeded ? charCount - limit : 0;

  let message = '';
  if (charCount === 0) {
    message = 'Post content cannot be empty.';
  } else if (isExceeded) {
    message = `Your post exceeds the ${config.name} limit by ${excess} character${excess > 1 ? 's' : ''}! (${charCount} / ${limit})`;
  } else if (isWarning) {
    message = `Approaching limit: ${remaining} character${remaining > 1 ? 's' : ''} left for ${config.name}.`;
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
    platform: config.name,
  };
}
