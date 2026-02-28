import React, { useState } from "react";
import ProfileImageUpload from "../../../reusable/uploads/ProfileImageUpload";

const EditUserProfileForm = ({
  initialName = "",
  initialImage = null,
  onSubmit,
  onCancel,
}) => {
  const [userName, setUserName] = useState(initialName);
  const [profileImage, setProfileImage] = useState(initialImage);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      user_name: userName.trim(),
      profile_image: profileImage || null, // File object
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full pt-7">
      {/* <h3 className="font-medium">Edit profile</h3> */}

      {/* Profile Image Upload */}
      <ProfileImageUpload
        userProfileImage={profileImage}
        setUserProfileImage={setProfileImage}
      />

      {/* Name Input */}
      <div>
        <label className="text-xs font-medium text-slate-500">Full Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm capitalize focus:outline-none focus:border-primary"
          required
          maxLength={12}
        />
      </div>

      {/* Actions */}
      {userName?.length >= 3 && (
        <div className="flex gap-2 justify-center pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </div>
      )}
    </form>
  );
};

export default EditUserProfileForm;
