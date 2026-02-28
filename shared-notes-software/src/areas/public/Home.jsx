import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Playground from "./components/Playground";
import Footer from "./common/Footer";
import WorkSpaceMain from "../auth/workspaces/WorkSpaceMain";
import CreateNewComponent from "./common/CreateNewComponent";

import SearchSection from "./common/SearchSection";
import InfoScreen from "../../utils/info-screen/InfoScreen";

const Home = ({
  toggleSidebar,
  autoFetchStatus,
  setAutoFetchStatus,
  isUserLoggedIn,
  selectedWorkspaceId,
   setSelectedWorkspaceId,
   selectedWorkspaceMode, setSelectedWordspaceMode
}) => {
  const [sidebarItems, setSidebarItems] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [searchText, setSearchText] = useState(null);

  const [noteHeading, setNoteHeading] = useState("");
  const [currentNotesId, setCurrentNotesId] = useState(null);
  const [isSubPage, setIsSubPage] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState("");
  const [active, setActive] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortBy, setSortBy] = useState("created_at");
  const [publicNotes, setPublicNotes] = useState(null);
  const [privateNotes, setPrivateNotes] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);

  const [selectedWorkspaceName, setSelectedWorkspaceName] = useState(null);

  const [selectedNotesMode, setSelectedNotesMode] = useState(null);

  // console.log(selectedWorkspaceMode);

  return (
    <div className="h-screen bg-gray-100 p-3">
      {/* Outer Card Container */}
      <div className="h-full flex flex-col gap-3">
        {/* Main Section */}
        <div className="flex flex-1 gap-3 overflow-hidden ">
          {/* Sidebar Card */}
          <section className={`${toggleSidebar ? "hidden" : "visible"} mb-1`}>
            <div className="w-72 h-full  bg-white rounded-md px-4 flex flex-col hidden md:flex">
              {/* Search */}
              <div className="mb-3 mt-1">
                <SearchSection
                  setSearchText={setSearchText}
                  setSortBy={setSortBy}
                  setSortDirection={setSortDirection}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  setRefresh={setRefresh}
                />
              </div>
              <CreateNewComponent
                setRefresh={setRefresh}
                setSelectedNoteId={setSelectedNoteId}
                setCurrentNotesId={setCurrentNotesId}
                setNoteHeading={setNoteHeading}
                setActive={setActive}
                setSelectedNoteType={setSelectedNoteType}
                isUserLoggedIn={isUserLoggedIn}
                setIsSubPage={setIsSubPage}
              />

              <div className="flex-1 overflow-y-auto hide-scrollbar">
                <Sidebar
                  searchText={searchText}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  sidebarItems={sidebarItems}
                  setSidebarItems={setSidebarItems}
                  selectedNoteId={selectedNoteId}
                  setNoteHeading={setNoteHeading}
                  setSelectedNoteId={setSelectedNoteId}
                  setCurrentNotesId={setCurrentNotesId}
                  setIsSubPage={setIsSubPage}
                  setSelectedNoteType={setSelectedNoteType}
                  selectedNoteType={selectedNoteType}
                  active={active}
                  setActive={setActive}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  autoFetchStatus={autoFetchStatus}
                  setAutoFetchStatus={setAutoFetchStatus}
                  isUserLoggedIn={isUserLoggedIn}
                  publicNotes={publicNotes}
                  setPublicNotes={setPublicNotes}
                  privateNotes={privateNotes}
                  setPrivateNotes={setPrivateNotes}
                  setSelectedTab={setSelectedTab}
                  setSelectedWorkspaceId={setSelectedWorkspaceId}
                  setSelectedWorkspaceName={setSelectedWorkspaceName}
                  setSelectedWordspaceMode={setSelectedWordspaceMode}
                  setSelectedNotesMode={setSelectedNotesMode}
                />
              </div>
            </div>
          </section>

          {/* Content Card */}
          <div className="flex-1 rounded-md overflow-y-auto hide-scrollbar mb-1">
            {selectedTab == "notes" && (
              <Playground
                selectedNoteId={selectedNoteId}
                noteHeading={noteHeading}
                setRefresh={setRefresh}
                currentNotesId={currentNotesId}
                setCurrentNotesId={setCurrentNotesId}
                isSubPage={isSubPage}
                selectedNoteType={selectedNoteType}
                refresh={refresh}
                selectedNotesMode={selectedNotesMode}
              />
            )}

            {selectedTab == "workspaces" && selectedWorkspaceId && (
              <WorkSpaceMain
                setRefresh={setRefresh}
                selectedWorkspaceId={selectedWorkspaceId}
                selectedWorkspaceName={selectedWorkspaceName}
                selectedWorkspaceMode={selectedWorkspaceMode}
              />
            )}

            {!selectedNoteId && !selectedWorkspaceId && (
              <section>
                <InfoScreen />
              </section>
            )}
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
