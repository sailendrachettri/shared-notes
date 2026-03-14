import { useState } from "react";
import { TbDatabaseLeak } from "react-icons/tb";
import { FcFolder } from "react-icons/fc";


const FileStorageSidebar = ({ fileStorageCategory }) => {
  const [activeNav, setActiveNav] = useState(null);

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
          <p className="text-[11px] text-slate-400">
            By SharedNotes
          </p>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-2 py-2">

        <p className="text-[11px] uppercase text-slate-400 px-3 mb-2">
          QUICK ACCESS
        </p>

        <div className="flex flex-col gap-[2px]">

          {fileStorageCategory?.map((section) => {
            const isActive =
              activeNav === section?.file_Storage_Category_Id;

            return (
              <div
                key={section?.file_Storage_Category_Id}
                onClick={() =>
                  setActiveNav(section?.file_Storage_Category_Id)
                }
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
                  className={`${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                />

                <span className="truncate">
                  {section?.file_Storage_Category_Name}
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