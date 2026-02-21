import { useState, useEffect } from "react";
import { axiosInstance } from "../../../api/axios";
import { ADD_MST_NOTE_URL } from "../../../api/api_routes";
import toast from "react-hot-toast";
import { HiOutlineSearch } from "react-icons/hi";

import { BiSolidCommentAdd } from "react-icons/bi";
import { TbAbc } from "react-icons/tb";
import { IoTimerOutline } from "react-icons/io5";
import { FaArrowUpLong } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";
import { LuRefreshCw } from "react-icons/lu";
import { load } from "@tauri-apps/plugin-store";
import { useRef } from "react";

const CreaterNewNotesForm = ({
  setRefresh,
  setSearchText,
  setSelectedNoteId,
  setCurrentNotesId,
  setNoteHeading,
  setActive,
  setSelectedNoteType,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  isUserLoggedIn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [pageReload, setPageReload] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [makeItPublic, setMakeItPublic] = useState(true);
  const searchInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const store = await load("user-store.json", { autoSave: true });
    const user = await store.get("user");

    try {
      if (!title.trim()) return;
      /**
       * Based On user make it public or private decison
       * And if the user is not loggedin then it will be public by default
       */
      let user_decision;
      if (makeItPublic) {
        user_decision = null;
      } else if (!makeItPublic && isUserLoggedIn) {
        user_decision = user?.userId;
      }

      const payload = {
        NoteTitle: title || null,
        UserId: user_decision || null,
      };

      const res = await axiosInstance.post(ADD_MST_NOTE_URL, payload);

      if (res?.data?.success == true && res?.data?.status == "CREATED") {
        setSelectedNoteType("mst-note");
        setNoteHeading(res?.data?.note_title);
        setCurrentNotesId(res?.data?.notes_id);
        setActive(res?.data?.mst_note_id);
        setSelectedNoteId(
          res?.data?.mst_note_id,
        ); /* mst_note_id is same as note_id same as note_or_sub_page_id */
      }

      setTitle("");
      setIsOpen(false);
      toast.success("Note created successful!");
    } catch (error) {
      console.error("Not able to create new note");
      toast.error("Can't create new note");
    } finally {
      setTimeout(() => {
        setRefresh((prev) => !prev);
        setSubmitting(false);
        setMakeItPublic(false);
      }, 500);
    }
  };

  const handlePageRefresh = () => {
    setPageReload(true);

    setRefresh((prev) => !prev);

    setTimeout(() => {
      setPageReload(false);
    }, 2000);
  };

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Search shotcut key ctrl + k
  useEffect(() => {
    const handleSearchShortcut = (e) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");

      const isShortcutPressed = isMac
        ? e.metaKey && e.key.toLowerCase() === "k"
        : e.ctrlKey && e.key.toLowerCase() === "k";

      if (!isShortcutPressed) return;

      e.preventDefault();

      // Ignore if user already typing inside input/textarea
      const tag = document.activeElement.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      // Only focus if no note selected

      searchInputRef.current?.focus();
    };

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  return (
    <div>
      <div className="mb-3 mt-5">
        <button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 absolute bottom-16 left-56 z-40 cursor-pointer rounded-full bg-primary  text-white py-2  shadow-lg shadow-primary/40 hover:shadow-primary/80 duration-150 transition"
        >
          <span className="flex items-center justify-center gap-x-2 flex-nowrap">
            <BiSolidCommentAdd size={20} />
          </span>
        </button>

        <div className="mt-2">
          <div className="relative">
            <HiOutlineSearch
              size={17}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              ref={searchInputRef}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder={`${pageReload ? "Syncing notes" : "Search (Ctrl+K)"} `}
              className="
        w-full
        pl-8 pr-4 py-2.5
        rounded-md
         border-none
        bg-gray-50
        text-xs
        placeholder:text-gray-400
        focus:outline-none
        focus:ring-1
        focus:ring-primary/40
        focus:border-primary
        transition
      "
            />

            <div className="flex items-center justify-start gap-x-2 flex-nowrap absolute right-3 top-1/2 -translate-y-1/2">
              {/* Sort By Title */}

              <LuRefreshCw
                size={16}
                className={`${pageReload ? "text-primary animate-spin" : "text-gray-400"} cursor-pointer`}
                onClick={handlePageRefresh}
              />
              <TbAbc
                size={21}
                className={`${sortBy === "title" ? "text-primary" : "text-gray-400"} cursor-pointer`}
                onClick={() => setSortBy("title")}
              />

              {/* Sort By Created Time */}
              <IoTimerOutline
                size={18}
                className={`${sortBy === "created_at" ? "text-primary" : "text-gray-400"} cursor-pointer`}
                onClick={() => setSortBy("created_at")}
              />

              {/* Toggle Direction */}
              <div
                onClick={() =>
                  setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="flex items-center cursor-pointer"
              >
                <FaArrowUpLong
                  size={11}
                  className={`transition-colors duration-200 translate-x-0.5 ${
                    sortDirection === "asc" ? "text-primary" : "text-gray-400"
                  }`}
                />

                <FaArrowDownLong
                  size={11}
                  className={`transition-colors duration-200 ${
                    sortDirection === "desc" ? "text-primary" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Create New Note</h3>

            <form onSubmit={handleSubmit}>
              {isUserLoggedIn ? (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Private by default.</span>
                    <span className="ps-1">
                      You can choose to make this note public.
                    </span>
                  </p>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary"
                      onChange={(e) => setMakeItPublic(e.target.checked)}
                    />
                    <span className="text-sm text-gray-600">
                      Make this note public
                    </span>
                  </label>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-4">
                  <p className="text-sm text-primary font-medium">
                    You are creating a public note.
                  </p>
                  <p className="text-xs text-primary/90 mt-1">
                    Anyone with access will be able to view it.
                  </p>
                </div>
              )}

              <input
                type="text"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

                {/* <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                >
                  Create
                </button> */}
                <button
                  disabled={submitting}
                  type="submit"
                  // onClick={() => {
                  //   handleSubmit();
                  // }}
                  className={`${submitting ? "bg-slate-300 text-slate-700 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"} px-4 py-2 rounded-lg transition`}
                >
                  {`${submitting ? "Creating.." : "Create"}`}
                </button>
              </div>
            </form>
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CreaterNewNotesForm;
