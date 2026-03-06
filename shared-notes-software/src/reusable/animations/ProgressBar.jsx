import { motion } from "framer-motion";

const ProgressBar = ({
  value = 0,
  height = "h-1.5",
  bgColor = "bg-slate-200",
  fillColor = "bg-primary",
  duration = 0.8,
  className = "",
}) => {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={`w-full ${height} ${bgColor} rounded-full overflow-hidden ${className}`}
    >
      <motion.div
        className={`h-full ${fillColor} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${safeValue}%` }}
        transition={{ duration, ease: "easeOut" }}
      />
    </div>
  );
};

export default ProgressBar;