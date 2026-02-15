import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Playground from "./components/Playground";
import Footer from "./common/Footer";
import CreaterNewNotesForm from "./components/CreaterNewNotesForm";

const Home = ({toggleSidebar}) => {
  const [sidebarItems, setSidebarItems] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [searchText, setSearchText] = useState(null);
 
  const [noteHeading, setNoteHeading] = useState("");
  const [currentNotesId, setCurrentNotesId] = useState(null);
  const [isSubPage, setIsSubPage] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState("");

  return (
    <div className="h-screen bg-gray-100 p-3">
      {/* Outer Card Container */}
      <div className="h-full flex flex-col gap-3">
        {/* Main Section */}
        <div className="flex flex-1 gap-3 overflow-hidden ">
         

          {/* Sidebar Card */}
          <section className={`${toggleSidebar ? "hidden" : "visible"} mb-1`}>
            <div className="w-72 h-full  bg-white rounded-2xl shadow-sm px-4 flex flex-col hidden md:flex">
              <CreaterNewNotesForm
                setSearchText={setSearchText}
                setRefresh={setRefresh}
              />
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                <Sidebar
                  searchText={searchText}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  sidebarItems={sidebarItems}
                  setSidebarItems={setSidebarItems}
                  setSelectedNoteId={setSelectedNoteId}
                  selectedNoteId={selectedNoteId}
                  setNoteHeading={setNoteHeading}
                  setCurrentNotesId={setCurrentNotesId}
                  setIsSubPage={setIsSubPage}
                  setSelectedNoteType={setSelectedNoteType}
                />
              </div>
            </div>
          </section>

          {/* Content Card */}
          <div className="flex-1 rounded-2xl overflow-y-auto hide-scrollbar mb-1">
            <Playground
              selectedNoteId={selectedNoteId}
              noteHeading={noteHeading}
              setRefresh={setRefresh}
              currentNotesId={currentNotesId}
              setCurrentNotesId={setCurrentNotesId}
              isSubPage={isSubPage}
              selectedNoteType={selectedNoteType}
            />
          </div>
        </div>

        {/* Footer Card */}
        <div className="px-6 py-1 ">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
