const OverviewDashboard = ({ userFullReport }) => {
  const counts = userFullReport?.dashboard_counts;

  const dashboardCards = [
    // { label: "Total Workspaces", value: counts?.total_workspaces ?? 0 },
    // { label: "Total Assigned Tasks", value: counts?.total_assigned_tasks ?? 0 },
    // { label: "Public Notes", value: counts?.total_public_notes ?? 0 },
    { label: "Pending Tasks", value: counts?.total_pending_tasks ?? 0 },
    { label: "In Progress Tasks", value: counts?.total_inprogress_tasks ?? 0 },
    { label: "Active Workspaces", value: counts?.total_active_projects ?? 0 },
    // { label: "Private Notes", value: counts?.total_private_notes ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 w-full">
      {dashboardCards?.map((item, idx) => (
        <div
          key={idx}
          className="group w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between w-full ">
            {/* Left Content */}
            <div className="flex flex-col">
              <span className="text-sm text-slate-500 font-medium">
                {item?.label}
              </span>
              <span className="text-2xl font-semibold text-slate-800 mt-1">
                {item?.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewDashboard;
