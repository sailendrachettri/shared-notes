import React from "react";

const DashboardHeading = ({ Icon, title }) => {
  return (
    <>
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-slate-100">
            <Icon className="text-slate-600 text-sm" />
          </div>
          <h2 className="text-sm font-semibold text-slate-800">
            {title || ""}
          </h2>
        </div>
      </section>
    </>
  );
};

export default DashboardHeading;
