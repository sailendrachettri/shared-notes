import { useEffect, useState, useCallback } from "react";
import { INVITE_USER_NOTE_INVITE_NOTIFICATIONS_URL } from "../api/api_routes";
import { axiosInstance } from "../api/axios";
import { getItem } from "../api/storage";

export function useNotificationCount() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotificationCount = useCallback(async () => {
    const userData = await getItem("user");
    console.log(userData);

    if (!userData?.userId) {
      setNotificationCount(0);
      console.info("Please login and try again");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        UserId: userData.userId,
      };

      const res = await axiosInstance.post(
        INVITE_USER_NOTE_INVITE_NOTIFICATIONS_URL,
        payload,
      );

      let total = 0;

      if (res?.status === 200) {
        total += res?.data?.length || 0;
      }

      // Future APIs can be added here
      // const res2 = await axiosInstance.post(ANOTHER_NOTIFICATION_API)
      // total += res2?.data?.length || 0

      setNotificationCount(total);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      setNotificationCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationCount();
  }, [fetchNotificationCount]);

  return {
    notificationCount,
    loading,
    refreshNotifications: fetchNotificationCount,
  };
}
