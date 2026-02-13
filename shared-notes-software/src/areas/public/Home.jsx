import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Playground from "./components/Playground";
import Footer from "./common/Footer";
import CreaterNewNotesForm from "./components/CreaterNewNotesForm";

const Home = () => {
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  return (
    <div className="h-screen bg-gray-100 p-6">
      
      {/* Outer Card Container */}
      <div className="h-full flex flex-col gap-6">
        
        {/* Main Section */}
        <div className="flex flex-1 gap-6 overflow-hidden">
          
          {/* Sidebar Card */}
          <div className="w-72 bg-white rounded-2xl shadow-sm p-4 flex flex-col hidden md:flex">
            <CreaterNewNotesForm />
            <div className="mt-4 flex-1 overflow-y-auto">
              <Sidebar setSelectedNoteId={setSelectedNoteId} />
            </div>
          </div>

          {/* Content Card */}
          <div className="flex-1  rounded-2xl shadow-sm overflow-y-auto hide-scrollbar">
            <Playground selectedNoteId={selectedNoteId} />
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
