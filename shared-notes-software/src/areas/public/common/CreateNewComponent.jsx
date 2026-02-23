import React from "react";
import { useState } from "react";
import { BiSolidCommentAdd } from "react-icons/bi";
import { FiFileText, FiLayers } from "react-icons/fi";
import CreaterNewNotesForm from "./CreaterNewNotesForm";
import CreateNewWorkSpace from "./CreateNewWorkSpace";

const CreateNewComponent = ({
  setRefresh,
  setSearchText,
  setSelectedNoteId,
  setCurrentNotesId,
  setNoteHeading,
  setActive,
  setSelectedNoteType,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  isUserLoggedIn,
  setIsSubPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);
  console.log(isOpen);
  console.log(selectedTab)
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="h-12 w-12 absolute bottom-16 left-56 z-40 cursor-pointer rounded-full bg-primary  text-white py-2  shadow-lg shadow-primary/40 hover:shadow-primary/80 duration-150 transition"
      >
        <span className="flex items-center justify-center gap-x-2 flex-nowrap">
          <BiSolidCommentAdd size={20} />
        </span>
      </button>

      {/* Selection section */}
      {isOpen && (
        <section>
          {selectedTab ? (
            <section>
              {selectedTab == "notes" && (
                <CreaterNewNotesForm
                  setSelectedNoteId={setSelectedNoteId}
                  setCurrentNotesId={setCurrentNotesId}
                  setNoteHeading={setNoteHeading}
                  setActive={setActive}
                  setSelectedNoteType={setSelectedNoteType}
                  setIsOpen={setIsOpen}
                  setSelectedTab={setSelectedTab}
                  isUserLoggedIn={isUserLoggedIn}
                  setIsSubPage={setIsSubPage}
                  setRefresh={setRefresh}
                />
              )}

              {selectedTab == "workspace" && <CreateNewWorkSpace setSelectedTab={setSelectedTab} setIsOpen={setIsOpen}/>}
            </section>
          ) : (
            <section className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsOpen(false)}
              />

              {/* Modal */}
              <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 pb-10 z-10">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">
                  Create New
                </h3>

                <section className="grid grid-cols-2 gap-4">
                  {/* Create Note */}
                  <button
                    onClick={() => {
                      setSelectedTab("notes");
                    }}
                    className="flex flex-col items-center justify-center cursor-pointer p-6 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3 group-hover:bg-blue-100 transition">
                      <FiFileText size={22} />
                    </div>

                    <div className="font-medium text-slate-800 text-sm">
                      New Note
                    </div>
                    <div className="text-xs text-slate-500 mt-1 text-center">
                      Start writing instantly
                    </div>
                  </button>

                  {/* Create Workspace */}
                  <button
                    onClick={() => {
                      setSelectedTab("workspace");
                    }}
                    className="flex flex-col items-center justify-center cursor-pointer p-6 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-3 group-hover:bg-purple-100 transition">
                      <FiLayers size={22} />
                    </div>

                    <div className="font-medium text-slate-800 text-sm">
                      New Workspace
                    </div>
                    <div className="text-xs text-slate-500 mt-1 text-center">
                      Create a new board view
                    </div>
                  </button>
                </section>
              </div>
            </section>
          )}
        </section>
      )}
    </>
  );
};

export default CreateNewComponent;
