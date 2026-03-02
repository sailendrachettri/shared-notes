import DashboardHead from "./DashboardHead";
import { useState } from "react";
import { load } from "@tauri-apps/plugin-store";
import { useEffect } from "react";
import DashboardProgressAndUpcoming from "./DashboardProgressAndUpcoming";
import OverviewDashboard from "./OverviewDashboard";
import UpcomingRemindersOverview from "./UpcomingRemindersOverview";

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

          <DashboardProgressAndUpcoming />
        </div>
      </section>
    </>
  );
};

export default DashboardMain;
