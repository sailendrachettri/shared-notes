import React from "react";
import { useState } from "react";
import { axiosInstance } from "../../../api/axios";
import { ADD_WORKSPACE_URL } from "../../../api/api_routes";
import toast from "react-hot-toast";
import { getItem } from "../../../api/storage";

const CreateNewWorkSpace = ({
  setIsOpen,
  setSelectedTab,
  isUserLoggedIn,
  setRefresh,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [makeItPublic, setMakeItPublic] = useState(false);
  const [title, setTitle] = useState("");

  const handleAddWorkspace = async () => {
    setSubmitting(true);

     const user = await getItem("user");

    let user_decision;
    if (isUserLoggedIn) {
      if (makeItPublic) {
        user_decision = null;
      } else if (!makeItPublic) {
        user_decision = user?.userId;
      } else {
        toast.error("Can't create notes at the moment");
        return;
      }
    }
    try {
      const payload = {
        UserId: user_decision || null,
        WorkspaceName: title || null,
        IsPrivate: user_decision ? true : false,
      };
      const res = await axiosInstance.post(ADD_WORKSPACE_URL, payload);
      
      if (res?.data?.success == true && res?.data?.status == "CREATED") {
        toast.success("Workspace created successful");
        setIsOpen(false);
        setSelectedTab(null);
        setTitle(null);
      } else {
        toast.error("Can't add workspace at the moment");
      }
    } catch (error) {
      console.error("not able to add workspace", error);
      toast.error("Can't add workspace at the moment");
    } finally {
      setTimeout(() => {
        setSubmitting(false);
      }, 2000);
      setRefresh((prev) => !prev);
    }
  };
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
          <h3 className="text-lg font-semibold mb-4">Create New Workspace</h3>

          <form>
            {isUserLoggedIn ? (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Private by default.</span>
                  <span className="ps-1">
                    You can choose to make this workspace public.
                  </span>
                </p>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-primary"
                    onChange={(e) => setMakeItPublic(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">
                    Make this workspace public
                  </span>
                </label>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100  mb-4">
                <p className="text-sm text-slate-500 font-medium">
                  You are creating a public workspace.
                </p>
                <p className="text-xs text-slate-500 0 mt-1">
                  Anyone with access will be able to view it.
                </p>
              </div>
            )}

            <input
              type="text"
              placeholder="Enter workspace title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full capitalize border border-primary rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
              maxLength={45}
              minLength={3}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedTab(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                disabled={submitting}
                onClick={() => {
                  handleAddWorkspace();
                }}
                className={`${submitting ? "bg-slate-300 text-slate-700 cursor-not-allowed" : "bg-primary cursor-pointer text-white hover:bg-primary/90"} px-4 py-2 rounded-lg transition`}
              >
                {`${submitting ? "Creating.." : "Create"}`}
              </button>
            </div>
          </form>
        </div>

        {/* Click outside to close */}
        <div
          className="absolute inset-0 -z-10"
          onClick={() => {
            setSelectedTab(null);
            setIsOpen(false);
          }}
        />
      </div>
    </>
  );
};

export default CreateNewWorkSpace;
