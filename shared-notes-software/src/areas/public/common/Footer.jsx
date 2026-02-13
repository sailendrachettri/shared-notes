import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex items-center justify-center text-sm text-gray-400">
      
      {/* Left Side */}
      <p>
        © {currentYear} SharedNotes. All rights reserved.
      </p>

    

    </footer>
  );
};

export default Footer;
