import React, { useEffect, useRef, useState } from "react";
import { load } from "@tauri-apps/plugin-store";
import toast from "react-hot-toast";
import { IoPowerSharp } from "react-icons/io5";
import { FiEdit2, FiCheck } from "react-icons/fi";
import EditUserProfileForm from "./EditUserProfileForm";
import { VIEW_UPLOADED_FILE_URL } from "../../../api/api_routes";
import { formatePrettyDateTime } from "../../../utils/date-time/formatePrettyDateTime";
import { AnimatePresence, motion } from "framer-motion";
import { FaUser } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

const LoggedInUserInfoMenu = ({
  setIsUserLoggedIn,
  setShowDetailsMenu,
  showDetailsMenu,
}) => {
  const [store, setStore] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const loadUser = async () => {
      const storeInstance = await load("user-store.json", { autoSave: true });
      const userDetails = await storeInstance.get("user");
      setStore(storeInstance);
      setUser(userDetails);
      console.log(userDetails);
    };

    loadUser();
  }, [isEditing]);

  if (!user) return null;

  const initials = user?.user_name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleLogoutUser = async () => {
    await store.delete("user");
    setIsUserLoggedIn(false);
    setShowDetailsMenu(false);
    toast.success("Logged out successfully!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toast.error("Image must be less than 500KB");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  return (
    <>
      <AnimatePresence>
        {showDetailsMenu && (
          <section>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailsMenu(false);
              }}
              className="fixed inset-0 bg-black z-40"
            />

            <motion.div
              initial={{ x: "-100%" }} // start completely off-screen to the left
              animate={{ x: 0 }} // slide into place
              exit={{ x: "-100%" }} // slide back out when closing
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 w-full sm:w-96 h-full bg-white z-50 p-4 flex flex-col px-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaUser /> Profile Details
                </h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetailsMenu(false);
                  }}
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div>
                {/* Avatar */}

                {isEditing ? (
                  <EditUserProfileForm
                    initialName={user?.user_name}
                    initialImage={null}
                    setIsEditing={setIsEditing}
                  />
                ) : (
                  <section>
                    <div className="flex flex-col items-center gap-3">
                      <div
                        onClick={() => isEditing && fileRef.current.click()}
                        className="relative w-20 h-20 rounded-full overflow-hidden  bg-slate-200 flex items-center justify-center text-xl font-semibold text-slate-700"
                      >
                        {previewImage || user?.profile_url ? (
                          <img
                            src={
                              previewImage ||
                              `${VIEW_UPLOADED_FILE_URL}/${user?.profile_url}`
                            }
                            alt="profile"
                            className="w-full h-full object-cover border-slate-200"
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileRef}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      {/* Name */}
                      {isEditing ? (
                        <input
                          value={user?.user_name}
                          onChange={(e) =>
                            setUser({ ...user, user_name: e.target.value })
                          }
                          className="border rounded-lg px-3 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <h3 className="font-semibold text-slate-800 capitalize">
                          {user?.user_name}
                        </h3>
                      )}

                      <p className="text-xs text-slate-400">
                        <span className="capitalize">Since </span>{" "}
                        {user?.created_at &&
                          formatePrettyDateTime(user?.created_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-col gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 transition"
                      >
                        <FiEdit2 /> Edit Profile
                      </button>

                      <button
                        onClick={handleLogoutUser}
                        className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <IoPowerSharp /> Log Out
                      </button>
                    </div>
                  </section>
                )}
              </div>
            </motion.div>
          </section>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoggedInUserInfoMenu;
