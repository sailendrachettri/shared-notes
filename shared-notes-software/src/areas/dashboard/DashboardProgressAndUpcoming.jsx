import React from "react";
import { BiBarChartAlt2 } from "react-icons/bi";
import { FiFileText, FiFolder, FiTrendingUp } from "react-icons/fi";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import ActiveProjectsSection from "./ActiveProjectsSection";
import UpcomingRemindersOverview from "./UpcomingRemindersOverview";

const DashboardProgressAndUpcoming = () => {


  return (
    <div className="grid grid-cols-6 gap-6 w-full">
     <div className="col-span-4">
         <ActiveProjectsSection />
     </div>
      {/* Recent Note */}
      {/* <div className="bg-white col-span-2 rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-slate-100">
            <FiFileText className="text-slate-600 text-lg" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Recent Note</h2>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-slate-700">
            {recentNote.title}
          </p>
          <p className="text-sm text-slate-500">
            Workspace: {recentNote.workspace}
          </p>
          <p className="text-xs text-slate-400">
            Last edited {recentNote.lastEdited}
          </p>
        </div>
      </div> */}
     <div className="col-span-2">
         <UpcomingRemindersOverview />
     </div>
    </div>
  );
};

export default DashboardProgressAndUpcoming;
