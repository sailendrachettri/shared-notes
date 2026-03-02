import DashboardHead from "./DashboardHead";
import { useState } from "react";
import { load } from "@tauri-apps/plugin-store";
import { useEffect } from "react";
import OverviewDashboard from "./OverviewDashboard";
import UpcomingRemindersOverview from "./UpcomingRemindersOverview";
import ActiveProjectsSection from "./ActiveProjectsSection";

const DashboardMain = () => {
  const [userData, setUserData] = useState(null);

  const handleGetUserInfo = async () => {
    try {
      const store = await load("user-store.json", { autoSave: true });
      const user = await store.get("user");
      setUserData(user);
    } catch (error) {
      console.error("not able get the user details", error);
    }
  };

  useEffect(() => {
    handleGetUserInfo();
  }, []);

  return (
    <>
      <section className="bg-white rounded-md p-6 h-full w-full">
        <div className="flex flex-col gap-6">
          <DashboardHead userData={userData} />

          <OverviewDashboard />

          <div className="grid grid-cols-6 gap-6 w-full">
            <div className="col-span-4">
              <ActiveProjectsSection />
            </div>

            <div className="col-span-2">
              <UpcomingRemindersOverview />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardMain;
