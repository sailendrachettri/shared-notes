import React, { useState } from "react";
import MainLayout from "../../reusable/layouts/MainLayout";
import dirSvg from "../../assets/svgs/files_dir.svg";
import { MdOutlineAttachFile } from "react-icons/md";
import { TbDownload } from "react-icons/tb";
import FileStorageSidebar from "./FileStorageSidebar";
import TopToolBar from "./TopToolBar";
import { useEffect } from "react";
import {
  ADD_FOLDER_URL,
  DELETE_FILE_URL,
  DELETE_FOLDER_AND_CHILDRENS_STORAGE_FILE_URL,
  DELETE_STORAGE_FILE_URL,
  FILE_UPLOAD_URL,
  GET_FOLDER_ITEMS_URL,
  INVITE_FILE_STORAGE_COLLABORATORS_URL,
  MAKE_PARENT_STORAGE_FOLDER_PUBLIC_URL,
  RENAME_STORAGE_FILE_OR_FOLDER_URL,
  UPLOAD_STORAGE_FILE_URL,
} from "../../api/api_routes";
import { axiosInstance } from "../../api/axios";

import { getItem } from "../../api/storage";
import { useRef } from "react";
import GridStructureView from "./GridStructureView";
import { IoFolderOpenOutline } from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";
import { FcOpenedFolder } from "react-icons/fc";
import UploadInProgress from "../../utils/info-screen/UploadInProgress";
import LoadingPageSoft from "../../utils/info-screen/LoadingPageSoft";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineHandshake } from "react-icons/md";
import { getMenuPosition } from "../../utils/window-functions/getMenuPosition";
import NoResultFound from "../../utils/info-screen/NoResultFound";
import { DownloadToast } from "./DownloadToast";
import { downloadFile } from "./DownloadFile";
import { customToast } from "../../utils/toast/toastConfig";
import FileCard from "./FileCard";
import FileStorageHeading from "../../reusable/headings/FileStorageHeading";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import DropdownReusable from "../../utils/dropdowns/DropdownReusable";
import { useUsers } from "../../hooks/useUsers";
import Modal from "../../reusable/modals/Modal";

const MAX_FILE_SIZE = 1073741824; // 1gb

