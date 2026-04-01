import React from "react";

const PageHeading = ({ Icon, heading, subHeading }) => {
  return (
    <>
      <section>
        <div className="flex items-center justify-center flex-nowrap gap-x-2">
          <div className="bg-primary rounded-xl p-2 text-white">
            <Icon size={30} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{heading}</h1>
            <div className="text-sm text-slate-600 ps-1">
              {subHeading || "By SharedNotes"}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PageHeading;
