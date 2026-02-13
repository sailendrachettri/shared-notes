import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../api/axios";
import { GET_MST_NOTE_URL } from "../../../api/api_routes";



const Sidebar = ({ setSelectedNoteId, sidebarItems, setSidebarItems, refresh }) => {
  const [active, setActive] = useState(1);

  const handleFetchAllItemList = async () => {
   try {
     //
     const res = await axiosInstance.get(GET_MST_NOTE_URL);
     console.log(res);
     setSidebarItems(res?.data?.data || [])
   } catch (error) {
      console.log("not able to fetch sidebar items");
   }
  };

  useEffect(() => {
    handleFetchAllItemList();
  }, [refresh]);

  const handleSelectNote = (noteId) => {
    console.log(noteId);
    setSelectedNoteId(noteId);
    setActive(noteId);
  };

  return (
    <aside className="h-full flex flex-col bg-white ">
      {/* Project List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
        {sidebarItems?.map((item) => (
          <button
            key={item?.note_id}
            onClick={() => handleSelectNote(item?.note_id)}
            className={`w-full text-sm text-left px-3 py-2 cursor-pointer rounded-xl transition-all duration-200
              ${
                active === item?.note_id
                  ? "bg-slate-50 text-primary"
                  : "text-gray-600  hover:text-gray-500"
              }
            `}
          >
            {item?.note_title || ''}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
