import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedCount = ({
  value = 0,
  duration = 1.2,
  className = "",
  loading = false,
}) => {
  const nodeRef = useRef();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (loading) return;

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplayValue(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [value, duration, loading]);

  if (loading) {
    return (
      <div className="h-8 w-16 rounded-md bg-slate-200 animate-pulse"></div>
    );
  }

  return (
    <motion.span
      ref={nodeRef}
      className={`font-semibold tabular-nums ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {displayValue}
    </motion.span>
  );
};

export default AnimatedCount;
