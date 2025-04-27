import React from "react";
import { useDispatch } from "react-redux";
import { INotification } from "../../interfaces/notification.interfaces";
import { markAsRead, } from "../../redux store/notificatoinSlice";
import { FaTimes, FaCheck, FaTicketAlt, FaExclamationCircle } from "react-icons/fa";
import { getTimeAgo } from "../utility/dateFunctions.ts/getTimeAgo";
import { markNotificationAsRead } from "@/api/services/communicationService";
import { toast } from "react-toastify";
import getErrMssg from "../utility/getErrMssg";

interface NotificationPanelProps {
  notifications: INotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose, onMarkAllAsRead }) => {
  const dispatch = useDispatch();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      dispatch(markAsRead(notificationId));
    } catch (error :any) {
      toast.error(getErrMssg(error));
    }
    
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "TICKET_ASSIGNED":
        return <FaTicketAlt  className="text-blue-500 text-xl" />;
      case "TICKET_STATUS_CHANGED":
        return <FaCheck className="text-green-500" />;
      default:
        return <FaExclamationCircle className="text-orange-500" />;
    }
  };


  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl overflow-hidden z-50 border border-gray-200">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-100 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <div className="flex space-x-3">
          <button onClick={onMarkAllAsRead} className="text-sm text-blue-600 hover:text-blue-800">
            Mark all as read
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-lg text-red-600 hover:text-black" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        { !notifications ||notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}>
              <div className="flex items-start">
                <div className="mt-1 mr-3">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800">{notification.title}</h4>
                    <span className="text-xs text-gray-500">{getTimeAgo( new Date (notification.createdAt) )}</span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="mt-1 text-xs text-blue-600 hover:text-blue-800">
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
