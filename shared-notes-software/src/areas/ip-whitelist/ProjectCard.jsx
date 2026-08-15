import React from "react";
import {
  FiCheckCircle,
  FiClock,
  FiDatabase,
  FiMoreVertical,
  FiPlus,
  FiServer,
  FiShield,
} from "react-icons/fi";
import { formatePrettyDateTime } from "../../utils/date-time/formatePrettyDateTime";
import { RiDeleteBinLine } from "react-icons/ri";
import { HiOutlineDotsVertical } from "react-icons/hi";
import WhiteListOptionMenu from "./WhiteListOptionMenu";
import { useState } from "react";

const ProjectCard = ({
  setAddNewProject,
  allProjects,
  setSelectedProjectId,
  setIsDeleteOpen,
  setSelectedMenuCardId,
  selectedMenuCardId,
  setAllowEdit,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {allProjects?.map((project) => (
          <div
            key={project?.ipWhitelistId}
            className="
            group
            rounded-xl
            border border-gray-200
            bg-white
            p-5
            shadow-sm
            transition-all
            hover:border-[var(--color-primary)]/30
            hover:shadow-md
          "
          >
            {/* Card Top */}
            <div className="flex items-start justify-between relative">
              <div className="flex items-center gap-3">
                <div
                  className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-lg
                  bg-[var(--color-primary)]/10
                "
                >
                  <FiServer size={21} className="text-[var(--color-primary)]" />
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--color-secondary)] capitalize">
                    {project?.projectName}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5">
                    <FiCheckCircle
                      size={13}
                      className={
                        project?.isActive
                          ? "text-[var(--color-primary)]"
                          : "text-gray-400"
                      }
                    />

                    <span className="text-xs text-gray-400">
                      {project?.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* <button
                        onClick={()=>{setSelectedProjectId(project?.ipWhitelistId); setIsDeleteOpen(true)}}
                          type="button"
                          className="
                rounded-lg p-1.5
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-[var(--color-secondary)] group-hover:visible invisible
              "
                        >
                          <RiDeleteBinLine size={18} className='text-red-500 opacity-70 cursor-pointer'/>
                        </button> */}
              <button
                onClick={() => {
                  setShowMenu(true);
                  setSelectedMenuCardId(project?.ipWhitelistId);
                }}
                type="button"
                className="
                rounded-lg p-1.5
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-[var(--color-secondary)]              "
              >
                <HiOutlineDotsVertical
                  size={18}
                  className="opacity-70 cursor-pointer"
                />
              </button>
              {showMenu && selectedMenuCardId === project?.ipWhitelistId && (
                <WhiteListOptionMenu
                  setIsDeleteOpen={setIsDeleteOpen}
                  setSelectedProjectId={setSelectedProjectId}
                  selectedMenuCardId={selectedMenuCardId}
                  setShowMenu={setShowMenu}
                  setAllowEdit={setAllowEdit}
                  setAddNewProject={setAddNewProject}
                />
              )}
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
                {project?.envType}
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
                  {project?.serverHost}:{project?.sshPort}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-2 text-gray-400">
                  <FiDatabase size={15} />
                  <span className="text-xs font-medium">PostgreSQL</span>
                </div>

                <span className="font-mono text-xs font-medium text-gray-700">
                  :{project?.postgresPort}
                </span>
              </div>
            </div>

            {/* Whitelisted IP */}
            <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <FiShield size={14} />

                  <span className="text-xs font-medium">Whitelisted IP</span>
                </div>

                <span className="font-mono text-xs font-medium text-gray-700">
                  {project?.currentIpAddress?.replace("/", ".") ||
                    "Not whitelisted"}
                </span>
              </div>
            </div>

            {/* Last Whitelisted */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <FiClock size={14} />

              <span>
                Last whitelisted:{" "}
                <span className="font-medium text-gray-500">
                  {project?.lastIpCheckDateTime
                    ? formatePrettyDateTime(project?.lastIpCheckDateTime)
                    : "Never"}
                </span>
              </span>
            </div>

            {/* Action */}
            {!project?.isActive && (
              <button
                type="button"
                disabled={!project?.isActive}
                // onClick={() => handleSingleProjectIPWhitelist(project)}
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
                Project Inactive
              </button>
            )}
          </div>
        ))}

        {/* Add Project Card */}
        <button
          onClick={() => {
            setAddNewProject(true);
          }}
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
            Add server credentials and configure PostgreSQL whitelist access.
          </p>
        </button>
      </div>
    </>
  );
};

export default ProjectCard;
