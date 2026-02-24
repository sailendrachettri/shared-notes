import React from "react";
import { useEffect } from "react";
import { axiosInstance } from "../../../api/axios";
import { GET_WORKSPACES_LIST_URL } from "../../../api/api_routes";
import { load } from "@tauri-apps/plugin-store";
import { useState } from "react";
import { BiBookAlt } from "react-icons/bi";
import { BiBarChartAlt2 } from "react-icons/bi";







const WorkspacesSidebar = ({ searchText, sortBy, sortDirection, setSelectedWorkspaceId, setSelectedTab }) => {
  const [privateWorkspaces, setPrivateWorkspaces] = useState(null);
  const [publicWorkspaces, setPublicWorkspaces] = useState(null);
  const [active, setActive] = useState(null);

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
      console.log(res);
      if (res?.data?.success == true && res?.data?.status == "FETCHED") {
        setPrivateWorkspaces(res?.data?.data?.private || null);
        setPublicWorkspaces(res?.data?.data?.public || null);
      }
    } catch (error) {
      console.error("not able to fetch workspaces list", error);
    }
  };
  useEffect(() => {
    handleGetWorkspacesList();
  }, []);
  console.log(privateWorkspaces);
  console.log(publicWorkspaces);
  return (
    <>
      <section>
        {publicWorkspaces?.length > 0 || privateWorkspaces?.length > 0 ? (
          <div className="flex-1 overflow-y-auto space-y-1">
            <section>
              {/* Private workspaces */}
              {privateWorkspaces?.map((item, idx) => {
                return (
                  <div key={idx} className="relative my-2">
                    {/* Note Button */}<button
                      onClick={() => {
                        setActive(item?.workspace_id);
                        setSelectedWorkspaceId(item?.workspace_id);
                        setSelectedTab('workspaces');
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
                        {/* <div
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
                                      </div> */}
                      </div>
                    </button>
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
                        setActive(item?.workspace_id);
                        setSelectedWorkspaceId(item?.workspace_id);
                        setSelectedTab('workspaces');
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
                        {/* <div
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
                                      </div> */}
                      </div>
                    </button>
                  </div>
                );
              })}
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full w-full text-slate-600 text-sm gap-1">
            <span className="font-medium text-lg">No workspaces yet</span>
            <span className="text-slate-400">
              Create your first workspace using the button below.
            </span>
          </div>
        )}
      </section>
    </>
  );
};

export default WorkspacesSidebar;
