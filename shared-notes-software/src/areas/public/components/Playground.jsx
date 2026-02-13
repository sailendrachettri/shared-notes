import React, { useEffect, useState } from "react";
import RichTextEditor from "../common/RichTextEditor";

const sidebarItems = [
  { sidebar_id: 1, sidebar_title: "Project Alpha" },
  { sidebar_id: 2, sidebar_title: "Project Beta" },
  { sidebar_id: 3, sidebar_title: "Project Gamma" },
  { sidebar_id: 4, sidebar_title: "Project Delta" },
  { sidebar_id: 5, sidebar_title: "Project Omega" },
  { sidebar_id: 6, sidebar_title: "Project Sigma" },
  { sidebar_id: 7, sidebar_title: "Project Nova" },
  { sidebar_id: 8, sidebar_title: "Project Orion" },
  { sidebar_id: 9, sidebar_title: "Project Phoenix" },
  { sidebar_id: 10, sidebar_title: "Project Titan" },
  { sidebar_id: 11, sidebar_title: "Project Atlas" },
  { sidebar_id: 12, sidebar_title: "Project Eclipse" },
  { sidebar_id: 13, sidebar_title: "Project Horizon" },
  { sidebar_id: 14, sidebar_title: "Project Zenith" },
  { sidebar_id: 15, sidebar_title: "Project Vertex" },
  { sidebar_id: 16, sidebar_title: "Project Quantum" },
  { sidebar_id: 17, sidebar_title: "Project Pulse" },
  { sidebar_id: 18, sidebar_title: "Project Fusion" },
  { sidebar_id: 19, sidebar_title: "Project Nebula" },
  { sidebar_id: 20, sidebar_title: "Project Infinity" },
];

const Playground = ({ selectedNoteId }) => {
  const [selectedFullDetails, setSelectedFullDetails] = useState("");

  useEffect(() => {
    const data = sidebarItems.find((obj) => obj.sidebar_id === selectedNoteId);

    if (data) {
      setSelectedFullDetails(data.content);
    } else {
      setSelectedFullDetails("");
    }
  }, [selectedNoteId]);

  return (
    <section className="py-2">
      <RichTextEditor
        value={selectedFullDetails}
        onChange={setSelectedFullDetails}
        placeholder="Start writing your note..."
        height="600px"
      />
    </section>
  );
};

export default Playground;
