import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../api/axios";
import { GET_MST_NOTE_URL } from "../../../api/api_routes";
import { PiNotebookLight } from "react-icons/pi";



const Sidebar = ({
  setSelectedNoteId,
  sidebarItems,
  setSidebarItems,
  refresh,
  searchText,
}) => {
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleFetchAllItemList = async () => {
    setLoading(true);
    try {
      const payload = {
        SearchText: searchText || null,
      };
      const res = await axiosInstance.post(GET_MST_NOTE_URL, payload);

      setSidebarItems(res?.data?.data || []);
    } catch (error) {
      console.error("not able to fetch sidebar items", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    handleFetchAllItemList();
  }, [refresh, searchText]);

  const handleSelectNote = (noteId) => {
    console.log(noteId);
    setSelectedNoteId(noteId);
    setActive(noteId);
  };

  console.log(sidebarItems);

  return (
    <aside className="h-full flex flex-col bg-white ">
      {/* Project List */}
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div class="loader"></div>
        </div>
      ) : (
        <section className="h-full w-full">
          {sidebarItems != null && sidebarItems?.length > 0 ? (
            <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
              {sidebarItems?.map((item, idx) => (
                <button
                  key={item?.note_id}
                  onClick={() => handleSelectNote(item?.note_id)}
                  className={`w-full capitalize text-sm text-left px-3 py-2 cursor-pointer rounded-md transition-all duration-200
              ${
                active === item?.note_id
                  ? "border border-slate-200 text-primary"
                  : "border border-white text-gray-600  hover:text-gray-500"
              }
            `}
                >
                  <div className="flex items-center gap-3 py-2">
                   
                    <div className="shrink-0 text-sm font-semibold text-gray-500 w-6 text-right">
                      {/* {idx + 1}. */}
                      <PiNotebookLight size={20} className="text-primary/90" />
                    </div>
                    <div className="text-sm text-gray-800 leading-snug">
                      {item?.note_title || ""}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full text-slate-600 text-sm">
              No notes found!
            </div>
          )}
        </section>
      )}
    </aside>
  );
};

export default Sidebar;
