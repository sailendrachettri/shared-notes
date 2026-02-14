import emptyScreenSvg from '../../assets/svgs/empty_screen.svg';
import { FaStickyNote, FaUsers, FaSave, FaTasks } from 'react-icons/fa';

const InfoScreen = () => {
  const features = [
    { icon: <FaStickyNote className="text-blue-500 w-6 h-6" />, title: "Notes" },
    { icon: <FaUsers className="text-green-500 w-6 h-6" />, title: "Collaborate" },
    { icon: <FaSave className="text-purple-500 w-6 h-6" />, title: "Auto Save" },
    { icon: <FaTasks className="text-yellow-500 w-6 h-6" />, title: "Tasks" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[93vh] text-center px-4 py-12 bg-gray-50">
      {/* SVG Illustration */}
      <img
        src={emptyScreenSvg}
        alt="Empty"
        className="w-64 h-64 md:w-80 md:h-80 mb-8 animate-fadeIn opacity-60"
      />

      {/* Main Heading */}
      <h1 className="text-lg font-bold text-gray-600 mb-4">
        Shared Notes
      </h1>

      {/* Short Keywords */}
      <p className="text-gray-500 text-sm mb-6">
        Quick • Simple • Collaborative • Organized
      </p>

      
    </div>
  );
};

export default InfoScreen;
