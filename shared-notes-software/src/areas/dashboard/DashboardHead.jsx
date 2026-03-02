import { getGreeting } from "../../utils/greets/greetingHelper";

const DashboardHead = ({ userData }) => {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        {/* Greeting */}
        <h1 className="text-xl lg:text-3xl font-semibold tracking-tight text-slate-800">
          {getGreeting()},
          <span className="ml-2 text-primary bg-clip-text">
            {userData?.user_name || "Guest"}
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-sm lg:text-base text-slate-500">
          Access your personalized dashboard
        </p>
      </div>
    </>
  );
};

export default DashboardHead;
