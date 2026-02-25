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
  setIsOpen,
  setRefresh,
  setSelectedNoteId,
  setCurrentNotesId,
  setNoteHeading,
  setActive,
  setSelectedNoteType,
  isUserLoggedIn,
  setIsSubPage,
  setSelectedTab,
}) => {
  const [title, setTitle] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [makeItPublic, setMakeItPublic] = useState(false);

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
      if (isUserLoggedIn) {
        if (makeItPublic) {
          user_decision = null;
        } else if (!makeItPublic) {
          user_decision = user?.userId;
        } else {
          toast.error("Can't create notes at the moment");
          return;
        }
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
        setIsSubPage(false);
        setSelectedNoteId(
          res?.data?.mst_note_id,
        ); /* mst_note_id is same as note_id same as note_or_sub_page_id */
      }

      setTitle("");
      setIsOpen(false);
      setMakeItPublic(false);
      toast.success("Note created successful!");
    } catch (error) {
      console.error("Not able to create new note");
      toast.error("Can't create new note");
    } finally {
      setTimeout(() => {
        setRefresh((prev) => !prev);
        setSubmitting(false);
      }, 500);
    }
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
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100  mb-4">
                <p className="text-sm text-slate-500 font-medium">
                  You are creating a public note.
                </p>
                <p className="text-xs text-slate-500 0 mt-1">
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
                onClick={() => setSelectedTab(null)}
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
          onClick={() => {
            setSelectedTab(null);
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default CreaterNewNotesForm;
