import DashboardHead from "./DashboardHead";
import { useState } from "react";
import { load } from "@tauri-apps/plugin-store";
import { useEffect } from "react";
import OverviewDashboard from "./OverviewDashboard";
import UpcomingRemindersOverview from "./UpcomingRemindersOverview";
import ActiveProjectsSection from "./ActiveProjectsSection";
import RecentNotesSection from "./RecentNotesSection";
import OverallProgressGauge from "./OverallProgressGauge";
import { GET_USER_DASHBOARD_REPORTS_URL } from "../../api/api_routes";
import { axiosInstance } from "../../api/axios";
import Footer from "../public/common/Footer";

const DashboardMain = () => {
  const [userData, setUserData] = useState(null);
  const [userFullReport, setUserFullReport] = useState([]);

  const handleGetUserInfo = async () => {
    try {
      const store = await load("user-store.json", { autoSave: true });
      const user = await store.get("user");
      setUserData(user);
    } catch (error) {
      console.error("not able get the user details", error);
    }
  };

  const handleGetUserFullReport = async () => {
    try {
      const url = `${GET_USER_DASHBOARD_REPORTS_URL}/${userData?.userId}`;

      const res = await axiosInstance.get(url);
      console.log(res);

      setUserFullReport(res?.data || []);
    } catch (error) {
      console.error("not able to fetch user report", error);
    }
  };

  useEffect(() => {
    handleGetUserInfo();
    handleGetUserFullReport();
  }, [userData?.userId]);

  return (
    <>
      <section className="bg-white rounded-md p-6 h-full w-full">
        <div className="flex flex-col gap-6 pb-16">
          <DashboardHead userData={userData} />
          <div className="grid grid-cols-6 gap-6 w-full">
            <div className="col-span-4">
              <UpcomingRemindersOverview userFullReport={userFullReport} />
            </div>
            <div className="col-span-2">
              <OverviewDashboard userFullReport={userFullReport} />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-6 w-full">
            <div className="col-span-4">
              <ActiveProjectsSection userFullReport={userFullReport} />
            </div>

            <div className="col-span-2 rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-center">
              <OverallProgressGauge
                progressValue={
                  userFullReport?.overall_completion_percentage || 0
                }
              />
            </div>
          </div>

          <div className="pt-16">
            <Footer />
          </div>

          {/* <RecentNotesSection /> */}
        </div>
      </section>
    </>
  );
};

export default DashboardMain;
