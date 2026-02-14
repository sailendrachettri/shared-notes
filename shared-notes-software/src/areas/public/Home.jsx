import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Playground from "./components/Playground";
import Footer from "./common/Footer";
import CreaterNewNotesForm from "./components/CreaterNewNotesForm";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const Home = () => {
  const [sidebarItems, setSidebarItems] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [noteHeading, setNoteHeading] = useState("");

  return (
    <div className="h-screen bg-gray-100 p-3">
      {/* Outer Card Container */}
      <div className="h-full flex flex-col gap-3">
        {/* Main Section */}
        <div className="flex flex-1 gap-3 overflow-hidden ">
          <div className="relative">
            <button
              onClick={() => setToggleSidebar((prev) => !prev)}
              className={`
      absolute -right-7 top-0 cursor-pointer
      flex items-center justify-center
      w-7 h-7
      bg-white
      border border-gray-200
      rounded-full
      shadow-sm
      hover:shadow-md
      hover:bg-gray-50
      transition-all duration-200
      group z-40
    `}
            >
              <MdKeyboardDoubleArrowLeft
                size={18}
                className={`
        text-gray-600
        transition-transform duration-300
        ${toggleSidebar ? "rotate-180" : ""}
      `}
              />
            </button>
          </div>

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
                  setNoteHeading={setNoteHeading}
                />
              </div>
            </div>
          </section>

          {/* Content Card */}
          <div className="flex-1  rounded-2xl shadow-sm overflow-y-auto hide-scrollbar mb-1">
            <Playground
              selectedNoteId={selectedNoteId}
              noteHeading={noteHeading}
              setRefresh={setRefresh}
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
