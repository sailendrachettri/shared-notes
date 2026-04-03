import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUser } from "react-icons/fa";
import PinInput from "./PinInput";
import Stepper from "./Stepper";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { axiosInstance } from "../../../api/axios";
import {
  ADD_USER_URL,
  FILE_UPLOAD_URL,
  GET_ALL_USERS_URL,
  LOGIN_USER_URL,
} from "../../../api/api_routes";

import AuthToggle from "./AuthToggle";
import { useEffect } from "react";
import { isWeakPin } from "../../../utils/encryptions/isWeakPin";
import ProfileImageUpload from "../../../reusable/uploads/ProfileImageUpload";
import { setItem } from "../../../api/storage";
import { VIEW_UPLOADED_FILE_URL } from "../../../config/env";
import { useNotificationCount } from "../../../hooks/useNotificationCount";
import { customToast } from "../../../utils/toast/toastConfig";

export default function UserOnboard({
  open,
  onClose,
  setIsUserLoggedIn,
  selectedType,
  setSelectedType,
}) {
  const [fullName, setFullName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(1); // 1 = fullName, 2 = pin, 3 = confirmPin
  const [submitting, setSubmitting] = useState(false);
  const [allUsersList, setAllUsersList] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState("");
  const { refreshNotifications } = useNotificationCount();

  const steps = ["Basic Info", "Set PIN", "Confirm PIN"];

  const handleNext = () => {
    if (step === 1 && !fullName.trim()) {
      return customToast.error("Please enter your full name");
    }

    if (step === 2 && pin?.length !== 4) {
      return customToast.error("PIN must be 4 digits");
    }

    if (step == 2 && isWeakPin(pin)) {
      customToast.error("Please use a strong PIN");
      setPin("");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleGetAllUsers = async () => {
    try {
      const res = await axiosInstance.get(GET_ALL_USERS_URL);
      setAllUsersList(res?.data || []);
    } catch (error) {
      console.error("Not able to fetch users", error);
    }
  };

  // Signup/register user
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      if (confirmPin.length !== 4)
        return customToast.error("PIN must be 4 digits");
      if (pin !== confirmPin) return customToast.error("PINs do not match");

      let fileRes;
      let uploadedUrl;
      if (userProfileImage) {
        const formData = new FormData();
        formData.append("files", userProfileImage);
        fileRes = await axiosInstance.post(FILE_UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedUrl = fileRes?.data?.files[0]?.file;
      }

      const payload = {
        UserName: fullName,
        UserPassword: pin?.toString(),
        ProfileUrl: uploadedUrl || "",
      };

      const res = await axiosInstance.post(ADD_USER_URL, payload);

      if (res?.data?.success == true && res?.data?.status == "CREATED") {
        setIsUserLoggedIn(true);
        customToast.success("User Registration Successful!");
        onClose();
        setFullName("");
        setPin("");
        setConfirmPin("");
        setStep(1);

        await setItem("user", {
          isLoggedIn: true,
          userId: res?.data?.user_id,
          user_name: res?.data?.user_name,
          created_at: res?.data?.created_at,
          updated_at: res?.data?.updated_at,
          profile_url: res?.data?.profile_url,
        });
        setIsUserLoggedIn(true);
      } else {
        customToast.error("Can't create user at the moment");
      }
    } catch (error) {
      console.error("not able to create user", error);
      customToast.error("Can't create at the moment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (pinCode) => {
    if (pinCode?.length != 4) return;

    try {
      const payload = {
        UserId: selectedUserId,
        UserPassword: pinCode,
      };
      const res = await axiosInstance.post(LOGIN_USER_URL, payload);

      if (res?.data?.success == true) {
        setIsUserLoggedIn(true);
        await setItem("user", {
          isLoggedIn: true,
          userId: res?.data?.user_id,
          user_name: res?.data?.user_name,
          created_at: res?.data?.created_at,
          updated_at: res?.data?.updated_at,
          profile_url: res?.data?.profile_url,
        });
        customToast.success("Credential verified");
        refreshNotifications();
        onClose();
      } else {
        customToast.error("Please check your credentials.");
      }
    } catch (error) {
      console.error("Please check your credentials.", error);
      customToast.error("Please check your credentials.");
    } finally {
      setPin("");
    }
  };

  useEffect(() => {
    handleGetAllUsers();
  }, [selectedUserId, submitting]);

  return (
    <AnimatePresence>
      {open && (
        <>
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
            className="fixed left-0 top-0 w-full sm:w-96 h-full bg-white z-50 p-4 flex flex-col pt-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaUser /> Profile Details
              </h2>
              <button onClick={onClose}>
                <FaTimes size={20} className="cursor-pointer" />
              </button>
            </div>

            {/* Form login/signup */}

            <section>
              {/* login and signup */}
              <AuthToggle
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />

              {selectedType == "signup" ? (
                <section className="ps-3">
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
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && fullName?.length >= 3) {
                            handleNext();
                          }
                        }}
                        placeholder="Enter Full Name"
                        maxLength={10}
                        className="w-full pl-3 pr-3 py-2 border capitalize border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary"
                      />

                      {fullName?.length >= 3 && (
                        <ProfileImageUpload
                          setUserProfileImage={setUserProfileImage}
                          userProfileImage={userProfileImage}
                        />
                      )}

                      <div className="flex justify-between mt-4">
                        <div /> {/* Empty to align next button right */}
                        {fullName?.length >= 3 && (
                          <button
                            onClick={handleNext}
                            className="bg-primary cursor-pointer text-white py-2 px-4 rounded-xl hover:bg-primary/80 transition"
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
                          disabled={pin?.length !== 4}
                          className={`py-2 px-4 rounded-xl text-white transition ${
                            pin?.length === 4
                              ? "bg-primary hover:bg-primary/80 cursor-pointer"
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

                        <button
                          disabled={submitting || confirmPin?.length !== 4}
                          onClick={handleSubmit}
                          className={`${submitting ? "bg-slate-300 text-slate-700 cursor-not-allowed" : "bg-primary cursor-pointer text-white hover:bg-primary/90"} px-4 py-2 rounded-lg transition`}
                        >
                          {`${submitting ? "Registering.." : "Confirm Registration"}`}
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              ) : (
                <section>
                  {/* List the users */}
                  <div className="p-3">
                    {allUsersList?.length > 0 ? (
                      <p className="text-xs ps-3 pb-2 uppercase text-gray-400 tracking-wider mb-3">
                        Select a Profile
                      </p>
                    ) : (
                      <div className="text-center text-gray-400">
                        <p>Don't have an account yet?</p>
                        {
                          <p
                            onClick={() => {
                              setSelectedType("signup");
                            }}
                            className="font-medium cursor-pointer hover:text-gray-500"
                          >
                            Create one
                          </p>
                        }
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-x-3 gap-y-5">
                      {allUsersList?.map((user) => {
                        const isSelected = selectedUserId === user?.user_id;

                        return (
                          <div
                            key={user?.user_id}
                            onClick={() =>
                              setSelectedUserId(
                                selectedUserId == user?.user_id
                                  ? null
                                  : user?.user_id,
                              )
                            }
                            className="flex flex-col items-center  cursor-pointer group transition-all duration-200"
                          >
                            {/* Avatar */}
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold 
                                          transition-all duration-200 overflow-hidden
                                          ${
                                            isSelected
                                              ? "bg-primary text-white scale-110 ring-1 shadow-md opacity-100"
                                              : "bg-gray-400 text-white group-hover:bg-gray-600 group-hover:scale-105 opacity-80"
                                          }`}
                            >
                              {user?.profile_url ? (
                                <img
                                  src={`${VIEW_UPLOADED_FILE_URL}/${user?.profile_url}`}
                                  alt={user?.user_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                user?.user_name?.charAt(0)?.toUpperCase() || "G"
                              )}
                            </div>

                            {/* Full Name */}
                            <p
                              className={`mt-1 text-xs text-center transition-all duration-200 capitalize
          ${
            isSelected
              ? "text-primary font-semibold"
              : "text-gray-400 hover:text-gray-600"
          }`}
                            >
                              {user?.user_name || "Guest"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedUserId && (
                    <section className="mt-12 ps-8">
                      <p className="text-xs text-start pb-2 uppercase text-gray-400 tracking-wider mb-3">
                        Enter 4-Digit PIN
                      </p>
                      <div className="flex flex-col gap-4 items-start">
                        <PinInput
                          value={pin}
                          onChange={(value) => {
                            setPin(value);

                            if (value.length === 4) {
                              handleLogin(value);
                            }
                          }}
                        />
                      </div>
                    </section>
                  )}
                </section>
              )}
            </section>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
