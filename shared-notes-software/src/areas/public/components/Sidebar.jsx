import { useEffect, useState } from "react";
import { axiosInstance } from "../../../api/axios";
import {
  ADD_SUB_PAGE_DETAILS_URL,
  DELETE_MST_NOTE_URL,
  GET_MST_NOTE_URL,
  MAKE_NOTE_PUBLIC_URL,
} from "../../../api/api_routes";
import { RiDeleteBinLine } from "react-icons/ri";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import toast from "react-hot-toast";
import { BiBookAlt } from "react-icons/bi";
import { LuBadgePlus } from "react-icons/lu";
import DeleteConfirmModal from "../../../reusable/DeleteConfirmModal";
import { load } from "@tauri-apps/plugin-store";
import GenericConfirmModal from "../../../reusable/GenericConfirmModal";

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
  setSelectedNoteType,
  selectedNoteType,
  active,
  setActive,
  sortBy,
  sortDirection,
  autoFetchStatus,
  setAutoFetchStatus,
  isUserLoggedIn,
  publicNotes,
  setPublicNotes,
  privateNotes,
  setPrivateNotes,
}) => {
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [subPageTitle, setSubPageTitle] = useState("");
  const [openNotes, setOpenNotes] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isGenericConfirmModalOpen, setIsGenericConfirmModalOpen] =
    useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteNoteType, setDeleteNoteType] = useState(null);

  const handleFetchAllItemList = async () => {
    const store = await load("user-store.json", { autoSave: true });
    const user = await store.get("user");

    /**
     * sort_by_i TEXT,      -- 'title' or 'created_at'
     * sort_dir_i TEXT      -- 'asc' or 'desc'
     */
    try {
      const payload = {
        SearchText: searchText || null,
        SortBy: sortBy,
        SortDirection: sortDirection,
        UserId: user?.userId || null,
      };
      const res = await axiosInstance.post(GET_MST_NOTE_URL, payload);

      setSidebarItems(res?.data?.data?.public || []);
      setPublicNotes(res?.data?.data?.public || []);
      setPrivateNotes(res?.data?.data?.private || []);
    } catch (error) {
      console.error("not able to fetch sidebar items", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleDeleteNote = async () => {
    try {
      const payload = {
        NoteType: deleteNoteType,
        NoteOrSubPageId: deleteItemId,
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
      setDeleteItemId(null);
      setDeleteNoteType(null);
      setIsDeleteOpen(false);
    }
  };

  const handleSelectNote = (note) => {
    setCurrentNotesId(note?.notes_id);
    setSelectedNoteType("mst-note");
    setOpenMenu(null);
    setNoteHeading(note?.note_title || "");
    setSelectedNoteId(note?.note_id);
    setActive(note?.note_id);
  };

  const handleSelectNoteFromSubPage = (subNote) => {
    setCurrentNotesId(subNote?.notes_id);
    setSelectedNoteType("sub-page");
    setOpenMenu(null);
    setNoteHeading(subNote?.sub_page_title || "");
    setSelectedNoteId(subNote?.sub_page_id);
    setActive(subNote?.sub_page_id);
    setIsSubPage(true);
  };

  const handleModeNoteItem = async () => {
    try {
      const payload = {
        NoteId: selectedNoteId,
      };
      const res = await axiosInstance.post(MAKE_NOTE_PUBLIC_URL, payload);
      // (res);
      if (res?.data?.success == true && res?.data?.status == "UPDATED") {
        toast.success("Note moved to Shared");
        setRefresh((prev) => !prev);
      } else {
        toast.error("Can't move note at the momemt");
      }
    } catch (error) {
      // ("Not able to move note", error);
      toast.error("Can't move note at the momemt");
    } finally {
      setIsGenericConfirmModalOpen(false);
    }
  };

  const handleAddSubPage = async () => {
    setSubmitting(true);
    const store = await load("user-store.json", { autoSave: true });
    const user = await store.get("user");
    try {
      const payload = {
        SubPageTitle: subPageTitle,
        NoteId: selectedNoteId,
      };
      const res = await axiosInstance.post(ADD_SUB_PAGE_DETAILS_URL, payload);
      res;

      if (res?.data?.success == true && res?.data?.status == "CREATED") {
        setSelectedNoteId(res?.data?.sub_page_id);
        setCurrentNotesId(res?.data?.notes_id);
        setNoteHeading(subPageTitle || "");
        setActive(res?.data?.sub_page_id);
        setSelectedNoteType("sub-page");
      } else {
        toast.error("Can't create sub pages at the moment");
      }
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
  }, [refresh, searchText, sortBy, sortDirection, isUserLoggedIn]);

  // Auto fetch
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        handleFetchAllItemList();
        setAutoFetchStatus(true);
      } catch (err) {
        console.error("Auto fetch failed");
      }
    }, 100000); // every 100 seconds

    return () => clearInterval(interval);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // (privateNotes);

  return (
    <>
      <aside className="h-full flex flex-col mt-2">
        {/* Project List */}
        {loading ? (
          <div className="w-full h-[60vh] flex items-center justify-center">
            <div className="loader"></div>
          </div>
        ) : (
          <section className="h-full w-full ">
            {publicNotes != null && publicNotes?.length > 0 ? (
              <div className="flex-1 overflow-y-auto space-y-1 min-h-[80vh] pb-10">
                {isUserLoggedIn && (
                  <div className="ps-1 text-sm font-semibold text-slate-600 pb-1">
                    Private
                  </div>
                )}
                {/* Private Notes */}
                {isUserLoggedIn && privateNotes?.length <= 0 ? (
                  <div>
                    <div className="capitalize text-xs ps-1 py-1.5 text-slate-600 flex items-center justify-start gap-x-1 flex-nowrap">
                      {/* <LuBadgePlus size={16} />{" "}
                      <span>Create Private Notes</span> */}
                      <span>Your Private Notes</span>
                    </div>
                  </div>
                ) : (
                  <section>
                    {privateNotes?.map((item) => {
                      const isOpen = openNotes[item?.note_id];

                      return (
                        <div key={item?.note_id} className="relative my-2">
                          {/* Note Button */}
                          <button
                            onClick={() => {
                              handleSelectNote(item);
                              setOpenNotes((prev) => ({
                                ...prev,
                                [item?.note_id]: !prev[item?.note_id],
                              }));
                            }}
                            className={`group w-full capitalize text-sm text-left px-2 py-2.5 cursor-pointer rounded-lg transition-all duration-200
            ${
              active === item?.note_id && selectedNoteType == "mst-note"
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
                          >
                            <div className="flex items-center justify-between">
                              {/* Left Content */}
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="relative">
                                  <BiBookAlt
                                    size={20}
                                    className={`shrink-0 ${
                                      active === item?.note_id &&
                                      selectedNoteType == "mst-note"
                                        ? "text-primary"
                                        : "text-gray-400 group-hover:text-gray-600"
                                    }`}
                                  />

                                  {/* Sub pages count */}
                                  {item?.sub_pages?.length > 0 ? (
                                    <small
                                      className={`$${
                                        selectedNoteType == "mst-note"
                                          ? "text-primary"
                                          : "text-gray-400 group-hover:text-gray-600"
                                      } text-[10px]   absolute top-px left-0.5 flex items-center justify-center h-4 w-4  p-px rounded-full`}
                                    >
                                      {item?.sub_pages?.length || ""}
                                    </small>
                                  ) : (
                                    <span></span>
                                  )}
                                </div>

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
                                className={`   ${
                                  active === item?.note_id ? "block" : "hidden"
                                } transition-opacity duration-200 p-1 rounded hover:bg-gray-200`}
                              >
                                <PiDotsThreeVerticalBold size={16} />
                              </div>
                            </div>
                          </button>

                          {/* Sub Pages Dropdown */}
                          <div
                            className={`ml-8 overflow-hidden transition-all duration-300 ${
                              isOpen ? " opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            {item?.sub_pages?.map((sub) => (
                              <div
                                onClick={() => {
                                  handleSelectNoteFromSubPage(sub);
                                }}
                                key={sub?.sub_page_id}
                                className={` group
                                flex items-center justify-between gap-2 my-1
                                text-xs
                                px-3 py-1.5
                                rounded-md
                                cursor-pointer
                                transition-all duration-200
                                ${
                                  active === sub?.sub_page_id &&
                                  selectedNoteType == "sub-page"
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
                              `}
                              >
                                <div className="flex items-center justify-start gap-x-1.5 flex-nowrap">
                                  <div
                                    className={`${active === sub?.sub_page_id && selectedNoteType == "sub-page" ? "bg-primary" : "bg-gray-400"} w-1 h-1   rounded-full`}
                                  ></div>
                                  <span className="capitalize">
                                    {sub?.sub_page_title}
                                  </span>
                                </div>
                                <span
                                  onClick={() => {
                                    setDeleteItemId(sub?.sub_page_id);
                                    setIsOpen(false);
                                    setDeleteNoteType("sub-page");
                                    setIsDeleteOpen(true);
                                  }}
                                  className="group-hover:block hidden"
                                >
                                  <RiDeleteBinLine size={14} />
                                </span>
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
                                    [item?.note_id]: true,
                                  }));
                                }}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                              >
                                Add sub-page
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenu(false);
                                  setIsGenericConfirmModalOpen(true);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                              >
                                Move to Shared
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteItemId(item?.note_id);
                                  setOpenMenu(false);
                                  setDeleteNoteType("mst-note");
                                  setIsDeleteOpen(true);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                              >
                                Delete Note
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </section>
                )}

                {/* Shared notes */}
                <section className={`${isUserLoggedIn ? "mt-3" : ""}`}>
                  <div className="ps-1 text-sm font-semibold text-slate-600 pb-1">
                    Shared
                  </div>
                  {publicNotes?.map((item) => {
                    const isOpen = openNotes[item?.note_id];

                    return (
                      <div key={item?.note_id} className="relative my-2">
                        {/* Note Button */}
                        <button
                          onClick={() => {
                            handleSelectNote(item);
                            setOpenNotes((prev) => ({
                              ...prev,
                              [item?.note_id]: !prev[item?.note_id],
                            }));
                          }}
                          className={`group w-full capitalize text-sm text-left px-2 py-2.5 cursor-pointer rounded-lg transition-all duration-200
            ${
              active === item?.note_id && selectedNoteType == "mst-note"
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-50"
            }`}
                        >
                          <div className="flex items-center justify-between">
                            {/* Left Content */}
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="relative">
                                <BiBookAlt
                                  size={20}
                                  className={`shrink-0 ${
                                    active === item?.note_id &&
                                    selectedNoteType == "mst-note"
                                      ? "text-primary"
                                      : "text-gray-400 group-hover:text-gray-600"
                                  }`}
                                />

                                {/* Sub pages count */}
                                {item?.sub_pages?.length > 0 ? (
                                  <small
                                    className={`$${
                                      selectedNoteType == "mst-note"
                                        ? "text-primary"
                                        : "text-gray-400 group-hover:text-gray-600"
                                    } text-[10px]   absolute top-px left-0.5 flex items-center justify-center h-4 w-4  p-px rounded-full`}
                                  >
                                    {item?.sub_pages?.length || ""}
                                  </small>
                                ) : (
                                  <span></span>
                                )}
                              </div>

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
                              className={`   ${
                                active === item?.note_id ? "block" : "hidden"
                              } transition-opacity duration-200 p-1 rounded hover:bg-gray-200`}
                            >
                              <PiDotsThreeVerticalBold size={16} />
                            </div>
                          </div>
                        </button>

                        {/* Sub Pages Dropdown */}
                        <div
                          className={`ml-8 overflow-hidden transition-all duration-300 ${
                            isOpen ? " opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          {item?.sub_pages?.map((sub) => (
                            <div
                              onClick={() => {
                                handleSelectNoteFromSubPage(sub);
                              }}
                              key={sub?.sub_page_id}
                              className={` group
                                flex items-center justify-between gap-2 my-1
                                text-xs
                                px-3 py-1.5
                                rounded-md
                                cursor-pointer
                                transition-all duration-200
                                ${
                                  active === sub?.sub_page_id &&
                                  selectedNoteType == "sub-page"
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
                              `}
                            >
                              <div className="flex items-center justify-start gap-x-1.5 flex-nowrap">
                                <div
                                  className={`${active === sub?.sub_page_id && selectedNoteType == "sub-page" ? "bg-primary" : "bg-gray-400"} w-1 h-1   rounded-full`}
                                ></div>
                                <span className="capitalize">
                                  {sub?.sub_page_title}
                                </span>
                              </div>
                              <span
                                onClick={() => {
                                  setDeleteItemId(sub?.sub_page_id);
                                  setIsOpen(false);
                                  setDeleteNoteType("sub-page");
                                  setIsDeleteOpen(true);
                                }}
                                className="group-hover:block hidden"
                              >
                                <RiDeleteBinLine size={14} />
                              </span>
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
                                  [item?.note_id]: true,
                                }));
                              }}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                            >
                              Add sub-page
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteItemId(item?.note_id);
                                setOpenMenu(false);
                                setDeleteNoteType("mst-note");
                                setIsDeleteOpen(true);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                            >
                              Delete Note
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </section>
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
            <h3 className="text-lg font-semibold mb-4">Create New Sub Page</h3>

            <div>
              <input
                type="text"
                placeholder="Enter note title..."
                value={subPageTitle}
                onChange={(e) => setSubPageTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // prevent form submit
                    handleAddSubPage();
                  }
                }}
                className="w-full capitalize border border-primary rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
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

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleDeleteNote()}
        title="Delete Note"
        description="This note will be permanently removed."
      />

      <GenericConfirmModal
        isOpen={isGenericConfirmModalOpen}
        onClose={() => setIsGenericConfirmModalOpen(false)}
        onConfirm={() => handleModeNoteItem()}
        title="Move to Shared"
        description="This note will be permanently move to Shared."
      />
    </>
  );
};

export default Sidebar;
