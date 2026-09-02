import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // State
  isLoading: false,
  notifications: [],
  sidebarOpen: false,
  searchQuery: '',
  selectedCategory: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  // Notifications
  addNotification: (notification) => 
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50)
    })),
  clearNotifications: () => set({ notifications: [] }),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    })),
}));