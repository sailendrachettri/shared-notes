import React, { useEffect, useState } from "react";

const sidebarItems = [
  { sidebar_id: 1, sidebar_title: "Project Alpha" },
  { sidebar_id: 2, sidebar_title: "Project Beta" },
  { sidebar_id: 3, sidebar_title: "Project Gamma" },
  { sidebar_id: 4, sidebar_title: "Project Delta" },
  { sidebar_id: 5, sidebar_title: "Project Omega" },
];

const Playground = ({selectedNoteId}) => {
  const [selectedFullDetails, setSelectedFullDetails] = useState(null);
  console.log(selectedNoteId)

  const handleGetSelectedValue = () => {
    const data = sidebarItems.find((obj) => obj.sidebar_id == selectedNoteId);
    console.log(data);
    setSelectedFullDetails(data);
  };

  useEffect(() => {
    handleGetSelectedValue();
  }, [selectedNoteId]);

  return <div>
    {selectedFullDetails?.sidebar_id } = {selectedFullDetails?.sidebar_title};
  </div>;
};

export default Playground;
