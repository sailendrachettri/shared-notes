import React, { useState } from "react";
import MainLayout from "../../reusable/layouts/MainLayout";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineAttachFile,
} from "react-icons/md";
import { GrStorage } from "react-icons/gr";
import FileStorageSidebar from "./FileStorageSidebar";
import TopToolBar from "./TopToolBar";
import { useEffect } from "react";
import {
  ADD_FOLDER_URL,
  DELETE_FILE_URL,
  FILE_UPLOAD_URL,
  GET_FOLDER_ITEMS_URL,
  UPLOAD_STORAGE_FILE_URL,
} from "../../api/api_routes";
import { axiosInstance } from "../../api/axios";
import toast from "react-hot-toast";
import { getItem } from "../../api/storage";
import { useRef } from "react";
import GridStructureView from "./GridStructureView";
import { IoFolderOpenOutline } from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";
import { FcOpenedFolder } from "react-icons/fc";
import UploadInProgress from "../../utils/info-screen/UploadInProgress";
import LoadingPage from "../../utils/info-screen/LoadingPage";
import LoadingPageSoft from "../../utils/info-screen/LoadingPageSoft";
const MAX_FILE_SIZE = 1073741824; // 1gb

const icons = {
  folder: (color = "#FFB900") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 6C2 4.9 2.9 4 4 4H9.17C9.7 4 10.2 4.21 10.57 4.59L11.83 5.84C12.21 6.22 12.7 6.44 13.24 6.44H20C21.1 6.44 22 7.34 22 8.44V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z"
        fill={color}
      />
      <path d="M2 10H22" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
    </svg>
  ),
  pdf: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#E74C3C" />
      <rect x="3" y="2" width="14" height="18" rx="2" fill="url(#pdfGrad)" />
      <path d="M14 2L17 5V8H14V2Z" fill="#C0392B" />
      <text
        x="5"
        y="15"
        fontSize="5"
        fill="white"
        fontWeight="bold"
        fontFamily="Arial"
      >
        PDF
      </text>
      <defs>
        <linearGradient
          id="pdfGrad"
          x1="3"
          y1="2"
          x2="17"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6B6B" />
          <stop offset="1" stopColor="#E74C3C" />
        </linearGradient>
      </defs>
    </svg>
  ),
  txt: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#5B9BD5" />
      <path d="M14 2L17 5V8H14V2Z" fill="#2E75B6" />
      <line
        x1="6"
        y1="11"
        x2="14"
        y2="11"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="13.5"
        x2="14"
        y2="13.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="16"
        x2="11"
        y2="16"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  png: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#27AE60" />
      <path d="M14 2L17 5V8H14V2Z" fill="#1E8449" />
      <circle cx="8" cy="11" r="1.5" fill="white" opacity="0.8" />
      <path
        d="M5 16L8 12L11 14.5L13 13L15.5 16H5Z"
        fill="white"
        opacity="0.8"
      />
    </svg>
  ),
  xlsx: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#107C41" />
      <path d="M14 2L17 5V8H14V2Z" fill="#0A5C2F" />
      <text
        x="5.5"
        y="16"
        fontSize="7"
        fill="white"
        fontWeight="bold"
        fontFamily="Arial"
      >
        XLS
      </text>
    </svg>
  ),
  pptx: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#D04423" />
      <path d="M14 2L17 5V8H14V2Z" fill="#A33519" />
      <rect
        x="6"
        y="10"
        width="8"
        height="5"
        rx="1"
        fill="white"
        opacity="0.3"
      />
      <text
        x="5.5"
        y="16"
        fontSize="5.5"
        fill="white"
        fontWeight="bold"
        fontFamily="Arial"
      >
        PPT
      </text>
    </svg>
  ),
  default: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="2" fill="#8E8E8E" />
      <path d="M14 2L17 5V8H14V2Z" fill="#6B6B6B" />
    </svg>
  ),
};

