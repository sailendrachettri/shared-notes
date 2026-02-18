import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUser, FaLock } from "react-icons/fa";

export default function UserOnboard({ open, onClose }) {
  const [nickname, setNickname] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleSubmit = () => {
    if (pin.length !== 6) return alert("PIN must be 6 digits");
    if (pin !== confirmPin) return alert("PINs do not match");
    alert("Registered Successfully");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed left-0 top-0 h-full w-[380px] bg-white shadow-2xl z-50 p-8 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Create Profile</h2>
              <button onClick={onClose}>
                <FaTimes className="w-5 h-5 text-gray-500 hover:text-black" />
              </button>
            </div>

            {/* Nickname */}
            <div className="mb-6">
              <label className="text-sm text-gray-600 mb-2 block">
                Nickname
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  maxLength={12}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter nickname"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 focus:border-white rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* PIN */}
            <div className="mb-6">
              <label className="text-sm text-gray-600 mb-2 block">
                Set 6-Digit PIN
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 focus:border-white rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Confirm PIN */}
            <div className="mb-10">
              <label className="text-sm text-gray-600 mb-2 block">
                Confirm PIN
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) =>
                    setConfirmPin(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 focus:border-white rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Action */}
            <button
              onClick={handleSubmit}
              className="mt-auto rounded-2xl py-5 text-base"
            >
              Confirm Registration
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
