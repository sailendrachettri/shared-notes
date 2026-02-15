import  { useState, useEffect } from "react";
import { axiosInstance } from "../../../api/axios";
import { ADD_MST_NOTE_URL } from "../../../api/api_routes";
import toast from "react-hot-toast";
import { HiOutlineViewGridAdd, HiOutlineSearch } from "react-icons/hi";


const CreaterNewNotesForm = ({ setRefresh, setSearchText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!title.trim()) return;
      const payload = {
        NoteTitle: title || null,
      };
      const res = await axiosInstance.post(ADD_MST_NOTE_URL, payload);
    

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
      <div className="flex items-center justify-start pe-6 border-b border-gray-200">
        
        <h2 className="text-sm p-2 font-semibold text-gray-800">All Notes</h2>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md transition"
        >
          <span className="flex items-center justify-center gap-x-2 flex-nowrap">
            <HiOutlineViewGridAdd size={20} />
            <div className="text-sm lg:text-base"> Create Notes</div>
          </span>
        </button>

        <div className="mt-4">
          <div className="relative">
            <HiOutlineSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
            onChange={(e)=> setSearchText(e.target.value)}
              type="text"
              placeholder="Search notes..."
              className="
        w-full
        pl-10 pr-4 py-2.5
        rounded-md
         border-none
        bg-gray-50
        text-sm
        placeholder:text-gray-400
        focus:outline-none
        focus:ring-1
        focus:ring-primary/40
        focus:border-primary
        transition
      "
            />
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
