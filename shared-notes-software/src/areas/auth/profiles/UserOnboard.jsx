import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUser } from "react-icons/fa";
import PinInput from "./PinInput";
import Stepper from "./Stepper";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { axiosInstance } from "../../../api/axios";
import { ADD_USER_URL, LOGIN_USER_URL } from "../../../api/api_routes";
import toast from "react-hot-toast";
import { load } from "@tauri-apps/plugin-store";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import AuthToggle from "./AuthToggle";

export default function UserOnboard({ open, onClose, setIsUserLoggedIn }) {
  const [fullName, setFullName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(1); // 1 = fullName, 2 = pin, 3 = confirmPin
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState("signup");

  const steps = ["Full Name", "Set PIN", "Confirm PIN"];

  const handleNext = () => {
    if (step === 1 && !fullName.trim())
      return alert("Please enter your full name");
    if (step === 2 && pin.length !== 4) return alert("PIN must be 4 digits");
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  // Signup/register user
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      if (confirmPin.length !== 4) return toast.error("PIN must be 4 digits");
      if (pin !== confirmPin) return toast.error("PINs do not match");

      const payload = { UserName: fullName, UserPassword: pin.toString() };

      const res = await axiosInstance.post(ADD_USER_URL, payload);
      console.log(res);

      if (res?.data?.success == true && res?.data?.status == "CREATED") {
        setIsUserLoggedIn(true);
        toast.success("User Registration Successful!");
        onClose();
        setFullName("");
        setPin("");
        setConfirmPin("");
        setStep(1);
        const store = await load("user-store.json", { autoSave: true });
        await store.set("user", {
          isLoggedIn: true,
          userId: res?.data?.user_id,
          user_name: res?.data?.user_name,
        });
      } else {
        toast.error("Can't create user at the moment");
      }

      console.log("Final Payload:", payload);
    } catch (error) {
      console.error("not able to create user", error);
      toast.error("Can't create at the moment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async () => {
    try {
      const payload = {
        UserPassword: pin,
      };
      const res = await axiosInstance.post(LOGIN_USER_URL, payload);
      
      if (res?.data?.success == true) {
        setIsUserLoggedIn(true);
        const store = await load("user-store.json", { autoSave: true });
        await store.set("user", {
          isLoggedIn: true,
          userId: res?.data?.user_id,
          user_name: res?.data?.user_name,
        });
        toast.success("Credential verified");
        onClose();
        setPin("");
      } else {
        toast.error("Please check your credentials.");
      }
    } catch (error) {
      console.error("Please check your credentials.", error);
      toast.error("Please check your credentials.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer from left */}
          <motion.div
            initial={{ x: "-100%" }} // start completely off-screen to the left
            animate={{ x: 0 }} // slide into place
            exit={{ x: "-100%" }} // slide back out when closing
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 w-full sm:w-96 h-full bg-white z-50 p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaUser /> Profile Details
              </h2>
              <button onClick={onClose}>
                <FaTimes size={20} />
              </button>
            </div>

            {/* login and signup */}
            <AuthToggle
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />

            {selectedType == "signup" ? (
              <section>
                {/* Steps Indicator */}
                <div className="relative mb-6">
                  {/* Step circles */}
                  <div className="px-8">
                    <Stepper step={step} steps={steps} />
                  </div>
                </div>

                {/* Step Content */}
                {step === 1 && (
                  <div className="flex flex-col gap-4">
                    <label className="font-semibold">
                      What should we call you?
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter Full Name"
                      maxLength={25}
                      className="w-full pl-3 pr-3 py-2 border capitalize border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex justify-between mt-4">
                      <div /> {/* Empty to align next button right */}
                      {fullName?.length >= 3 && (
                        <button
                          onClick={handleNext}
                          className="bg-primary text-white py-2 px-4 rounded-xl hover:bg-primary/80 transition"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-4">
                    <label className="font-semibold">Set 4-Digit PIN</label>
                    <PinInput value={pin} onChange={setPin} />
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={handleBack}
                        className=" text-slate-600 py-2 px-4 border border-slate-200 cursor-pointer hover:bg-slate-50 rounded-xl  flex items-center gap-1"
                      >
                        <IoChevronBackCircleOutline size={18} /> Back
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={pin.length !== 4}
                        className={`py-2 px-4 rounded-xl text-white transition ${
                          pin.length === 4
                            ? "bg-primary hover:bg-primary/80"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col gap-4">
                    <label className="font-semibold">Confirm PIN</label>
                    <PinInput value={confirmPin} onChange={setConfirmPin} />
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={handleBack}
                        className=" text-slate-600 py-2 px-4 border border-slate-200 cursor-pointer hover:bg-slate-50 rounded-xl  flex items-center gap-1"
                      >
                        <IoChevronBackCircleOutline size={18} /> Back
                      </button>
                      {/* <button
                    onClick={handleSubmit}
                    disabled={confirmPin.length !== 4}
                    className={`py-2 px-4 rounded-xl text-white transition ${
                      confirmPin.length === 4
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Confirm Registration
                  </button> */}

                      <button
                        disabled={submitting || confirmPin?.length !== 4}
                        onClick={handleSubmit}
                        className={`${submitting ? "bg-slate-300 text-slate-700 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"} px-4 py-2 rounded-lg transition`}
                      >
                        {`${submitting ? "Registering.." : "Confirm Registration"}`}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            ) : (
              <section>
                <div className="flex flex-col gap-4 items-center">
                  <label className="font-semibold">Enter 4-Digit PIN</label>
                  <PinInput value={pin} onChange={setPin} />
                  <div className="flex justify-center mt-4">
                    {pin?.length === 4 && (
                      <button
                        onClick={handleLogin}
                        disabled={pin?.length !== 4}
                        className={`py-2 px-10 rounded-xl text-white transition ${
                          pin.length === 4
                            ? "bg-primary hover:bg-primary/80"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
              </section>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
