import React, { useRef, useState, useEffect } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { customToast } from "../../utils/toast/toastConfig";


const MAX_SIZE = 500 * 1024; // 500 KB

const ProfileImageUpload = ({ setUserProfileImage, userProfileImage }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!userProfileImage) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(userProfileImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [userProfileImage]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ File type validation
    const validTypes = ["image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      customToast.error("Only PNG & JPEG allowed");
      return;
    }

    // ✅ File size validation
    if (file.size > MAX_SIZE) {
      customToast.error("Image must be less than 500 KB");
      return;
    }

    setUserProfileImage(file);
    customToast.success("Profile image selected");
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setUserProfileImage(null);
    fileRef.current.value = "";
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        className="hidden"
      />

      <div
        onClick={() => fileRef.current.click()}
        className="relative flex flex-col items-center justify-center gap-3 w-full p-6 border-2 border-dashed border-primary/50 rounded-xl cursor-pointer hover:border-primary/90 hover:bg-primary/5 transition-all duration-200"
      >
        {/* ✅ If Preview Exists */}
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Profile Preview"
              className="w-28 h-28 object-cover rounded-full border border-slate-200"
            />

            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-white shadow-md rounded-full p-1 hover:bg-red-50"
            >
              <FiX className="text-red-500 text-sm" />
            </button>
          </div>
        ) : (
          <>
            <FiUploadCloud className="text-3xl text-slate-500" />

            <p className="text-sm font-medium text-slate-700">
              Click to upload profile image
            </p>

            <p className="text-xs text-slate-500">
              PNG, JPEG • Max 500 KB
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;