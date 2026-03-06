import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

const OverallProgressGauge = ({ progressValue = 0 }) => {
  const progress = Math.min(Math.max(progressValue, 0), 100);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, progress, {
      duration: 2.2,
      ease: "easeOut",
    });

    return controls.stop;
  }, [progress]);

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
      className="h-fit"
    >
      {/* Gauge */}
      <div className="relative flex flex-col items-center">
        <div className="relative flex justify-center items-end ">
          <svg
            width={size}
            height={size / 2}
            viewBox={`0 0 ${size} ${size / 2}`}
          >
            {/* Background arc */}
            <path
              d={describeArc(size / 2, size / 2, radius, 180, 0)}
              fill="none"
              stroke="#e2e8f0"
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
              transition={{ duration: 2.2, ease: "easeOut" }}
            />
            {/* Tick marks */}
            {ticks?.map((angle, i) => {
              const start = polarToCartesian(
                size / 2,
                size / 2,
                radius - 6,
                angle,
              );
              const end = polarToCartesian(
                size / 2,
                size / 2,
                radius - 18,
                angle,
              );
              return (
                <line
                  key={i}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              );
            })}
            <defs>
              <linearGradient
                id="orangeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#d25564" />
                <stop offset="100%" stopColor="#d25564" />
              </linearGradient>
            </defs>
          </svg>

          {/* Needle – rotates left→right in sync with arc */}
          <motion.div
            initial={{ rotate: -90 }}
            animate={{ rotate: needleRotation }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute bottom-0 flex justify-center origin-bottom"
            style={{ width: 2, height: radius - 10 }}
          >
            <div className={`${progress > 0 ? 'bg-primary': 'bg-slate-200'} w-0.5 h-full rounded-full shadow-lg shadow-primary/50`}></div>
          </motion.div>

          {/* Center pivot */}
          <div className={`${progress > 0 ? 'bg-primary border-slate-800': 'bg-slate-200 border-slate-400'} absolute bottom-0 w-4 h-4  rounded-full border-4  shadow-lg`}></div>
        </div>

        {/* Digital readout */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`${progress > 0 ? 'text-primary': 'text-slate-200'} mt-2 text-4xl font-bold font-mono  bg-clip-text`}
        >
         <motion.span>{rounded}</motion.span>%
        </motion.div>
        <span className="text-xs text-gray-400 tracking-wider mt-1 uppercase">
          OVERALL TASK PROGRESS
        </span>
      </div>
    </motion.div>
  );
};

export default OverallProgressGauge;

// Helper: draw a circular arc from left (180°) to right (0°) clockwise
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle); // left (180°)
  const end = polarToCartesian(cx, cy, r, endAngle); // right (0°)
  // Use sweep=1 to go clockwise from left to right along the bottom
  return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}
