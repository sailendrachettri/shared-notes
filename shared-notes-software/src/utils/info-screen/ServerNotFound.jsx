import  { useEffect, useState } from "react";

const ServerNotFound = () => {
  const [countdown, setCountdown] = useState(30); // seconds

  useEffect(() => {
    // countdown interval
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 30; // reset countdown (simulate retry)
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-[#F2F3F5] text-slate-800"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div className="loader"></div>
      <p className="text-gray-400 my-6">
        Server offline. Retrying in{" "}
        <span className="font-mono text-primary">{countdown}</span> sec...
      </p>
     
    </div>
  );
};

export default ServerNotFound;