export default function FileExplorer({
  sharedFolders,
  privateFolders,
  creatingFolder,
  publicFolders,
  setCreatingFolder,
  search,
  setSearch,
}) {
  const [view, setView] = useState("grid");
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeNav, setActiveNav] = useState("Documents");
  const [expandedNav, setExpandedNav] = useState(["Quick access"]);
  const [contextMenu, setContextMenu] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderStack, setFolderStack] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [parentDirVisibility, setParentDirectoryVisibility] = useState(null);
  const [forwardStack, setForwardStack] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  const createInputRef = useRef(null);
  const fileRef = useRef(null);

  const sections = [
    { heading: "Private Folders", data: privateFolders },
    { heading: "Shared Folders", data: sharedFolders },
    { heading: "Public Folders", data: publicFolders },
  ];

  const toggleExpand = (label) => {
    setExpandedNav((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  const openFolder = (folder) => {
    // console.log(folder);
    setParentDirectoryVisibility(folder?.folder_visibility);
    setFolderStack((prev) => [
      ...prev,
      {
        id: folder.folder_id,
        name: folder.folder_name,
      },
    ]);
    // console.log(folderStack);
    setCurrentFolderId(folder.folder_id);
    setForwardStack([]);
  };

  const handleFetchNestedFolders = async (parentId) => {
    if (!creatingFolder || !uploading) {
      setLoading(true);
    }
    try {
      const user = await getItem("user");
      // console.log(parentId);
      // console.log(currentFolderId);
      // console.log(folderStack);

      const payload = {
        ParentFolderId: parentId || null,
        UserId: user?.userId || null,
      };
      // console.log(payload);

      const res = await axiosInstance.post(GET_FOLDER_ITEMS_URL, payload);
      // console.log(res);

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

    try {
      if (!newFolderName.trim()) return;

      const payload = {
        FolderName: newFolderName,
        ParentFolderId: currentFolderId || null,
        UserId:
          parentDirVisibility == "public" ? null : userData?.userId || null,
        FolderVisibility: parentDirVisibility || "public",
      };

      // console.log(payload);

      const res = await axiosInstance.post(ADD_FOLDER_URL, payload);
      if (res?.data?.success === true && res?.data?.status === "CREATED") {
        toast.success(res?.data?.message || "Folder created successfully");
        setSelectedFile({ folder_id: res?.data?.folder_id });
        setCreatingFolder(false);
        setNewFolderName("");

        handleFetchNestedFolders(currentFolderId);
      } else if (
        res?.data?.success === false &&
        res?.data?.status === "EXISTS"
      ) {
        toast.error(res?.data?.message || "Folder already exist");
      } else {
        toast.error("Can't create folder at the moment");
      }
    } catch (error) {
      console.error("Not able to create folder", error);
      toast.error("Can't create folder at the moment");
    } finally {
      // setRefresh((prev) => !prev);
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

  const handleUploadStorageFile = async (selectedFileForUpload) => {
    if (selectedFileForUpload.size > MAX_FILE_SIZE) {
      toast.error("File must be less than 1GB");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    let uploadedUrl;

    try {
      const user = await getItem("user");
      const formData = new FormData();
      formData.append("files", selectedFileForUpload);
      let fileRes = await axiosInstance.post(FILE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      uploadedUrl = fileRes?.data[0];

      let payload = {
        FileName: selectedFileForUpload?.name,
        FolderId: currentFolderId || null,
        FileSize: selectedFileForUpload?.size,
        FileExtension: selectedFileForUpload.name.split(".").pop(),
        FileVisibility: parentDirVisibility || "public",
        FilePath: uploadedUrl,
        UserId: parentDirVisibility == "public" ? null : user?.userId || null,
      };

      const res = await axiosInstance.post(UPLOAD_STORAGE_FILE_URL, payload);
      // console.log(res);

      if (res?.data?.success == true && res?.data?.status == "UPLOADED") {
        toast.success("File uploaded successful");
        handleFetchNestedFolders(currentFolderId);
      } else {
        toast.error("Can't upload file at the moment");
        // delete the file from the file system
        if (uploadedUrl) {
          await axiosInstance.post(DELETE_FILE_URL, [uploadedUrl]);
        }
      }
    } catch (error) {
      console.error("Can't upload file at the moment", error);
      toast.error("Can't upload file at the moment");
      if (uploadedUrl) {
        await axiosInstance.post(DELETE_FILE_URL, [uploadedUrl]);
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

  useEffect(() => {
    handleFetchNestedFolders(currentFolderId);
  }, [currentFolderId]);

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
              setActiveNav={setActiveNav}
              activeNav={activeNav}
              expandedNav={expandedNav}
              icons={icons}
              toggleExpand={toggleExpand}
            />
          </section>
        }
        content={
          <section className="flex flex-col h-full min-h-0 px-3">
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
            />

            {loading ? (
              <section>
                <LoadingPageSoft />
              </section>
            ) : (
              <section className="flex flex-col h-full pb-10">
                {/* File area */}
                <div
                  className="flex-1 overflow-auto min-h-0"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      x: e.pageX,
                      y: e.pageY,
                      type: "blank",
                    });
                  }}
                >
                  <div className="p-4">
                    {/* Folders */}
                    <div>
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

                      {currentFolderId === null ? (
                        sections?.map((section, index) => (
                          <GridStructureView
                            itemTypeName={"folder"}
                            key={index}
                            dataItems={section.data}
                            setSelectedFile={setSelectedFile}
                            selectedFile={selectedFile}
                            heading={section.heading}
                            openFolder={openFolder}
                            isSubfolder={"no"}
                          />
                        ))
                      ) : (
                        <GridStructureView
                          itemTypeName={"folder"}
                          dataItems={folders}
                          setSelectedFile={setSelectedFile}
                          selectedFile={selectedFile}
                          heading="Folders"
                          openFolder={openFolder}
                          isSubfolder={"yes"}
                        />
                      )}

                      {/* Render files */}
                      <GridStructureView
                        itemTypeName={"file"}
                        dataItems={files}
                        setSelectedFile={setSelectedFile}
                        selectedFile={selectedFile}
                        heading="Documents"
                        openFolder={openFolder}
                        isSubfolder={"no"}
                      />
                    </div>
                  </div>
                </div>

                {/* right click options */}

                {contextMenu && (
                  <div
                    style={{
                      top: contextMenu.y,
                      left: contextMenu.x,
                    }}
                    className="fixed bg-white border border-slate-200 px-1 shadow-lg rounded-md w-44 py-1 z-999"
                  >
                    <button
                      className="w-full flex flex-nowrap gap-x-2 cursor-pointer text-left px-3 py-2 text-sm hover:bg-primary/5"
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      <HiOutlineRefresh size={20} />
                      <span> Refresh</span>
                    </button>

                    <button
                      className="w-full flex flex-nowrap gap-x-2 cursor-pointer text-left px-3 py-2 text-sm hover:bg-primary/5"
                      onClick={() => {
                        fileRef.current.click();
                        setContextMenu(null);
                      }}
                    >
                      <MdOutlineAttachFile className="rotate-90" size={20} />{" "}
                      <span>Upload Files</span>
                    </button>
                    <button
                      className="w-full flex flex-nowrap gap-x-2 cursor-pointer text-left px-3 py-2 text-sm hover:bg-primary/5"
                      onClick={() => {
                        setCreatingFolder(true);
                        setNewFolderName("New Folder");
                        setContextMenu(null);
                      }}
                    >
                      <IoFolderOpenOutline size={20} /> <span>New Folder</span>
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileRef}
                  onChange={(e) => handleUploadStorageFile(e.target.files?.[0])}
                  accept=""
                  className="hidden"
                />

                {uploading && <UploadInProgress progress={uploadProgress}/>}
              </section>
            )}
          </section>
        }
      />
    </>
  );
}
