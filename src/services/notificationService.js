/**
 * Post Composer Pro — In-App Notification Center Service
 */

const NOTIFICATIONS_KEY = 'pcp_notifications_database';

export const notificationService = {
  getNotifications: (workspaceId = null) => {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      if (!raw) return notificationService.getInitialSeed();
      const all = JSON.parse(raw);
      return workspaceId ? all.filter((n) => !n.workspaceId || n.workspaceId === workspaceId) : all;
    } catch (e) {
      return notificationService.getInitialSeed();
    }
  },

  getInitialSeed: () => [
    {
      id: 'notif_1',
      workspaceId: 'ws_1',
      title: 'Welcome to Post Composer Pro',
      message: 'Your workspace is active on the Professional plan. Demo Mode is currently active.',
      type: 'info',
      read: false,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'notif_2',
      workspaceId: 'ws_1',
      title: 'Scheduled Queue Active',
      message: '2 posts queued for upcoming automated publishing.',
      type: 'success',
      read: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],

  notify: (workspaceId, title, message, type = 'info') => {
    const list = notificationService.getNotifications();
    const newNotif = {
      id: `notif_${Date.now()}`,
      workspaceId,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
    };
    list.unshift(newNotif);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list.slice(0, 50)));
    return newNotif;
  },

  markAsRead: (id) => {
    const list = notificationService.getNotifications();
    const target = list.find((n) => n.id === id);
    if (target) {
      target.read = true;
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
    }
  },

  markAllAsRead: () => {
    const list = notificationService.getNotifications();
    list.forEach((n) => (n.read = true));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
  },

  getUnreadCount: (workspaceId = null) => {
    return notificationService.getNotifications(workspaceId).filter((n) => !n.read).length;
  },
};
