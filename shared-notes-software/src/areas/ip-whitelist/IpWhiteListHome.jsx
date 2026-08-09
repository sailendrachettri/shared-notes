import React from "react";
import { useState } from "react";
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
import { useEffect } from "react";
import { axiosInstance } from "../../api/axios";
import { GET_ALL_PROJECTS_URL } from "../../api/api_routes";
import { customToast } from "../../utils/toast/toastConfig";

const IpWhiteListHome = () => {
  const [addNewProject, setAddNewProject] = useState(false);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(GET_ALL_PROJECTS_URL);
        console.log(res);

        setAllProjects(res?.data || []);
      } catch (error) {
        setAllProjects([]);
        customToast.warning("No details found!");
      }
    })();
  }, []);

  const projects = [
    {
      id: 1,
      name: "Citizen Bank",
      serverIp: "165.232.178.33",
      postgresPort: 5432,
      lastWhitelisted: "Today, 10:32 AM",
      status: "Active",
    },
    {
      id: 2,
      name: "HRMS",
      serverIp: "142.93.120.45",
      postgresPort: 5432,
      lastWhitelisted: "Yesterday, 4:20 PM",
      status: "Active",
    },
    {
      id: 3,
      name: "Payroll System",
      serverIp: "167.71.89.21",
      postgresPort: 5432,
      lastWhitelisted: "Aug 7, 2026",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f6] px-6 py-8 text-[var(--color-secondary)]">
      <div className="mx-auto max-w-7xl">
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
            {/* Current IP / Main Action */}
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
                {/* Current IP */}
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
                      Current IP Address
                    </p>

                    <div className="mt-1 flex items-center gap-3">
                      <span className="font-mono text-lg font-semibold">
                        103.xxx.xxx.xxx
                      </span>

                      <span
                        className="
                      flex items-center gap-1
                      rounded-full
                      bg-[var(--color-ternary)]/30
                      px-2 py-1
                      text-[11px]
                      font-semibold
                      text-[var(--color-secondary)]
                    "
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                        Detected
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      Last checked a few seconds ago
                    </p>
                  </div>
                </div>

                {/* Whitelist All */}
                <div className="border-t border-gray-100 p-4 lg:border-l lg:border-t-0">
                  <button
                    className="
                  flex w-full items-center justify-center gap-2
                  rounded-lg
                  bg-[var(--color-secondary)]
                  px-5 py-3
                  text-sm font-semibold text-white
                  transition-all
                  hover:opacity-90
                  active:scale-[0.98]
                  lg:w-auto
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
                  {projects.length} projects configured for PostgreSQL access.
                </p>
              </div>

              <button
                className="
              hidden items-center gap-2
              text-sm font-medium
              text-gray-500
              transition
              hover:text-[var(--color-primary)]
              sm:flex
            "
              >
                <FiRefreshCw size={15} />
                Refresh
              </button>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {allProjects.map((project) => (
                <div
                  key={project.ipWhitelistId}
                  className="
        group
        rounded-xl
        border border-gray-200
        bg-white
        p-5
        shadow-sm
        transition-all
        hover:-translate-y-0.5
        hover:border-[var(--color-primary)]/30
        hover:shadow-md
      "
                >
                  {/* Card Top */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="
              flex h-11 w-11
              items-center justify-center
              rounded-lg
              bg-[var(--color-primary)]/10
            "
                      >
                        <FiServer
                          size={21}
                          className="text-[var(--color-primary)]"
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-[var(--color-secondary)]">
                          {project.projectName}
                        </h3>

                        <div className="mt-1 flex items-center gap-1.5">
                          <FiCheckCircle
                            size={13}
                            className={
                              project.isActive
                                ? "text-[var(--color-primary)]"
                                : "text-gray-400"
                            }
                          />

                          <span className="text-xs text-gray-400">
                            {project.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="
            rounded-lg p-1.5
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-[var(--color-secondary)]
          "
                    >
                      <FiMoreVertical size={18} />
                    </button>
                  </div>

                  {/* Environment */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Environment</span>

                    <span
                      className="
            rounded-full
            bg-[var(--color-ternary)]/30
            px-2.5 py-1
            text-[11px]
            font-semibold
            text-[var(--color-secondary)]
          "
                    >
                      {project.envType}
                    </span>
                  </div>

                  {/* Server Info */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiServer size={15} />
                        <span className="text-xs font-medium">Server</span>
                      </div>

                      <span className="font-mono text-xs font-medium text-gray-700">
                        {project.serverHost}:{project.sshPort}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiDatabase size={15} />
                        <span className="text-xs font-medium">PostgreSQL</span>
                      </div>

                      <span className="font-mono text-xs font-medium text-gray-700">
                        :{project.postgresPort}
                      </span>
                    </div>
                  </div>

                  {/* Whitelisted IP */}
                  <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiShield size={14} />

                        <span className="text-xs font-medium">
                          Whitelisted IP
                        </span>
                      </div>

                      <span className="font-mono text-xs font-medium text-gray-700">
                        {project.currentIpAddress || "Not whitelisted"}
                      </span>
                    </div>
                  </div>

                  {/* Last Whitelisted */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <FiClock size={14} />

                    <span>
                      Last whitelisted:{" "}
                      <span className="font-medium text-gray-500">
                        {project.lastIpCheckDateTime
                          ? new Date(
                              project.lastIpCheckDateTime,
                            ).toLocaleString()
                          : "Never"}
                      </span>
                    </span>
                  </div>

                  {/* Action */}
                  <button
                    type="button"
                    disabled={!project.isActive}
                    onClick={() => handleWhitelistProject(project)}
                    className="
          mt-5
          flex w-full
          items-center justify-center gap-2
          rounded-lg
          border border-gray-200
          px-4 py-2.5
          text-sm font-semibold
          text-[var(--color-secondary)]
          transition-all
          hover:border-[var(--color-primary)]/40
          hover:bg-[var(--color-primary)]/5
          hover:text-[var(--color-primary)]
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:bg-gray-50
          disabled:text-gray-400
        "
                  >
                    <FiShield size={16} />
                    {project.isActive
                      ? "Whitelist Current IP"
                      : "Project Inactive"}
                  </button>
                </div>
              ))}
              {/* Add Project Card */}
              <button
              onClick={()=>{setAddNewProject(true)}}
                className="
              group
              flex min-h-[280px]
              flex-col items-center justify-center
              rounded-xl
              border-2 border-dashed border-gray-200
              bg-white
              p-6
              text-center
              transition-all
              hover:border-[var(--color-primary)]/50
              hover:bg-[var(--color-primary)]/[0.02] cursor-pointer
            "
              >
                <div
                  className="
                flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-[var(--color-primary)]/10
                transition
                group-hover:bg-[var(--color-primary)]/15
              "
                >
                  <FiPlus size={22} className="text-[var(--color-primary)]" />
                </div>

                <p className="mt-4 text-sm font-semibold">Add New Project</p>

                <p className="mt-1 max-w-[220px] text-xs leading-5 text-gray-400">
                  Add server credentials and configure PostgreSQL whitelist
                  access.
                </p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IpWhiteListHome;
