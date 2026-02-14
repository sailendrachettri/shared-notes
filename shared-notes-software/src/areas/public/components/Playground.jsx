import { useEffect, useState, useRef } from "react";
import RichTextEditor from "../common/RichTextEditor";
import { axiosInstance } from "../../../api/axios";
import {
  ADD_UPDATE_NOTES_URL,
  GET_NOTES__DETAILS_URL,
  RENAME_MST_NOTE_URL,
} from "../../../api/api_routes";
import InfoScreen from "../../../utils/info-screen/InfoScreen";
import toast from "react-hot-toast";

const Playground = ({ selectedNoteId, noteHeading }) => {
  const [selectedFullDetails, setSelectedFullDetails] = useState("");
  const [showToast, setShowToast] = useState(false);
  const timeoutRef = useRef(null);
  const [currentNotesId, setCurrentNotesId] = useState(null);


  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const handleOnInputChange = (content) => {
    setSelectedFullDetails(content);

    // Clear previous timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Auto-save after 1 second
    timeoutRef.current = setTimeout(() => {
      handleAutoSave(content);
    }, 1000);
  };

  const handleAutoSave = async (data) => {
    try {
      const payload = {
        NotesDetails: data || "",
        NoteId: selectedNoteId,
        NotesId: currentNotesId,
      };

      const res = await axiosInstance.post(ADD_UPDATE_NOTES_URL, payload);

      setCurrentNotesId(res?.data?.notes_id || null);
      setLastUpdatedAt(new Date()); // reflect latest update

      // Show toast
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (error) {
      console.error("Not able to auto save", error);
    } finally {
    }
  };

  const getNotesDetails = async () => {
    try {
      const payload = {
        NotesId: currentNotesId,
        NoteId: selectedNoteId,
      };
      const res = await axiosInstance.post(GET_NOTES__DETAILS_URL, payload);

      if (res?.data?.success == true && res?.data?.status == "FETCHED") {
        setSelectedFullDetails(res?.data?.data?.notes_details);
        setLastUpdatedAt(
          res?.data?.data?.updated_at || res?.data?.data?.created_at || null,
        );
      } else {
        setSelectedFullDetails("");
        setLastUpdatedAt(null);
      }
    } catch (error) {
      console.error("Not able fetch details", error);
    }
  };

  useEffect(() => {
    if (selectedNoteId != null) {
      getNotesDetails();
    }
  }, [selectedNoteId]);

  const renameNoteTitle = async (newTitle) => {
    try {
      const payload = {
        NoteId: selectedNoteId,
        NoteTitle: newTitle || noteHeading,
      };
      const res = await axiosInstance.post(RENAME_MST_NOTE_URL, payload);
      console.log(res);
    } catch (error) {
      console.error("Not able to rename", error);
      toast.error("Can't rename at this moment");
    }
  };

  return (
    <>
      <section>
        {selectedNoteId ? (
          <section className="relative">
            <RichTextEditor
              value={selectedFullDetails}
              onChange={handleOnInputChange}
              placeholder="Start writing your note..."
              height="1080px"
              heading={noteHeading}
              lastUpdatedAt={lastUpdatedAt}
              onTitleChange={renameNoteTitle}
            />

            {/* Custom Toast */}
            {showToast && (
              <div className="fixed bottom-6 right-6  text-slate-400 px-4 py-2 rounded-lg text-sm animate-fadeIn">
                Auto saved ✓
              </div>
            )}
          </section>
        ) : (
          <section>
            <InfoScreen />
          </section>
        )}
      </section>
    </>
  );
};

export default Playground;
