import React from "react";
import FileStorageGround from "./FileStorageGround";
import { axiosInstance } from "../../api/axios";
import { GET_FOLDER_LIST_URL } from "../../api/api_routes";
import { useEffect } from "react";
import { getItem } from "../../api/storage";
import { useState } from "react";

const FileStorageMain = () => {
  const [privateFolders, setPrivateFolders] = useState([]);
  const [sharedAndPublicFolders, setSharedAndPublicFolders] = useState([]);

  const handleGetFolders = async () => {
    try {
      const user = await getItem("user");
      const payload = {
        SearchText: "",
        SortBy: "folder_name",
        SortDir: "asc",
        UserId: user?.userId || null,
      };
      const res = await axiosInstance.post(GET_FOLDER_LIST_URL, payload);
      console.log(res);
      if (res?.data?.success == true && res?.data?.status == "FETCHED") {
        setPrivateFolders(res?.data?.data?.owned || []);
        setSharedAndPublicFolders(res?.data?.data?.shared || []);
      }
    } catch (error) {
      console.error("Not able to fetch directories", error);
    }
  };

  useEffect(() => {
    handleGetFolders();
  }, []);
  return (
    <>
      <section className="h-full">
        <FileStorageGround
          sharedAndPublicFolders={sharedAndPublicFolders}
          privateFolders={privateFolders}
        />
      </section>
    </>
  );
};

export default FileStorageMain;
