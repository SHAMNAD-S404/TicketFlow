import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification, NotificatonState } from "../interfaces/notification.interfaces";

const initialState: NotificatonState = {
  notifications: [],
  unreadCount: 0,
  isOpen: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<{ notifications: INotification[]; unreadCount: number }>) => {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications = [action.payload, ...state.notifications];
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n._id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.notifications = state.notifications.filter((n) => n._id !== action.payload);
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
      state.notifications = [];
      state.unreadCount = 0;
    },
    toggleNotificationPanel: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeNotificationPanel: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addNotification,
  closeNotificationPanel,
  markAllAsRead,
  markAsRead,
  setNotifications,
  toggleNotificationPanel,
} = notificationSlice.actions;

export default notificationSlice.reducer;
