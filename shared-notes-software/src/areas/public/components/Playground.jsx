import React, { useEffect, useState, useRef } from "react";
import RichTextEditor from "../common/RichTextEditor";

const Playground = ({ selectedNoteId }) => {
  const [selectedFullDetails, setSelectedFullDetails] = useState("");
  const [showToast, setShowToast] = useState(false);
  const timeoutRef = useRef(null);

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

  const handleAutoSave = (data) => {
    console.log("Auto saving...", data);

    // 👉 Call your API here
    // await saveNoteApi(data)

    // Show toast
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  console.log(selectedNoteId);


  useEffect(()=>{})
  return (
    <section className="relative">
      <RichTextEditor
        value={selectedFullDetails}
        onChange={handleOnInputChange}
        placeholder="Start writing your note..."
        height="900px"
      />

      {/* Custom Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6  text-slate-400 px-4 py-2 rounded-lg text-sm animate-fadeIn">
          Auto saved ✓
        </div>
      )}
    </section>
  );
};

export default Playground;
