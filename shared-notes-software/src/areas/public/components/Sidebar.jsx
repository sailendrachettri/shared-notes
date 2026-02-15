import { useEffect, useState } from "react";
import { axiosInstance } from "../../../api/axios";
import {
  ADD_SUB_PAGE_DETAILS_URL,
  DELETE_MST_NOTE_URL,
  GET_MST_NOTE_URL,
} from "../../../api/api_routes";
import { PiNotebookLight } from "react-icons/pi";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import toast from "react-hot-toast";

const Sidebar = ({
  setSelectedNoteId,
  sidebarItems,
  setSidebarItems,
  refresh,
  setRefresh,
  searchText,
  setNoteHeading,
  selectedNoteId,
  setCurrentNotesId,
  setIsSubPage,
}) => {
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [subPageTitle, setSubPageTitle] = useState("");
  const [openNotes, setOpenNotes] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleFetchAllItemList = async () => {
    try {
      const payload = {
        SearchText: searchText || null,
      };
      const res = await axiosInstance.post(GET_MST_NOTE_URL, payload);
      console.log(res);
      setSidebarItems(res?.data?.data || []);
    } catch (error) {
      console.error("not able to fetch sidebar items", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const payload = {
        NoteId: noteId,
      };
      const res = await axiosInstance.post(DELETE_MST_NOTE_URL, payload);
      if (res?.data?.success == true && res?.data?.status == "DELETED") {
        toast.success("Note Deleted Successful");
      } else {
        toast.error("Can't delete note");
      }
    } catch (error) {
      console.error("not able to delete note", error);
    } finally {
      setOpenMenu(null);
      setRefresh((prev) => !prev);
    }
  };

  const handleSelectNote = (note) => {
    console.log(note);
    setOpenMenu(null);
    setNoteHeading(note?.note_title || "");
    setSelectedNoteId(note?.note_id);
    setActive(note?.note_id);
  };

  const handleSelectNoteFromSubPage = (subNote) => {
    console.log(subNote);
    setOpenMenu(null);
    setNoteHeading(subNote?.sub_page_title || "");
    setSelectedNoteId(subNote?.sub_page_id);
    setActive(subNote?.sub_page_id);
    setIsSubPage(true);
  };

  const handleAddSubPage = async () => {
    setSubmitting(true);
    try {
      console.log(selectedNoteId);
      const payload = {
        SubPageTitle: subPageTitle,
        NoteId: selectedNoteId,
      };
      const res = await axiosInstance.post(ADD_SUB_PAGE_DETAILS_URL, payload);
      console.log(res);
      setSelectedNoteId(res?.data?.sub_page_id);
      setCurrentNotesId(res?.data?.notes_id);
      setNoteHeading(subPageTitle || "");
      setActive(res?.data?.sub_page_id);
    } catch (error) {
      console.error("Not able to create sub page", error);
    } finally {
      setTimeout(() => {
        setOpenMenu(null);
        setIsOpen(false);
        handleFetchAllItemList();
        setSubPageTitle("");
        setSubmitting(false);
      }, 500);
    }
  };

  useEffect(() => {
    handleFetchAllItemList();
  }, [refresh, searchText]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        handleFetchAllItemList();
        console.log("fetching all items..");
      } catch (err) {
        console.error("Version check failed");
      }
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <aside className="h-full flex flex-col">
        {/* Project List */}
        {loading ? (
          <div className="w-full h-[60vh] flex items-center justify-center">
            <div className="loader"></div>
          </div>
        ) : (
          <section className="h-full w-full">
            {sidebarItems != null && sidebarItems?.length > 0 ? (
              <div className="flex-1 overflow-y-auto px-4 space-y-1 min-h-[90vh]">
                {sidebarItems?.map((item) => {
                  const isOpen = openNotes[item.note_id];

                  return (
                    <div key={item.note_id} className="relative">
                      {/* Note Button */}
                      <button
                        onClick={() => handleSelectNote(item)}
                        className={`group w-full capitalize text-sm text-left px-3 py-2 cursor-pointer rounded-lg transition-all duration-200
            ${
              active === item?.note_id
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
                      >
                        <div className="flex items-center justify-between">
                          {/* Left Content */}
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Expand Arrow */}
                            {item?.sub_pages?.length > 0 ? (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenNotes((prev) => ({
                                    ...prev,
                                    [item.note_id]: !prev[item.note_id],
                                  }));
                                }}
                                className="p-1 rounded hover:bg-primary/5 transition"
                              >
                                <svg
                                  className={`w-3 h-3 transition-transform duration-200 ${
                                    isOpen ? "rotate-90" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            ) : (
                              <div className="pl-5"></div>
                            )}

                            <PiNotebookLight
                              size={18}
                              className={`shrink-0 ${
                                active === item?.note_id
                                  ? "text-primary"
                                  : "text-gray-400 group-hover:text-gray-600"
                              }`}
                            />

                            <div className="truncate font-medium text-xs lg:text-sm">
                              {item?.note_title}
                            </div>
                          </div>

                          {/* Three Dot Button */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(
                                openMenu === item?.note_id
                                  ? null
                                  : item?.note_id,
                              );
                            }}
                            className={`opacity-0 group-hover:opacity-100 ${
                              active === item?.note_id ? "opacity-100" : ""
                            } transition-opacity duration-200 p-1 rounded hover:bg-gray-200`}
                          >
                            <PiDotsThreeVerticalBold size={16} />
                          </div>
                        </div>
                      </button>

                      {/* Sub Pages Dropdown */}
                      <div
                        className={`ml-8 overflow-hidden transition-all duration-300 ${
                          isOpen
                            ? "max-h-96 opacity-100 mt-1 "
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {item?.sub_pages?.map((sub) => (
                          <div
                            onClick={() => {
                              handleSelectNoteFromSubPage(sub);
                            }}
                            key={sub?.sub_page_id}
                            className={`
  flex items-center gap-2
  text-xs
  px-3 py-1.5
  rounded-md
  cursor-pointer
  transition-all duration-200
  ${
    active === sub?.sub_page_id
      ? "bg-primary/10 text-primary"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  }
`}
                          >
                            <div
                              className={`${active === sub?.sub_page_id ? "bg-primary" : "bg-gray-400"} w-1 h-1  rounded-full`}
                            ></div>
                            {sub?.sub_page_title}
                          </div>
                        ))}
                      </div>

                      {/* Dropdown Menu */}
                      {openMenu === item?.note_id && (
                        <div className="absolute right-2 top-10 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNoteId(item?.note_id);
                              setIsOpen(true);
                              setOpenMenu(null);
                              setOpenNotes((prev) => ({
                                ...prev,
                                [item.note_id]: true,
                              }));
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            Add sub-page
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(item?.note_id);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                          >
                            Archive
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full text-slate-600 text-sm">
                No notes found!
              </div>
            )}
          </section>
        )}
      </aside>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Create New Note</h3>

            <div>
              <input
                type="text"
                placeholder="Enter note title..."
                value={subPageTitle}
                onChange={(e) => setSubPageTitle(e.target.value)}
                className="w-full capitalize border border-white rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
                maxLength={45}
                minLength={3}
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                <button
                  disabled={submitting}
                  // type="submit"
                  onClick={() => {
                    handleAddSubPage();
                  }}
                  className={`${submitting ? "bg-slate-300 text-slate-700 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"} px-4 py-2 rounded-lg transition`}
                >
                  {`${submitting ? "Creating.." : "Create"}`}
                </button>
              </div>
            </div>
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
