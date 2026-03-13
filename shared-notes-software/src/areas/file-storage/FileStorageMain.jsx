import React from "react";
import FileStorageGround from "./FileStorageGround";
import { axiosInstance } from "../../api/axios";
import { GET_FOLDER_LIST_URL } from "../../api/api_routes";
import { useEffect } from "react";
import { getItem } from "../../api/storage";
import { useState } from "react";

const FileStorageMain = () => {
  const [privateFolders, setPrivateFolders] = useState([]);
  const [sharedFolders, setSharedFolders] = useState([]);
  const [publicFolders, setPublicFolders] = useState([]);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);

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
  }, [creatingFolder, refresh]);
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
        />
      </section>
    </>
  );
};

export default FileStorageMain;
