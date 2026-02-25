import React from "react";
import { useEffect } from "react";
import { axiosInstance } from "../../../api/axios";
import {
  DELETE_WORKSPACE_URL,
  GET_WORKSPACES_LIST_URL,
  MOVE_WORKSPACE_TO_PUBLIC_URL,
} from "../../../api/api_routes";
import { load } from "@tauri-apps/plugin-store";
import { useState } from "react";
import { BiBookAlt } from "react-icons/bi";
import { BiBarChartAlt2 } from "react-icons/bi";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import toast from "react-hot-toast";
import DeleteConfirmModal from "../../../reusable/DeleteConfirmModal";
import GenericConfirmModal from "../../../reusable/GenericConfirmModal";

const WorkspacesSidebar = ({
  searchText,
  sortBy,
  sortDirection,
  setSelectedWorkspaceId,
  setSelectedTab,
  setSelectedWorkspaceName,
  setSelectedNoteId,
  setCurrentNotesId,
  setActive,
  active,
  setWorkspaceLength,
  setSelectedWordspaceMode,
  refresh,
  setRefresh,
}) => {
  const [privateWorkspaces, setPrivateWorkspaces] = useState(null);
  const [publicWorkspaces, setPublicWorkspaces] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletionWorkspaceId, setDeletionWorkspaceId] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [isGenericConfirmModalOpen, setIsGenericConfirmModalOpen] =
    useState(false);
  const [selectedWorkspaceIdMoveToPublic, setSelectedWorkspaceIdMoveToPublic] =
    useState(null);

  const handleSelectWorkspace = (item) => {
    // console.log(item);
    setSelectedWordspaceMode(item?.is_private ? "private" : "public");
    setCurrentNotesId(null);
    setSelectedNoteId(null);
    setActive(item?.workspace_id);
    setSelectedWorkspaceId(item?.workspace_id);
    setSelectedTab("workspaces");
    setSelectedWorkspaceName(item?.workspace_name || null);
  };

  const handleDeleteWorkspace = async () => {
    try {
      if (!deletionWorkspaceId) {
        toast.error("Can't delete workspace at the moment");
        console.error("Workspace id is required");
        return;
      }
      const payload = {
        WorkspaceId: deletionWorkspaceId,
      };
      const res = await axiosInstance.post(DELETE_WORKSPACE_URL, payload);
      console.log(res);
      if (res?.status == 200) {
        toast.success("Workspace deleted successful");
      }
    } catch (error) {
      toast.error("Can't delete workspace at the moment");
      console.error("not able to delete the workspace", error);
    } finally {
      setDeletionWorkspaceId(null);
      setOpenMenu(null);
      setIsDeleteOpen(false);
      setRefresh((prev) => !prev);
    }
  };

  const handleGetWorkspacesList = async () => {
    try {
      const store = await load("user-store.json", { autoSave: true });
      const user = await store.get("user");

      const payload = {
        SearchText: searchText || null,
        SortBy: sortBy,
        SortDirection: sortDirection,
        UserId: user?.userId || null,
      };
      const res = await axiosInstance.post(GET_WORKSPACES_LIST_URL, payload);
      // console.log(res);
      if (res?.data?.success == true && res?.data?.status == "FETCHED") {
        setPrivateWorkspaces(res?.data?.data?.private || null);
        setPublicWorkspaces(res?.data?.data?.public || null);
        setWorkspaceLength(
          res?.data?.data?.public?.length ||
            res?.data?.data?.private?.length ||
            0,
        );
      }
    } catch (error) {
      console.error("not able to fetch workspaces list", error);
    }
  };

  const handleMoveWorkspaceToPublic = async () => {
    try {
      if (!selectedWorkspaceIdMoveToPublic) {
        toast.error("Can't make it public at the moment");
        console.error("Invalid workspace id");
        return;
      }
      const payload = {
        WorkspaceId: selectedWorkspaceIdMoveToPublic,
      };
      const res = await axiosInstance.post(
        MOVE_WORKSPACE_TO_PUBLIC_URL,
        payload,
      );
      console.log(res);
      if (res?.data?.status == "UPDATED" && res?.data?.success == true) {
        toast.success("Workspace is public now");
      }
    } catch (error) {
      console.error("not able to make workspace public", error);
      toast.error("Not able to make workspace public");
    } finally {
      setRefresh((prev) => !prev);
      setIsGenericConfirmModalOpen(false);
      setSelectedWorkspaceIdMoveToPublic(null);
    }
  };

  useEffect(() => {
    handleGetWorkspacesList();
  }, [refresh, sortBy, sortDirection, searchText]);

  return (
    <>
      <section>
        <div className="flex-1 overflow-y-auto space-y-1 hide-scrollbar">
          <section>
            {/* Private workspaces */}
            {privateWorkspaces?.map((item, idx) => {
              return (
                <div key={idx} className="relative my-2">
                  {/* Note Button */}
                  <button
                    onClick={() => {
                      handleSelectWorkspace(item);
                    }}
                    className={`group w-full capitalize text-sm text-left px-2 py-2.5 cursor-pointer rounded-lg transition-all duration-200
                    ${
                      active === item?.workspace_id
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Left Content */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative">
                          <BiBarChartAlt2
                            size={20}
                            className={`shrink-0 ${
                              active === item?.workspace_id
                                ? "text-primary"
                                : "text-gray-400 group-hover:text-gray-600"
                            }`}
                          />
                        </div>

                        <div className="truncate font-medium text-xs lg:text-sm">
                          {item?.workspace_name}
                        </div>
                      </div>

                      {/* Three Dot Button */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(
                            openMenu === item?.workspace_id
                              ? null
                              : item?.workspace_id,
                          );
                        }}
                        className={`   ${
                          active === item?.workspace_id ? "block" : "hidden"
                        } transition-opacity duration-200 p-1 rounded hover:bg-gray-200`}
                      >
                        <PiDotsThreeVerticalBold size={16} />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {openMenu === item?.workspace_id && (
                    <div className="absolute right-2 top-10 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletionWorkspaceId(item?.workspace_id);
                          setOpenMenu(null);
                          setIsDeleteOpen(true);
                        }}
                        className="block w-full text-left px-4 py-2 cursor-pointer text-sm text-red-500 hover:bg-gray-50"
                      >
                        Delete Workspace
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWorkspaceIdMoveToPublic(
                            item?.workspace_id,
                          );
                          setOpenMenu(null);
                          setIsGenericConfirmModalOpen(true);
                        }}
                        className="block w-full text-left px-4 py-2 cursor-pointer text-sm text-red-500 hover:bg-gray-50"
                      >
                        Make it Public
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {/* Public workspaces */}
            {publicWorkspaces?.map((item, idx) => {
              return (
                <div key={idx} className="relative my-2">
                  {/* Note Button */}
                  <button
                    onClick={() => {
                      handleSelectWorkspace(item);
                    }}
                    className={`group w-full capitalize text-sm text-left px-2 py-2.5 cursor-pointer rounded-lg transition-all duration-200
                    ${
                      active === item?.workspace_id
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Left Content */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative">
                          <BiBarChartAlt2
                            size={20}
                            className={`shrink-0 ${
                              active === item?.workspace_id
                                ? "text-primary"
                                : "text-gray-400 group-hover:text-gray-600"
                            }`}
                          />
                        </div>

                        <div className="truncate font-medium text-xs lg:text-sm">
                          {item?.workspace_name}
                        </div>
                      </div>

                      {/* Three Dot Button */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(
                            openMenu === item?.workspace_id
                              ? null
                              : item?.workspace_id,
                          );
                        }}
                        className={`   ${
                          active === item?.workspace_id ? "block" : "hidden"
                        } transition-opacity duration-200 p-1 rounded hover:bg-gray-200`}
                      >
                        <PiDotsThreeVerticalBold size={16} />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {openMenu === item?.workspace_id && (
                    <div className="absolute right-2 top-10 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletionWorkspaceId(item?.workspace_id);
                          setOpenMenu(null);
                          setIsDeleteOpen(true);
                        }}
                        className="block w-full text-left px-4 py-2 cursor-pointer text-sm text-red-500 hover:bg-gray-50"
                      >
                        Delete Workspace
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </div>
      </section>

      <GenericConfirmModal
        isOpen={isGenericConfirmModalOpen}
        onClose={() => setIsGenericConfirmModalOpen(false)}
        onConfirm={() => handleMoveWorkspaceToPublic()}
        title="Make it Public"
        description="This workspace will be public permanently."
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleDeleteWorkspace()}
        title="Delete Workspace"
        description="This workspace will be permanently removed."
      />
    </>
  );
};

export default WorkspacesSidebar;
