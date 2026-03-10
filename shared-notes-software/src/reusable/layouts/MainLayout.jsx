import React from "react";

const MainLayout = ({ sidebar, content }) => {
  return (
    <section className="h-full flex gap-3 bg-slate-100 font-sans text-slate-800">

      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-md flex flex-col overflow-hidden mb-10">
        {sidebar}
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col bg-white rounded-md overflow-hidden mb-10 pb-2">
        {content}
      </main>

    </section>
  );
};

export default MainLayout;