export default function FileStorageGround({
  sharedFolders,
  privateFolders,
  creatingFolder,
  publicFolders,
  setCreatingFolder,
  search,
  setSearch,
  setRefresh,
  fileStorageCategory,
  isUserLoggedIn,
  currentFolderId,
  setCurrentFolderId,
}) {
  const [view, setView] = useState("grid");
  const [selectedFile, setSelectedFile] = useState(null);

  const [contextMenu, setContextMenu] = useState(null);

  const [folderStack, setFolderStack] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [parentDirVisibility, setParentDirectoryVisibility] = useState(null);
  const [forwardStack, setForwardStack] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadState, setDownloadState] = useState({ active: false });
  const [filesFromSidebar, setFilesFromSidebar] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [activeNav, setActiveNav] = useState(null);
  const [showHomePage, setShowHomePage] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [showCollaboratorsPage, setShowCollaboratorsPage] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const abortControllerRef = useRef(null);
  const dragCounter = useRef(0);
  const createInputRef = useRef(null);
  const fileRef = useRef(null);

  const isCurrentFolderEmpty = folders.length === 0 && files.length === 0;

  const { users } = useUsers();

  const userOptions =
    users?.map((obj) => ({
      label: obj?.user_name,
      value: obj?.user_id,
    })) || [];

  const sections = [
    { heading: "Private Folders", data: privateFolders },
    { heading: "Shared Folders", data: sharedFolders },
    { heading: "Public Folders", data: publicFolders },
  ];

  const headingMap = {
    private: "Private Documents",
    shared: "Shared Documents",
    public: "Public Documents",
  };

  const handleMakeItPublicFolder = async () => {
    try {
      if (!selectedFile?.folder_id) {
        customToast.error("Please login and try again");
      }

      const payload = {
        FolderId: selectedFile?.folder_id,
      };
      const res = await axiosInstance.post(
        MAKE_PARENT_STORAGE_FOLDER_PUBLIC_URL,
        payload,
      );

      if (res?.data?.success == true && res?.data?.status == "UPDATED") {
        customToast.success(
          res?.data?.message || "Visibility changed to public",
        );
      }
    } catch (error) {
      console.error("not able to make the folder public", error);
      customToast.error("Not able to make the folder public");
    } finally {
      setRefresh((prev) => !prev);
    }
  };

  const openFolder = (folder) => {
    setParentDirectoryVisibility(folder?.folder_visibility);
    setFolderStack((prev) => [
      ...prev,
      {
        id: folder.folder_id,
        name: folder.folder_name,
      },
    ]);

    setCurrentFolderId(folder.folder_id);
    setForwardStack([]);
  };

  const handleFetchNestedFolders = async (parentId) => {
    if (!creatingFolder || !uploading) {
      setLoading(true);
    }
    try {
      const user = await getItem("user");

      const payload = {
        ParentFolderId: parentId || null,
        UserId: user?.userId || null,
        SearchText: search || "",
      };

      const res = await axiosInstance.post(GET_FOLDER_ITEMS_URL, payload);

      setFolders(res?.data?.folders || []);
      setFiles(res?.data?.files || []);
    } catch (err) {
      console.error("Failed to fetch folder items", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    const userData = await getItem("user");
    let visiblilityDecision = "public";

    if (isUserLoggedIn) {
      // root folder
      if (currentFolderId == null) {
        visiblilityDecision = "private";
      }

      // inside another folder
      else {
        visiblilityDecision = parentDirVisibility;
      }
    }

    try {
      if (!newFolderName.trim()) return;

      const payload = {
        FolderName: newFolderName,
        ParentFolderId: currentFolderId || null,
        UserId:
          isUserLoggedIn && visiblilityDecision == "private"
            ? userData?.userId
            : null,
        FolderVisibility: isUserLoggedIn ? visiblilityDecision : "public",
      };

      const res = await axiosInstance.post(ADD_FOLDER_URL, payload);
      if (res?.data?.success === true && res?.data?.status === "CREATED") {
        customToast.success(
          res?.data?.message || "Folder created successfully",
        );
        setSelectedFile({ folder_id: res?.data?.folder_id });
        setCreatingFolder(false);
        setNewFolderName("");

        handleFetchNestedFolders(currentFolderId);
      } else if (
        res?.data?.success === false &&
        res?.data?.status === "EXISTS"
      ) {
        customToast.error(res?.data?.message || "Folder already exist");
      } else {
        customToast.error("Can't create folder at the moment");
      }
    } catch (error) {
      console.error("Not able to create folder", error);
      customToast.error("Can't create folder at the moment");
    } finally {
      setRefresh((prev) => !prev);
    }
  };

  const goForward = () => {
    if (forwardStack.length === 0) return;

    const next = forwardStack[forwardStack.length - 1];

    setForwardStack((prev) => prev.slice(0, -1));

    setFolderStack((prev) => [...prev, { id: next.id, name: next.name }]);

    setCurrentFolderId(next.id);
  };

  const goBack = () => {
    if (folderStack.length === 0) return;

    const newStack = [...folderStack];
    const last = newStack.pop();

    setForwardStack((prev) => [
      ...prev,
      { id: currentFolderId, name: last?.name },
    ]);

    const previous = newStack[newStack.length - 1];

    setFolderStack(newStack);
    setCurrentFolderId(previous ? previous.id : null);
  };

  const onCancelClick = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setUploading(false);
    setUploadProgress(0);
  };

  const handleUploadStorageFile = async (selectedFileForUpload) => {
    if (selectedFileForUpload.size > MAX_FILE_SIZE) {
      customToast.error("File must be less than 1GB");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    let uploadedUrl;
    let uploadedThumblineUrl;

    abortControllerRef.current = new AbortController();

    try {
      const user = await getItem("user");
      const formData = new FormData();
      formData.append("files", selectedFileForUpload);
      let fileRes = await axiosInstance.post(FILE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: abortControllerRef.current.signal,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      uploadedUrl = fileRes?.data?.files[0]?.file;
      uploadedThumblineUrl = fileRes?.data?.files[0]?.thumbnail;

      let payload = {
        FileName: selectedFileForUpload?.name,
        FolderId: currentFolderId || null,
        FileSize: selectedFileForUpload?.size,
        FileExtension: selectedFileForUpload.name.split(".").pop(),
        FileVisibility: parentDirVisibility || "public",
        FilePath: uploadedUrl,
        UserId: parentDirVisibility == "public" ? null : user?.userId || null,
        ThumbPath: uploadedThumblineUrl || null,
      };

      const res = await axiosInstance.post(UPLOAD_STORAGE_FILE_URL, payload);

      if (res?.data?.success == true && res?.data?.status == "UPLOADED") {
        setTimeout(() => {
          customToast.success("File uploaded successful");
        }, 600);
        handleFetchNestedFolders(currentFolderId);
      } else {
        customToast.error("Can't upload file at the moment");
        // delete the file from the file system
        if (uploadedUrl) {
          await axiosInstance.post(DELETE_FILE_URL, [uploadedUrl]);
        }
      }
    } catch (error) {
      console.error("Can't upload file at the moment", error);

      if (error.name === "CanceledError") {
        customToast.error("Upload cancelled");
        return;
      } else {
        customToast.error("Can't upload file at the moment");
        if (uploadedUrl) {
          await axiosInstance.post(DELETE_FILE_URL, [uploadedUrl]);
        }
      }
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  const handleDeleteFolder = async (folder) => {
    try {
      const payload = {
        FolderId: folder.folder_id,
      };
      const res = await axiosInstance.post(
        DELETE_FOLDER_AND_CHILDRENS_STORAGE_FILE_URL,
        payload,
      );

      if (res?.data?.success == true) {
        customToast.success(
          "Folder and all its contents deleted successfully.",
        );
        setFolders((prev) =>
          prev.filter((f) => f.folder_id !== folder.folder_id),
        );
      }

      // handleFetchNestedFolders(currentFolderId);
    } catch (err) {
      customToast.error("Failed to delete folder");
    } finally {
      handleFetchNestedFolders(currentFolderId);
      setRefresh((prev) => !prev);
    }

    setContextMenu(null);
  };

  const handleDeleteFile = async (file) => {
    let res;

    try {
      // first delete the file from file system
      res = await axiosInstance.post(DELETE_FILE_URL, [file?.file_path]);

      if (res.status == 200) {
        // if the file delete is successful then also delete from db as well
        const payload = {
          FileId: file?.file_id,
        };
        res = await axiosInstance.post(DELETE_STORAGE_FILE_URL, payload);
      }

      if (res?.data?.success == true && res?.data?.status == "DELETED") {
        customToast.success("File deleted");
      }

      handleFetchNestedFolders(currentFolderId);
    } catch (err) {
      customToast.error("Failed to delete file");
    }

    setContextMenu(null);
  };

  const handleRename = async (newTitle) => {
    if (!newTitle) return;
    /* No api call if the user enters the same name */
    if (
      newTitle.trim() === selectedFile?.file_name ||
      newTitle.trim() === selectedFile?.folder_name
    ) {
      return;
    }

    const selectedFileId = selectedFile?.file_id || selectedFile?.folder_id;

    const isFile = !!selectedFile?.file_id;

    const oldFiles = [...files];
    const oldFolders = [...folders];

    try {
      if (isFile) {
        setFiles((prev) =>
          prev.map((f) =>
            f.file_id === selectedFileId ? { ...f, file_name: newTitle } : f,
          ),
        );
      } else {
        setFolders((prev) =>
          prev.map((f) =>
            f.folder_id === selectedFileId
              ? { ...f, folder_name: newTitle }
              : f,
          ),
        );
        setRefresh(
          (prev) => !prev,
        ); /*Refresh only for the root level folders but for other do optimistic ui updates */
      }

      const payload = {
        FolderOrFileId: selectedFileId,
        Title: newTitle.trim() || "Untitled",
        FileOrFolderType: isFile ? "file" : "folder",
      };

      const res = await axiosInstance.post(
        RENAME_STORAGE_FILE_OR_FOLDER_URL,
        payload,
      );

      if (res?.data?.success === true) {
        customToast.success(res?.data?.message);
      }
    } catch (error) {
      setFiles(oldFiles);
      setFolders(oldFolders);

      console.error("Not able to rename", error);
      customToast.error("Can't rename at the moment");
    }
  };

  const handleCollaborators = async (users) => {
    try {
      const userIds = users.map((u) => u.value);

      const invitedBy = await getItem("user");

      if (!userIds) {
        customToast.error("Please select a valid user");
        return;
      }

      const payload = {
        FolderId: selectedFile?.folder_id,
        UserIds: userIds,
        AccessRole: "editor",
        InvitedBy: invitedBy?.userId,
      };

      const res = await axiosInstance.post(
        INVITE_FILE_STORAGE_COLLABORATORS_URL,
        payload,
      );

      if (res?.data?.success == true) {
        customToast.success(res?.data?.message || "Invite successful");
      } else {
        customToast.error("Can't invite collaborators at the moment");
      }

      setShowCollaboratorsPage(false);
    } catch (error) {
      customToast.error("Can't invite collaborators at the moment");
      console.error("not able to invite", error);
    } finally {
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
      setSelectedUsers([]);
    }
  };

  // Drag and drop support
  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounter.current++;

      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter.current--;

      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();

      setIsDragging(false);
      dragCounter.current = 0;

      const droppedFiles = e.dataTransfer.files;

      if (!droppedFiles) return;

      for (let i = 0; i < droppedFiles.length; i++) {
        handleUploadStorageFile(droppedFiles[i]);
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [currentFolderId, parentDirVisibility]);

  // Copy paste file to upload
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;

      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            handleUploadStorageFile(file);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => window.removeEventListener("paste", handlePaste);
  }, [currentFolderId, parentDirVisibility]);

  useEffect(() => {
    handleFetchNestedFolders(currentFolderId);
  }, [currentFolderId, search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        creatingFolder &&
        createInputRef.current &&
        !createInputRef.current.contains(e.target)
      ) {
        setCreatingFolder(false);
        setNewFolderName("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [creatingFolder]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyN") {
        e.preventDefault();
        setCreatingFolder(true);
        setShowHomePage(true);
        setActiveNav(null);
        setNewFolderName("New Folder");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <>
      <MainLayout
        sidebar={
          <section>
            {/* Sidebar */}
            <FileStorageSidebar
              fileStorageCategory={fileStorageCategory}
              setFilesFromSidebar={setFilesFromSidebar}
              showHomePage={showHomePage}
              setShowHomePage={setShowHomePage}
              setSelectedCategoryName={setSelectedCategoryName}
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              setCurrentFolderId={setCurrentFolderId}
              setFolderStack={setFolderStack}
              fileRef={fileRef}
              setCreatingFolder={setCreatingFolder}
              setNewFolderName={setNewFolderName}
              search={search}
            />
          </section>
        }
        content={
          <section className="relative flex flex-col h-full min-h-0 px-3 select-none">
            {/* Top toolbar */}
            <TopToolBar
              goBack={goBack}
              forwardStack={forwardStack}
              goForward={goForward}
              setView={setView}
              view={view}
              setCreatingFolder={setCreatingFolder}
              setNewFolderName={setNewFolderName}
              folderStack={folderStack}
              setCurrentFolderId={setCurrentFolderId}
              setFolderStack={setFolderStack}
              fileRef={fileRef}
              showHomePage={showHomePage}
              selectedCategoryName={selectedCategoryName}
              setShowHomePage={setShowHomePage}
              setActiveNav={setActiveNav}
              setSearch={setSearch}
            />

            <div className="relative overflow-y-auto">
              {loading ? (
                <section>
                  <LoadingPageSoft />
                </section>
              ) : (
                <section className="relative flex flex-col h-full">
                  {/* File area */}
                  <div
                    className={`flex-1 overflow-y-auto min-h-0`}
                    onContextMenu={(e) => {
                      e.preventDefault();

                      const pos = getMenuPosition(e.pageX, e.pageY);

                      setContextMenu({
                        x: pos.x,
                        y: pos.y,
                        type: "blank",
                      });
                    }}
                  >
                    <div className="p-4">
                      {/* Create new folder */}
                      {creatingFolder && view === "grid" && (
                        <div
                          ref={createInputRef}
                          className="flex flex-col w-fit mb-3 items-center rounded-md border bg-[#d2556407] border-primary"
                        >
                          <div className="mb-2">
                            <FcOpenedFolder size={40} />
                          </div>

                          <input
                            autoFocus
                            maxLength={30}
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleCreateFolder();
                              if (e.key === "Escape") setCreatingFolder(false);
                            }}
                            className="text-[12px] border-t border-primary focus:outline-none text-center py-2"
                          />
                        </div>
                      )}

                      {/* Filters data */}
                      {!showHomePage ? (
                        <section>
                          {filesFromSidebar?.length <= 0 ? (
                            <NoResultFound
                              desc={`There are no files available in the ${selectedCategoryName} directory.`}
                              img={dirSvg}
                              title="Empty Directory"
                            />
                          ) : (
                            <>
                              <FileStorageHeading
                                heading={selectedCategoryName}
                              />
                              <div className="grid gap-2.5 grid-cols-[repeat(auto-fill,minmax(148px,1fr))]">
                                {filesFromSidebar?.map((file) => (
                                  <FileCard
                                    key={file.file_id}
                                    file={file}
                                    isSelected={
                                      selectedFile?.file_id === file.file_id
                                    }
                                    onClick={() => setSelectedFile(file)}
                                    renaming={renaming}
                                    setRenaming={setRenaming}
                                    handleRename={handleRename}
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setSelectedFile(file);
                                      const pos = getMenuPosition(
                                        e.pageX,
                                        e.pageY,
                                      );

                                      setContextMenu({
                                        x: pos.x,
                                        y: pos.y,
                                        type: "file",
                                      });
                                    }}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </section>
                      ) : (
                        <div>
                          {isCurrentFolderEmpty && !creatingFolder ? (
                            <NoResultFound
                              desc="This folder is empty. Create a new folder (Ctrl + Shift + N) or upload files by right-clicking anywhere in this area."
                              img={dirSvg}
                              title="Empty Directory"
                            />
                          ) : (
                            <>
                              {currentFolderId === null ? (
                                sections
                                  ?.filter(
                                    (section) => section.data?.length > 0,
                                  )
                                  .map((section, index) => (
                                    <GridStructureView
                                      itemTypeName="folder"
                                      renaming={renaming}
                                      setRenaming={setRenaming}
                                      handleRename={handleRename}
                                      key={index}
                                      dataItems={section.data}
                                      setSelectedFile={setSelectedFile}
                                      selectedFile={selectedFile}
                                      heading={section.heading}
                                      openFolder={openFolder}
                                      isSubfolder="no"
                                      setContextMenu={setContextMenu}
                                    />
                                  ))
                              ) : (
                                <div>
                                  <FileStorageHeading
                                    heading={`${parentDirVisibility || "Public"} Folders`}
                                  />

                                  <GridStructureView
                                    itemTypeName="folder"
                                    dataItems={folders}
                                    setSelectedFile={setSelectedFile}
                                    selectedFile={selectedFile}
                                    renaming={renaming}
                                    setRenaming={setRenaming}
                                    handleRename={handleRename}
                                    heading="Folders"
                                    openFolder={openFolder}
                                    isSubfolder="yes"
                                    setContextMenu={setContextMenu}
                                  />
                                </div>
                              )}

                              <section>
                                {files?.length > 0 && (
                                  <FileStorageHeading
                                    heading={
                                      headingMap[parentDirVisibility] ||
                                      "Public documents"
                                    }
                                  />
                                )}
                                <GridStructureView
                                  itemTypeName="file"
                                  dataItems={files}
                                  setSelectedFile={setSelectedFile}
                                  selectedFile={selectedFile}
                                  heading="Documents"
                                  openFolder={openFolder}
                                  renaming={renaming}
                                  setRenaming={setRenaming}
                                  handleRename={handleRename}
                                  isSubfolder="no"
                                  setContextMenu={setContextMenu}
                                />
                              </section>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* right click options */}
                  {contextMenu && (
                    <div
                      style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                      }}
                      className="fixed bg-white border min-w-52 border-slate-200 px-1 shadow-lg rounded-md w-44 py-1 z-999"
                    >
                      <>
                        <button
                          className="w-full flex gap-x-2 px-3 py-2 text-sm hover:bg-primary/5"
                          onClick={() => window.location.reload()}
                        >
                          <HiOutlineRefresh size={20} />
                          Refresh
                        </button>

                        <button
                          className="w-full flex gap-x-2 px-3 py-2 text-sm hover:bg-primary/5"
                          onClick={() => {
                            fileRef.current.click();
                            setContextMenu(null);
                          }}
                        >
                          <MdOutlineAttachFile
                            className="rotate-90"
                            size={20}
                          />
                          Upload Files
                        </button>

                        <button
                          className="w-full flex gap-x-2 px-3 py-2 text-sm hover:bg-primary/5"
                          onClick={() => {
                            setCreatingFolder(true);
                            setNewFolderName("New Folder");
                            setContextMenu(null);
                          }}
                        >
                          <IoFolderOpenOutline size={20} />
                          New Folder
                        </button>
                      </>

                      {/* Common for file and folder */}
                      {
                        <>
                          {selectedFile && (
                            <div>
                              <button
                                className="w-full flex gap-x-2 px-3 py-2 text-sm hover:bg-primary/5"
                                onClick={() => {
                                  setRenaming(true);
                                }}
                              >
                                <MdOutlineDriveFileRenameOutline size={20} />
                                Rename
                              </button>
                            </div>
                          )}
                        </>
                      }

                      {contextMenu?.type === "file" && (
                        <>
                          <button
                            className="w-full flex gap-x-2 px-3 py-2 text-sm hover:bg-primary/5"
                            onClick={() =>
                              downloadFile(selectedFile, setDownloadState)
                            }
                          >
                            <TbDownload size={20} />
                            Download File
                          </button>

                          <button
                            className="w-full flex gap-x-2 px-3 py-2 text-sm hover:bg-primary/5"
                            onClick={() => handleDeleteFile(selectedFile)}
                          >
                            <AiOutlineDelete size={20} />
                            Delete File
                          </button>
                        </>
                      )}

                      {contextMenu?.type === "folder" && (
                        <>
                          {selectedFile?.folder_visibility == "private" &&
                            isUserLoggedIn &&
                            currentFolderId == null && (
                              <button
                                className="w-full flex gap-x-2 px-3 py-2 text-sm hover:bg-primary/5"
                                onClick={() => handleMakeItPublicFolder()}
                              >
                                <MdOutlinePeopleAlt size={20} />
                                Make it Public
                              </button>
                            )}

                          {currentFolderId == null &&
                            selectedFile?.folder_visibility == "private" && (
                              <button
                                className="w-full flex gap-x-2 px-3 py-2 text-sm hover:bg-primary/5"
                                onClick={() => setShowCollaboratorsPage(true)}
                              >
                                <MdOutlineHandshake size={20} />
                                Invite Collaborators
                              </button>
                            )}

                          <button
                            className="w-full flex gap-x-2 px-3 py-2 text-sm hover:bg-primary/5"
                            onClick={() => handleDeleteFolder(selectedFile)}
                          >
                            <AiOutlineDelete size={20} />
                            Delete Folder
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileRef}
                    onChange={(e) =>
                      handleUploadStorageFile(e.target.files?.[0])
                    }
                    accept=""
                    className="hidden"
                  />

                  {uploading && (
                    <UploadInProgress
                      progress={uploadProgress}
                      onCancelClick={onCancelClick}
                    />
                  )}
                  <DownloadToast
                    downloadState={downloadState}
                    onDismiss={() => setDownloadState({ active: false })}
                  />

                  {isDragging && (
                    <div className="absolute inset-0 pointer-events-none bg-[#fcf3f4]  border-2 rounded-2xl border-dashed border-primary flex items-center justify-center text-lg font-medium z-9999">
                      Drop file here to upload
                    </div>
                  )}
                </section>
              )}
            </div>

            <Modal
              isOpen={showCollaboratorsPage}
              onClose={() => setShowCollaboratorsPage(false)}
            >
              <div className="pb-3">
                <h2 className="text-lg font-semibold mb-4">
                  Invite people to collaborate?
                </h2>

                <DropdownReusable
                  options={userOptions}
                  setSelectedOption={setSelectedUsers}
                  selectedOption={selectedUsers}
                  isMultiple={true}
                  placeholder="Select Collaborators"
                />

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowCollaboratorsPage(false)}
                    className="py-1.5 text-sm rounded-md border border-slate-200 text-slate-600 cursor-pointer px-6"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={submitting}
                    onClick={() => {
                      handleCollaborators(selectedUsers);
                    }}
                    className={`${submitting ? "bg-slate-300 text-slate-600" : "bg-primary text-white"} px-5 py-2.5 min-w-56 rounded-md hover:opacity-90 transition font-medium cursor-pointer`}
                  >
                    {submitting
                      ? "Adding Collaborators..."
                      : "Add Collaborators"}
                  </button>
                </div>
              </div>
            </Modal>
          </section>
        }
      />
    </>
  );
}
