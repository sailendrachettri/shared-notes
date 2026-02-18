import { motion } from "framer-motion";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineLockPerson } from "react-icons/md";

const iconsArray = [
  <IoPersonCircleOutline size={20} className="text-slate-200" />,
  <MdOutlineLockPerson size={20} className="text-slate-200" />,
  <MdOutlineLockPerson size={20} className="text-slate-200" />,
];

export default function Stepper({ steps, step }) {
  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative mb-6 px-4 sm:px-0">
      {/* Full background line */}
      <div
        className="absolute top-4 h-1 bg-gray-300 rounded"
        style={{ left: "1rem", right: "2rem" }}
      />

      {/* Animated progress line */}
      <motion.div
        className="absolute top-4 h-1 bg-primary rounded"
        style={{ left: "1rem" }} // start at first circle center
        initial={{ width: 0 }}
        animate={{ width: `calc(${progress}% - 2.1rem)` }} // stop at last circle center
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />

      {/* Step circles */}
      <div className="flex justify-between relative z-10">
        {steps.map((s, idx) => {
          const isActive = step === idx + 1;
          const isCompleted = idx + 1 < step;

          return (
            <div key={idx} className="flex flex-col items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}
                animate={{
                  backgroundColor: isActive
                    ? "#d25564" // bg-primary
                    : isCompleted
                      ? "#d25564" // bg-green-500
                      : "#d1d5db", // bg-gray-300
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {iconsArray[idx]}
              </motion.div>
              <span className="text-xs text-center mt-1">{s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
