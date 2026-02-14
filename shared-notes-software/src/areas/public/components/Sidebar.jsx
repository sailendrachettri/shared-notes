import  { useEffect, useState } from "react";
import { axiosInstance } from "../../../api/axios";
import { GET_MST_NOTE_URL } from "../../../api/api_routes";
import { PiNotebookLight } from "react-icons/pi";
import { PiDotsThreeVerticalBold } from "react-icons/pi";

const Sidebar = ({
  setSelectedNoteId,
  sidebarItems,
  setSidebarItems,
  refresh,
  searchText,
}) => {
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

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


  return (
    <aside className="h-full flex flex-col bg-white ">
      {/* Project List */}
      {loading ? (
        <div className="w-full h-[60vh]  flex items-center justify-center">
          <div class="loader"></div>
        </div>
      ) : (
        <section className="h-full w-full">
          {sidebarItems != null && sidebarItems?.length > 0 ? (
            <div className="flex-1 overflow-y-auto px-4 space-y-1">
              {sidebarItems?.map((item, idx) => (
                <button
                  key={item?.note_id}
                  onClick={() => handleSelectNote(item?.note_id)}
                  className={`group relative w-full capitalize text-sm text-left px-3 py-2 cursor-pointer rounded-md transition-all duration-200
  ${
    active === item?.note_id
      ? "border border-slate-200 text-primary bg-gray-50"
      : "border border-white text-gray-600 hover:bg-gray-50"
  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Left Content */}
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 text-sm font-semibold text-gray-500 w-6 text-right">
                        <PiNotebookLight
                          size={20}
                          className="text-primary/90"
                        />
                      </div>

                      <div className="text-sm text-gray-800 leading-snug">
                        {item?.note_title || ""}
                      </div>
                    </div>

                    {/* Three Dot Button */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation(); // prevent selecting note
                        setOpenMenu(
                          openMenu === item?.note_id ? null : item?.note_id,
                        );
                      }}
                      className={`
        opacity-0 group-hover:opacity-100
        ${active === item?.note_id ? "opacity-100" : ""}
        transition-opacity duration-200
        p-1 rounded hover:bg-gray-200
      `}
                    >
                      <div className="min-h-4.5">
                        {active === item?.note_id && (
                          <PiDotsThreeVerticalBold size={18} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown */}
                  {openMenu === item?.note_id && (
                    <div className="absolute right-2 top-10 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Edit clicked");
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Add Subnote
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Edit clicked");
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Rename
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Delete clicked");
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-50"
                      >
                        Archive
                      </button>
                    </div>
                  )}
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
