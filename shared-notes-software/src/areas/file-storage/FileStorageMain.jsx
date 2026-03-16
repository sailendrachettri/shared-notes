import React from "react";
import FileStorageGround from "./FileStorageGround";
import { axiosInstance } from "../../api/axios";
import {
  GET_FOLDER_LIST_URL,
  GET_STORAGE_MST_CATEGORY_URL,
} from "../../api/api_routes";
import { useEffect } from "react";
import { getItem } from "../../api/storage";
import { useState } from "react";

const FileStorageMain = ({ isUserLoggedIn }) => {
  const [privateFolders, setPrivateFolders] = useState([]);
  const [sharedFolders, setSharedFolders] = useState([]);
  const [publicFolders, setPublicFolders] = useState([]);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [fileStorageCategory, setFileStorageCategory] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);

  const handleGetFileStorageCategory = async () => {
    try {
      const res = await axiosInstance.get(GET_STORAGE_MST_CATEGORY_URL);
      if (res?.data?.success == true && res?.data?.status == "FETCHED") {
        setFileStorageCategory(res?.data?.data || []);
      }
    } catch (error) {
      console.error("not able to fetch category", error);
    }
  };

  const handleGetFolders = async () => {
    try {
      const user = await getItem("user");
      const payload = {
        SearchText: search || "",
        SortBy: "folder_name",
        SortDir: "asc",
        UserId: user?.userId || null,
      };
      const res = await axiosInstance.post(GET_FOLDER_LIST_URL, payload);
      console.log(res);
      if (res?.data?.success == true && res?.data?.status == "FETCHED") {
        setPrivateFolders(res?.data?.data?.owned || []);
        setSharedFolders(res?.data?.data?.shared || []);
        setPublicFolders(res?.data?.data?.public || []);
      }
    } catch (error) {
      console.error("Not able to fetch directories", error);
    }
  };

  useEffect(() => {
    handleGetFolders();
    handleGetFileStorageCategory();
  }, [creatingFolder, refresh]);

  useEffect(() => {
    console.log(currentFolderId)
    if (currentFolderId == null) handleGetFolders();
  }, [search]);
  return (
    <>
      <section className="h-full">
        <FileStorageGround
          sharedFolders={sharedFolders}
          privateFolders={privateFolders}
          creatingFolder={creatingFolder}
          setCreatingFolder={setCreatingFolder}
          publicFolders={publicFolders}
          search={search}
          setSearch={setSearch}
          setRefresh={setRefresh}
          fileStorageCategory={fileStorageCategory}
          isUserLoggedIn={isUserLoggedIn}
          currentFolderId={currentFolderId}
          setCurrentFolderId={setCurrentFolderId}
        />
      </section>
    </>
  );
};

export default FileStorageMain;
