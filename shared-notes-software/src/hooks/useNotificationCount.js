import { useEffect, useState, useCallback } from "react";
import {
  GET_PENDING_FOLDER_ACCESS_LIST_URL,
  INVITE_USER_NOTE_INVITE_NOTIFICATIONS_URL,
} from "../api/api_routes";
import { axiosInstance } from "../api/axios";
import { getItem } from "../api/storage";

export function useNotificationCount() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotificationCount = useCallback(async () => {
    const userData = await getItem("user");

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

      const res1 = await axiosInstance.post(
        INVITE_USER_NOTE_INVITE_NOTIFICATIONS_URL,
        payload,
      );

      const res2 = await axiosInstance.get(GET_PENDING_FOLDER_ACCESS_LIST_URL, {
        params: { UserId: userData?.userId },
      });

      let total = 0;

      if (res1?.status === 200) {
        total += res1?.data?.length || 0;
      }
      if (res2?.status === 200 && res2?.data?.success == true) {
        total += res2?.data?.data?.length || 0;
      }

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
