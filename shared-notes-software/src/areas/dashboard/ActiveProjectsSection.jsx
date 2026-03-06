import { useState } from "react";
import { FiTrendingUp, FiFolder } from "react-icons/fi";
import { VIEW_UPLOADED_FILE_URL } from "../../api/api_routes";
import { BiBarChartAlt2 } from "react-icons/bi";
import DashboardHeading from "../../reusable/headings/DashboardHeading";

const ActiveProjectsSection = ({ userFullReport }) => {
  const [hovered, setHovered] = useState({
    workspaceId: null,
    userId: null,
  });
  console.log(userFullReport);

  const getCompletedPercentage = (workspace) => {
    const completed = workspace?.columns?.find((col) =>
      ["done", "completed"].includes(col.column_name?.toLowerCase()),
    );

    return completed?.percentage ?? 0;
  };

  return (
    <div className="bg-white col-span-4 rounded-2xl p-5 shadow-sm border border-slate-200">
      {/* Header */}

      <DashboardHeading Icon={FiTrendingUp} title={"Assigned & In Progress"} />

      {/* Project List */}
      <div className="flex flex-col gap-5 max-h-40 overflow-y-auto hide-scrollbar">
        {userFullReport?.workspace_progress?.map((workspace, idx) => (
          <div key={workspace?.workspace_id} className="flex flex-col gap-2">
            {/* Top Row */}
            <div className="flex justify-between items-center">
              {/* Left */}
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <BiBarChartAlt2 className="text-slate-500" />
                <span className="text-sm first-letter:capitalize">
                  {workspace?.workspace_name}
                </span>
              </div>

              {/* Right - Avatars + % */}
              <div className="flex items-center gap-3">
                {/* User profile Icons in every projects */}
                {workspace?.members?.length > 0 && (
                  <div className="flex items-center">
                    {workspace?.members?.map((user, index) => {
                      const hasImage = !!user?.profile_url;

                      const initials = user?.user_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2);

                      return (
                        <div
                          key={user?.user_id}
                          className="relative"
                          style={{
                            marginLeft: index === 0 ? 0 : -10,
                            zIndex:
                              hovered.workspaceId === workspace.workspace_id &&
                              (hovered.userId === user.user_id) ===
                                user?.user_id
                                ? 50
                                : index,
                          }}
                          onMouseEnter={() =>
                            setHovered({
                              workspaceId: workspace.workspace_id,
                              userId: user.user_id,
                            })
                          }
                          onMouseLeave={() =>
                            setHovered({
                              workspaceId: null,
                              userId: null,
                            })
                          }
                        >
                          {/* Avatar */}
                          <div className="w-8 h-8 capitalize rounded-full border-2 border-white bg-slate-200 overflow-hidden flex items-center justify-center text-[10px] font-semibold text-slate-700 shadow-sm transition-transform duration-150 hover:scale-110 cursor-pointer">
                            {hasImage ? (
                              <img
                                src={`${VIEW_UPLOADED_FILE_URL}/${user?.profile_url}`}
                                alt={user?.user_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              initials
                            )}
                          </div>

                          {/* Tooltip (ONLY active hovered user) */}
                          {hovered.workspaceId === workspace.workspace_id &&
                            hovered.userId === user.user_id && (
                              <div className="absolute  bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded-md shadow-lg pointer-events-none">
                                <span className="first-letter:uppercase block">
                                  {user?.user_name}
                                </span>
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Percentage */}
                <span className="text-xs font-semibold text-slate-600">
                  {getCompletedPercentage(workspace)}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${getCompletedPercentage(workspace)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveProjectsSection;
