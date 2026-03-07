import { useState } from "react";
import ProfileImageUpload from "../../../reusable/uploads/ProfileImageUpload";
import { axiosInstance } from "../../../api/axios";
import {
  FILE_UPLOAD_URL,
  UPDATE_USER_PROFILE_URL,
} from "../../../api/api_routes";
import toast from "react-hot-toast";
import { getItem } from "../../../api/storage";

const EditUserProfileForm = ({
  initialName = "",
  initialImage = null,
  setIsEditing,
}) => {
  const [userName, setUserName] = useState(initialName);
  const [profileImage, setProfileImage] = useState(initialImage);

  const handleSubmit = async (e) => {
    e.preventDefault();

   const user = await getItem("user");
  

    if (!user?.userId) {
      toast.error("Unauthorized, Please login and try again.");
      return;
    }

    try {
      let fileRes;

      if (profileImage) {
        const formData = new FormData();
        formData.append("files", profileImage);
        fileRes = await axiosInstance.post(FILE_UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const uploadedUrl = fileRes?.data[0];

      const payload = {
        UserProfileUrl: uploadedUrl || null,
        UserId: user?.userId,
        UserName: userName.trim() || null,
      };

      const res = await axiosInstance.post(UPDATE_USER_PROFILE_URL, payload);
      if (res?.status == 200) {

        await store.set("user", {
          isLoggedIn: true,
          userId: res?.data?.user_id,
          user_name: res?.data?.user_name,
          created_at: res?.data?.created_at,
          updated_at: res?.data?.updated_at,
          profile_url: res?.data?.profile_url,
        });
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Can't update the profile at the moment");
      console.error("Can't update the profile at the moment", error);
    }
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
          maxLength={10}
        />
      </div>

      {/* Actions */}
      {userName?.length >= 3 && (
        <div className="flex gap-2 justify-center pt-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:opacity-90 transition cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      )}
    </form>
  );
};

export default EditUserProfileForm;
