import React from "react";
import Sidebar from "./components/Sidebar";
import Playground from "./components/Playground";
import Footer from "./common/Footer";
import CreaterNewNotesForm from "./components/CreaterNewNotesForm";

const Home = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Main Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200 hidden md:block">
        <CreaterNewNotesForm />
          <Sidebar />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <Playground />
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 bg-white border-t border-gray-200">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
