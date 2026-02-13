import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
      
      {/* Left Side */}
      <p>
        © {currentYear} SharedNotes. All rights reserved.
      </p>

      {/* Right Side */}
      <div className="flex gap-6 mt-2 md:mt-0">
        
        <a
          href="#"
          className="hover:text-primary transition-colors duration-200"
        >
          Github
        </a>
        
      </div>

    </footer>
  );
};

export default Footer;
