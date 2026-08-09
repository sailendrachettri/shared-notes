import React, { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiShield,
  FiServer,
  FiDatabase,
  FiMoreVertical,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiRefreshCw,
} from "react-icons/fi";
import AddNewProjectForm from "./AddNewProjectForm";
import { GrRevert } from "react-icons/gr";
import { axiosInstance } from "../../api/axios";
import { GET_ALL_PROJECTS_URL } from "../../api/api_routes";
import { customToast } from "../../utils/toast/toastConfig";
import IpWhitelistTerminal from "./IpWhitelistTerminal";
import { formatePrettyDateTime } from "../../utils/date-time/formatePrettyDateTime";
import ProjectCard from "./ProjectCard";

const IpWhiteListHome = () => {
  const [addNewProject, setAddNewProject] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Controls the terminal modal. `runId` forces a fresh mount of the
  // terminal component each time a whitelist action is triggered, so
  // its internal log/state always starts clean for the new run.
  const [terminal, setTerminal] = useState({
    open: false,
    mode: null, // "single" | "all"
    project: null,
    runId: 0,
  });

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const res = await axiosInstance.get(GET_ALL_PROJECTS_URL);
      setAllProjects(res?.data || []);
    } catch (error) {
      setAllProjects([]);
      customToast.warning("No details found!");
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [addNewProject, fetchProjects]);

  const handleSingleProjectIPWhitelist = (project) => {
    if (!project?.ipWhitelistId) return;

    setTerminal({
      open: true,
      mode: "single",
      project,
      runId: Date.now(),
    });
  };

  const handleAllProjectIPWhitelist = () => {
    if (allProjects.length === 0) {
      customToast.warning("No projects to whitelist.");
      return;
    }

    setTerminal({
      open: true,
      mode: "all",
      project: null,
      runId: Date.now(),
    });
  };

  const handleTerminalComplete = (success, summaryMessage) => {
    if (success) {
      customToast.success(summaryMessage || "Whitelist completed successfully.");
    } else {
      customToast.error(summaryMessage || "Whitelist failed. Check the log for details.");
    }
    // Refresh so updated IPs / last-checked timestamps show immediately.
    fetchProjects();
  };

  const handleTerminalClose = () => {
    setTerminal((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] px-6 py-8 text-[var(--color-secondary)]">
      <div className="mx-auto max-w-7xl pb-16">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                <FiShield size={19} className="text-[var(--color-primary)]" />
              </div>

              <span className="text-sm font-medium text-[var(--color-primary)]">
                Server Access
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              {addNewProject ? "Add New Project" : "IP Whitelist"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage PostgreSQL access for all your projects.
            </p>
          </div>

          {/* Add Project */}
          <button
            onClick={() => {
              setAddNewProject((prev) => !prev);
            }}
            className="
              flex items-center justify-center gap-2
              rounded-lg
              bg-[var(--color-primary)]
              px-4 py-2.5
              text-sm font-semibold text-white
              shadow-sm
              transition-all
              hover:brightness-95
              active:scale-[0.98] cursor-pointer
            "
          >
            {addNewProject ? <GrRevert size={18} /> : <FiPlus size={18} />}
            {addNewProject ? "Go Back" : "Add Project"}
          </button>
        </div>

        {addNewProject ? (
          <div>
            <AddNewProjectForm setAddNewProject={setAddNewProject} />
          </div>
        ) : (
          <>
            {/* Whitelist All */}
            <div
              className="
            mb-8
            overflow-hidden
            rounded-xl
            border border-gray-200
            bg-white
            shadow-sm
          "
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4 p-5">
                  <div
                    className="
                  flex h-12 w-12 shrink-0 items-center justify-center
                  rounded-xl
                  bg-[var(--color-secondary)]
                "
                  >
                    <FiGlobe size={22} className="text-white" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Bulk Action
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      Whitelist every active project
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Runs SSH + UFW updates for all active projects, one after another.
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 p-4 lg:border-l lg:border-t-0">
                  <button
                    onClick={handleAllProjectIPWhitelist}
                    className="
                  flex w-full items-center justify-center gap-2
                  rounded-lg
                  bg-[var(--color-secondary)]
                  px-5 py-3
                  text-sm font-semibold text-white
                  transition-all
                  hover:opacity-90
                  active:scale-[0.98]
                  lg:w-auto cursor-pointer
                "
                  >
                    <FiShield size={18} />
                    Whitelist IP for All Projects
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Header */}
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold">Projects</h2>

                <p className="mt-1 text-sm text-gray-500">
                  {allProjects.length} projects configured for PostgreSQL access.
                </p>
              </div>

              <button
                onClick={fetchProjects}
                disabled={loadingProjects}
                className="
              hidden items-center gap-2
              text-sm font-medium
              text-gray-500
              transition
              hover:text-[var(--color-primary)]
              disabled:opacity-50
              sm:flex
            "
              >
                <FiRefreshCw size={15} className={loadingProjects ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {/* Project Cards */}
           <ProjectCard allProjects={allProjects} setAddNewProject={setAddNewProject} />
          </>
        )}
      </div>

      {terminal.open && (
        <IpWhitelistTerminal
          key={terminal.runId}
          mode={terminal.mode}
          project={terminal.project}
          onClose={handleTerminalClose}
          onComplete={handleTerminalComplete}
        />
      )}
    </div>
  );
};

export default IpWhiteListHome;