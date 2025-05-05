import React, { useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { FaPowerOff as FaPow } from "react-icons/fa6";
import { Socket, io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { Rootstate } from "@/redux store/store";
import secrets from "@/config/secrets";
import NotificationPanel from "./NotifcationPanel";
import { markAllNotificationAsRead } from "@/api/services/communicationService";
import {
  setNotifications,
  addNotification,
  toggleNotificationPanel,
  closeNotificationPanel,
  markAllAsRead,
} from "../../redux store/notificatoinSlice";
import { toast } from "react-toastify";
import getErrMssg from "../utility/getErrMssg";

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
        console.log("Notification socket connected : ", socketRef.current?.id);

        //register user for notification upon connection
        if (userId) {
          socketRef.current?.emit("register_user", userId);

          //fetch initial notification
          socketRef.current?.emit("fetch_notification", userId, 10);
        }
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Notification socket connection error ", err);
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
    <header className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-200 border-b border-gray-200 px-6 py-2 rounded-xl w-full ">
      <div className="flex items-center justify-between ">
        {/* Left side - Greeting */}
        <section>
          <h1 className="text-xl italic font-medium  text-gray-800">
            <span className="text-blue-500">Hello,</span> {name}
          </h1>
          <p className="text-sm font-medium text-pink-400 mt-1 font-inter">Have a good day!</p>
        </section>

        {/* Middle - Search Bar */}

        {/* <section className="flex-1 max-w-2xl mx-8    ">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full lg:w-2/3 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl shadow-xl focus:outline-none focus:ring-1 focus:ring-gray-300 hover:shadow-gray-400 transition-all duration-200 font-inter placeholder:text-gray-400"
            />
          </div>
        </section> */}

        {/* Right side - User Profile & Notifications */}
        <aside className="flex items-center space-x-10">
          {/* Notifications */}
          <section className="relative" ref={notificationPanelRef}>
            <button
              className="relative p-3 bg-gray-100 hover:bg-white rounded-xl shadow-xl transition-colors duration-200"
              onClick={handleToggleNotifications}
              data-notification-toggle>
              <FaBell className="h-5 w-5 text-black transition-transform duration-300 hover:animate-ring" />
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
          <section className="flex items-center  bg-gray-100 rounded-xl shadow-2xl shadow-gray-600 ">
            <div className="flex flex-col items-end  "></div>
            <img
              src={
                profileImage
                  ? profileImage
                  : "https://imgs.search.brave.com/YH7ay2TlJuJ4PGUTGS-GmsnCPqYehMWwx13lWbFYQnk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1wc2QvM2Qt/cmVuZGVyaW5nLWhh/aXItc3R5bGUtYXZh/dGFyLWRlc2lnbl8y/My0yMTUxODY5MTUz/LmpwZz9zZW10PWFp/c19oeWJyaWQ"
              }
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-xl shadow-gray-500 "
            />
          </section>

          {/* logout section */}
          <section className="flex items-center  rounded-xl shadow-2xl shadow-gray-600 ">
            <div className="flex flex-col shadow-2xl shadow-gray-400 items-end  "></div>
            <FaPow
              onClick={() => onLogout()}
              className="h-9 w-9 rounded-full object-cover text-black shadow-xl shadow-gray-500 hover:text-red-600    hover:shadow-xl cursor-pointer "
            />
          </section>
        </aside>
      </div>
    </header>
  );
};

export default DashboardHeader;
