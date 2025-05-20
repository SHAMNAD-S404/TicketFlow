import React, { useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { FaPowerOff as FaPow } from "react-icons/fa6";
import { Socket, io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { Rootstate } from "@/redux store/store";
import secrets from "@/config/secrets";
import NotificationPanel from "./NotifcationPanel";
import { markAllNotificationAsRead } from "@/api/services/communicationService";
import { toast } from "react-toastify";
import getErrMssg from "../utility/getErrMssg";
import { useNavigate } from "react-router-dom";
import {
  setNotifications,
  addNotification,
  toggleNotificationPanel,
  closeNotificationPanel,
  markAllAsRead,
} from "../../redux store/notificatoinSlice";

interface DashboardHeaderProps {
  name: string;
  userId: string;
  profileImage: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ name, userId, onLogout, profileImage }) => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const notification = useSelector((state: Rootstate) => state.notification);
  const { isOpen, notifications, unreadCount } = notification;

  useEffect(() => {
    //initializing socket connection
    if (!socketRef.current) {
      socketRef.current = io(secrets.APIGATEWAY_URL, {
        withCredentials: true,
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        path: "/socket.io",
      });

      socketRef.current.on("connect", () => {
        //register user for notification upon connection
        if (userId) {
          //fetch initial notification
          socketRef.current?.emit("fetch_notification", userId, 10);
        }
      });

    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);

  useEffect(() => {
    if (!socketRef.current) return;

    //handle receiving notification list
    socketRef.current.on("notification_list", ({ notifications, unreadCount }) => {
      dispatch(setNotifications({ notifications, unreadCount }));
    });

    //handling receiving new notifications
    socketRef.current.on("new_notification", (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("notification_list");
        socketRef.current.off("new_notification");
      }
    };
  }, [dispatch]);

  //hadle click outside notification panel
  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("[data-notification-toggle]")
      ) {
        dispatch(closeNotificationPanel());
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [dispatch]);

  const handleToggleNotifications = () => {
    dispatch(toggleNotificationPanel());
  };

  const handleMarkAllAsRead = async () => {
    if (userId) {
      try {
        await markAllNotificationAsRead(userId);
        dispatch(markAllAsRead());
        socketRef.current?.emit("mark_all_notifications_read", userId);
      } catch (error) {
        toast.error(getErrMssg(error));
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-200 border-b border-gray-200 px-4 py-3 rounded-xl w-full">
      <div className="flex flex-col phone:flex-row phone:items-center phone:justify-between gap-4">
        {/* Left side - Greeting */}
        <section className="text-center phone:text-left">
          <h1 className="text-lg phone:text-xl italic font-medium text-gray-800">
            <span className="text-blue-500">Hello,</span> {name}
          </h1>
          <p className="text-sm font-medium text-pink-400 mt-1 font-inter">Have a good day!</p>
        </section>

        {/* Right side - User Profile & Notifications */}
        <aside className="flex flex-col phone:flex-row phone:items-center phone:space-x-6 gap-3 phone:gap-0 items-center justify-center">
          {/* Notifications */}
          <section className="relative" ref={notificationPanelRef}>
            <button
              className="relative p-2 bg-gray-100 hover:bg-white rounded-xl shadow-md transition-colors duration-200"
              onClick={handleToggleNotifications}
              data-notification-toggle>
              <FaBell className="h-5 w-5 text-black hover:animate-ring transition-transform duration-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {isOpen && (
              <NotificationPanel
                notifications={notifications}
                onClose={() => dispatch(closeNotificationPanel())}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
            )}
          </section>

          {/* User Profile */}
          <section
            className="flex items-center cursor-pointer  p-1.5 rounded-xl "
            onClick={() => navigate("profile")}>
            <img
              src={
                profileImage
                  ? profileImage
                  : "https://imgs.search.brave.com/YH7ay2TlJuJ4PGUTGS-GmsnCPqYehMWwx13lWbFYQnk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1wc2QvM2Qt/cmVuZGVyaW5nLWhh/aXItc3R5bGUtYXZh/dGFyLWRlc2lnbl8y/My0yMTUxODY5MTUz/LmpwZz9zZW10PWFp/c19oeWJyaWQ"
              }
              alt="Profile"
              className="h-9 w-9 phone:h-10 phone:w-10 rounded-full object-cover ring-2 ring-white shadow-md shadow-gray-500"
            />
          </section>

          {/* Logout */}
          <section className="flex items-center">
            <FaPow
              onClick={onLogout}
              className="h-8 w-8 phone:h-9 phone:w-9 text-black hover:text-red-600 transition-colors duration-200 cursor-pointer "
            />
          </section>
        </aside>
      </div>
    </header>
  );
};

export default DashboardHeader;
