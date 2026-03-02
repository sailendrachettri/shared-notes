import { FiTrendingUp, FiFolder } from "react-icons/fi";

const ActiveProjectsSection = () => {
  // Dummy Data
  const workspaces = [
    {
      id: 1,
      name: "Shared Notes Redesign",
      progress: 72,
      members: [
        "https://i.pravatar.cc/150?img=12",
        "https://i.pravatar.cc/150?img=32",
        "https://i.pravatar.cc/150?img=45",
      ],
    },
    {
      id: 2,
      name: "Marketing Strategy 2026",
      progress: 45,
      members: [
        "https://i.pravatar.cc/150?img=15",
        "https://i.pravatar.cc/150?img=18",
      ],
    },
    {
      id: 3,
      name: "Mobile App Planning",
      progress: 88,
      members: [
        "https://i.pravatar.cc/150?img=22",
        "https://i.pravatar.cc/150?img=28",
        "https://i.pravatar.cc/150?img=30",
        "https://i.pravatar.cc/150?img=35",
      ],
    },
  ];

  return (
    <div className="bg-white col-span-4 rounded-2xl p-5 shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-slate-100">
          <FiTrendingUp className="text-slate-600 text-lg" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">
          Assigned & In Progress
        </h2>
      </div>

      {/* Project List */}
      <div className="flex flex-col gap-5">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className="flex flex-col gap-2">
            {/* Top Row */}
            <div className="flex justify-between items-center">
              {/* Left */}
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <FiFolder className="text-slate-500" />
                <span className="text-sm">{workspace.name}</span>
              </div>

              {/* Right - Avatars + % */}
              <div className="flex items-center gap-3">
                {/* Stacked Avatars */}
                <div className="flex -space-x-2">
                  {workspace.members.slice(0, 3).map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt="member"
                      className="w-6 h-6 rounded-full border-2 border-white object-cover"
                    />
                  ))}

                  {workspace.members.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] flex items-center justify-center border-2 border-white text-slate-600">
                      +{workspace.members.length - 3}
                    </div>
                  )}
                </div>

                {/* Percentage */}
                <span className="text-xs font-semibold text-slate-600">
                  {workspace.progress}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${workspace.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveProjectsSection;