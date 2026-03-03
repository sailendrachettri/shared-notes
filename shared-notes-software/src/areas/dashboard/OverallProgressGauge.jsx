import React from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiStar, FiChevronDown } from "react-icons/fi";

const OverallProgressGauge = ({
  submissionValue = 89,
  missingCount = 3,
  grade = 8.966,
}) => {
  const progress = Math.min(Math.max(submissionValue, 0), 100);

  const size = 240;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // half circle

  const dashOffset = circumference - (progress / 100) * circumference;

  // Needle angle: -90° (left) → +90° (right)
  const needleRotation = -90 + (progress / 100) * 180;

  // Tick marks every 10%
  const ticks = [];
  for (let i = 0; i <= 20; i++) {
    const angle = 90 + i * 18; // 0% at -90°, 100% at +90°
    ticks.push(angle);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.01, boxShadow: "0 25px 35px -12px rgba(0,0,0,0.3)" }}
      className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-xl p-6  text-white"
    >
     


      {/* Gauge */}
      <div className="relative flex flex-col items-center">
        <div className="relative flex justify-center items-end ">
          <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
            {/* Background arc */}
            <path
              d={describeArc(size / 2, size / 2, radius, 180, 0)}
              fill="none"
              stroke="#374151"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Animated progress arc – now fills left→right */}
            <motion.path
              d={describeArc(size / 2, size / 2, radius, 180, 0)}
              fill="none"
              stroke="url(#orangeGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            {/* Tick marks */}
            {ticks?.map((angle, i) => {
              const start = polarToCartesian(size / 2, size / 2, radius - 6, angle);
              const end = polarToCartesian(size / 2, size / 2, radius - 18, angle);
              return (
                <line
                  key={i}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}
            <defs>
              <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
          </svg>

          {/* Needle – rotates left→right in sync with arc */}
          <motion.div
            initial={{ rotate: -90 }}
            animate={{ rotate: needleRotation }}
            transition={{ type: "spring", stiffness: 60, damping: 12 }}
            className="absolute bottom-0 flex justify-center origin-bottom"
            style={{ width: 2, height: radius - 10 }}
          >
            <div className="w-[2px] h-full bg-orange-400 rounded-full shadow-lg shadow-orange-500/50"></div>
          </motion.div>

          {/* Center pivot */}
          <div className="absolute bottom-0 w-4 h-4 bg-orange-500 rounded-full border-4 border-gray-800 shadow-lg"></div>
        </div>

        {/* Digital readout */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300"
        >
          {progress}%
        </motion.div>
        <span className="text-xs text-gray-400 tracking-wider mt-1">SUBMISSION RATE</span>
      </div>

     
    </motion.div>
  );
};

export default OverallProgressGauge;

// Helper: draw a circular arc from left (180°) to right (0°) clockwise
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle); // left (180°)
  const end = polarToCartesian(cx, cy, r, endAngle);     // right (0°)
  // Use sweep=1 to go clockwise from left to right along the bottom
  return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}