import { PiCopyright } from "react-icons/pi";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <section >
        <footer className="w-full flex items-center justify-center text-sm text-gray-400">
          {/* Left Side */}
          <p className="flex items-center justify-center gap-x-2"><span><PiCopyright size={16} /></span> {currentYear} SharedNotes. All rights reserved.</p>
        </footer>
      </section>
    </>
  );
};

export default Footer;
