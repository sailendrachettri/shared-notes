import { useState } from "react";
import { TbDatabaseLeak } from "react-icons/tb";
import { FcFolder } from "react-icons/fc";
import { axiosInstance } from "../../api/axios";
import { GET_ALL_FILES_BY_CATEGORY_ID_URL } from "../../api/api_routes";
import { getItem } from "../../api/storage";
import { HiOutlineHome } from "react-icons/hi";
import FileStorageHeading from "../../reusable/headings/FileStorageHeading";
import { FiFileText, FiLayers } from "react-icons/fi";
import { BiSolidCommentAdd } from "react-icons/bi";
import { MdOutlineCloudUpload, MdOutlineCreateNewFolder } from "react-icons/md";
import { useEffect } from "react";

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
  setCreatingFolder,
  setNewFolderName,
  fileRef,
  search,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleGetAllFilesById = async (id) => {
    try {
      const user = await getItem("user");
      const userId = user?.userId;

      const res = await axiosInstance.get(
        `${GET_ALL_FILES_BY_CATEGORY_ID_URL}/${id || selectedCategoryId}`,
        {
          params: { userId, searchText: search },
        },
      );

      if (res?.data?.success == true && res?.data?.status == "FETCHED") {
        setFilesFromSidebar(res?.data?.data || []);
      }
    } catch (error) {
      console.error("not able to fetch category files", error);
    }
  };

  useEffect(() => {
    if (selectedCategoryId != null) handleGetAllFilesById(selectedCategoryId);
  }, [search]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
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
            setSelectedCategoryName(null);
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
                  setSelectedCategoryId(category?.file_Storage_Category_Id);
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

      <button
        onClick={() => setIsOpen(true)}
        className="h-12 w-12 absolute bottom-16 left-64 z-40 cursor-pointer rounded-full bg-primary  text-white py-2  shadow-lg shadow-primary/40 hover:shadow-primary/80 duration-150 transition"
      >
        <span className="flex items-center justify-center gap-x-2 flex-nowrap">
          <BiSolidCommentAdd size={20} />
        </span>
      </button>

      {isOpen && (
        <section className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 pb-10 z-10">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">
              What would you like to add?
            </h3>

            <section className="grid grid-cols-2 gap-4">
              {/* Create Note */}
              <button
                onClick={() => {
                  fileRef.current.click();
                  setShowHomePage(true);
                  setActiveNav(null);
                  setIsOpen(false);
                }}
                className="flex flex-col items-center justify-center cursor-pointer p-6 rounded-xl border border-slate-200 hover:border-primary  transition-all duration-200 group"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/5 text-primary mb-3 group-hover:bg-primary/10 transition">
                  <MdOutlineCloudUpload size={22} />
                </div>

                <div className="font-medium text-slate-800 text-sm">
                  Upload Files
                </div>
                <div className="text-xs text-slate-500 mt-1 text-center">
                  Add documents, images, or files to your storage.
                </div>
              </button>

              {/* Create Workspace */}
              <button
                onClick={() => {
                  setCreatingFolder(true);
                  setNewFolderName("New Folder");
                  setShowHomePage(true);
                  setActiveNav(null);
                  setIsOpen(false);
                }}
                className="flex flex-col items-center justify-center cursor-pointer p-6 rounded-xl border border-slate-200 hover:border-primary  transition-all duration-200 group"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/5 text-primary mb-3 group-hover:bg-primary/10 transition">
                  <MdOutlineCreateNewFolder size={22} />
                </div>

                <div className="font-medium text-slate-800 text-sm">
                  New Folder
                </div>
                <div className="text-xs text-slate-500 mt-1 text-center">
                  Organize your files in a dedicated folder.
                </div>
              </button>
            </section>
          </div>
        </section>
      )}
    </div>
  );
};

export default FileStorageSidebar;
