import { useState, useEffect } from "react";
import { axiosInstance } from "../../../api/axios";
import { ADD_MST_NOTE_URL } from "../../../api/api_routes";
import toast from "react-hot-toast";
import { HiOutlineViewGridAdd, HiOutlineSearch } from "react-icons/hi";
import { BiSolidMessageRoundedAdd } from "react-icons/bi";
import { BiSolidCommentAdd } from "react-icons/bi";
import { TbAbc } from "react-icons/tb";
import { IoTimerOutline } from "react-icons/io5";
import { RiArrowUpDownLine } from "react-icons/ri";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import { FaArrowUpLong } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";

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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!title.trim()) return;

      const payload = {
        NoteTitle: title || null,
      };
      const res = await axiosInstance.post(ADD_MST_NOTE_URL, payload);
      (res);

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
      setRefresh((prev) => !prev);
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
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder="Search notes..."
              className="
        w-full
        pl-10 pr-4 py-2.5
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
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Create New Note</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                >
                  Create
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
