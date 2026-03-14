import { useState } from "react";
import { TbDatabaseLeak } from "react-icons/tb";
import { FcFolder } from "react-icons/fc";
import { axiosInstance } from "../../api/axios";
import { GET_ALL_FILES_BY_CATEGORY_ID_URL } from "../../api/api_routes";
import { getItem } from "../../api/storage";
import { HiOutlineHome } from "react-icons/hi";
import FileStorageHeading from "../../reusable/headings/FileStorageHeading";

const FileStorageSidebar = ({
  fileStorageCategory,
  setSelectedCategoryName,
  setFilesFromSidebar,
  setShowHomePage,
  showHomePage,
  activeNav,
  setActiveNav,
  setCurrentFolderId,
  setFolderStack,
}) => {
  const handleGetAllFilesById = async (id) => {
    try {
      const user = await getItem("user");
      const userId = user?.userId;

      const res = await axiosInstance.get(
        `${GET_ALL_FILES_BY_CATEGORY_ID_URL}/${id}`,
        {
          params: { userId },
        },
      );
      console.log(activeNav);
      console.log(res);
      if (res?.data?.success == true && res?.data?.status == "FETCHED") {
        setFilesFromSidebar(res?.data?.data || []);
      }
    } catch (error) {
      console.error("not able to fetch category files", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow">
          <TbDatabaseLeak size={22} />
        </div>

        <div>
          <h1 className="font-semibold text-[15px] text-slate-800">
            File Storage
          </h1>
          <p className="text-[11px] text-slate-400">By SharedNotes</p>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {/* Home */}
        <div
          onClick={() => {
            setShowHomePage(true);
            setActiveNav(null);
            setCurrentFolderId(null);
            setFolderStack([]);
          }}
          className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg mt-1 mb-2
                  cursor-pointer text-[13px]
                  transition-all
                  ${
                    showHomePage
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }
                `}
        >
          <HiOutlineHome
            size={20}
            className={`${showHomePage ? "text-white" : "text-slate-600"}`}
          />

          <span>Home</span>
        </div>

        <div className="ps-3">
          <FileStorageHeading heading={"QUICK ACCESS"} />
        </div>

        <div className="flex flex-col gap-[2px]">
          {fileStorageCategory?.map((category) => {
            const isActive = activeNav === category?.file_Storage_Category_Id;

            return (
              <div
                key={category?.file_Storage_Category_Id}
                onClick={() => {
                  setActiveNav(category?.file_Storage_Category_Id);
                  handleGetAllFilesById(category?.file_Storage_Category_Id);
                  setShowHomePage(false);
                  setSelectedCategoryName(category?.file_Storage_Category_Name);
                }}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg mt-1
                  cursor-pointer text-[13px]
                  transition-all
                  ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }
                `}
              >
                <FcFolder
                  size={16}
                  className={`${isActive ? "text-white" : "text-slate-400"}`}
                />

                <span className="truncate">
                  {category?.file_Storage_Category_Name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FileStorageSidebar;
