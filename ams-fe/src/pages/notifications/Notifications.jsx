import { useEffect, useState } from "react";

import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../../api/notificationApi";

export default function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const fetchNotifications = async () => {
    const data =
      await getNotifications();

    setNotifications(
      data.notifications || []
    );
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Notifications
      </h1>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.notification_id}
            className={`p-4 rounded-xl shadow ${
              n.is_read
                ? "bg-white"
                : "bg-blue-50"
            }`}
          >
            <h3 className="font-semibold">
              {n.title}
            </h3>

            <p className="text-gray-600">
              {n.message}
            </p>

            <div className="mt-3 flex gap-2">
              {!n.is_read && (
                <button
                  onClick={async () => {
                    await markAsRead(
                      n.notification_id
                    );
                    fetchNotifications();
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Mark Read
                </button>
              )}

              <button
                onClick={async () => {
                  await deleteNotification(
                    n.notification_id
                  );
                  fetchNotifications();
                }}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}