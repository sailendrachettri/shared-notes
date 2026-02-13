import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Playground from "./components/Playground";
import Footer from "./common/Footer";
import CreaterNewNotesForm from "./components/CreaterNewNotesForm";

const Home = () => {
  const [sidebarItems, setSidebarItems] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [refresh, setRefresh] = useState(null);
   const [searchText, setSearchText] = useState(null);

  return (
    <div className="h-screen bg-gray-100 p-3">
      
      {/* Outer Card Container */}
      <div className="h-full flex flex-col gap-3">
        
        {/* Main Section */}
        <div className="flex flex-1 gap-3 overflow-hidden">
          
          {/* Sidebar Card */}
          <div className="w-72 bg-white rounded-2xl shadow-sm px-4 flex flex-col hidden md:flex">
            <CreaterNewNotesForm setSearchText={setSearchText} setRefresh={setRefresh} />
            <div className="flex-1 overflow-y-auto">
              <Sidebar searchText={searchText} refresh={refresh} sidebarItems={sidebarItems} setSidebarItems={setSidebarItems} setSelectedNoteId={setSelectedNoteId} />
            </div>
          </div>

          {/* Content Card */}
          <div className="flex-1  rounded-2xl shadow-sm overflow-y-auto hide-scrollbar">
            <Playground  selectedNoteId={selectedNoteId} />
          </div>

        </div>

        {/* Footer Card */}
        <div className="px-6 py-3">
          <Footer />
        </div>

      </div>
    </div>
  );
};

export default Home;
