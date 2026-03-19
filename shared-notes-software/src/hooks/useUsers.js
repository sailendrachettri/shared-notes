import { useEffect, useState, useCallback } from "react";
import { GET_ALL_USERS_URL } from "../api/api_routes";
import { axiosInstance } from "../api/axios";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(GET_ALL_USERS_URL);
      setUsers(res?.data || []);
    } catch (err) {
      console.error("Not able to fetch users", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};