import React, { useState, useEffect } from "react";
import { HiOutlineUserAdd, HiOutlineX, HiOutlineSearch } from "react-icons/hi";
import {
  GET_ALL_USERS_URL,
  INVITE_USER_IN_PRIVATE_NOTE_URL,
} from "../../../api/api_routes";
import { axiosInstance } from "../../../api/axios";

import { getItem } from "../../../api/storage";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { VIEW_UPLOADED_FILE_URL } from "../../../config/env";
import { CapitalizedFirstChar } from "../../../utils/string-formate/CapitalizedFirstChar";
import { customToast } from "../../../utils/toast/toastConfig";

const MAX_VISIBLE = 3;

const InviteUserToPrivateNotes = ({
  selectedNoteId,
  selectedNoteType,
  selectedNoteCollaboratorsDetails,
  userNoteOwnsOrCollaborative,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [allUsersList, setAllUsersList] = useState([]);

  const handleInvitePeople = async (invitedUser) => {
    try {
      const user = await getItem("user");

      if (invitedUser?.user_id == user?.userId) {
        customToast.error("You are already the owner of this note");
        return;
      }

      if (!invitedUser?.user_id || !user?.userId) {
        customToast.error("User is invalid");
      }

      const payload = {
        UserId: invitedUser?.user_id,
        NoteId: selectedNoteId,
        InvitedBy: user?.userId,
      };
      const res = await axiosInstance.post(
        INVITE_USER_IN_PRIVATE_NOTE_URL,
        payload,
      );
  
      if (res?.data?.success == true && res?.data?.status == "CREATED") {
        customToast.success("Invitation sent successfully");
      } else if (
        res?.data?.success == false &&
        res?.data?.status == "ALREADY_EXISTS"
      ) {
        customToast.error(res?.data?.message || "Something went wrong");
      } else {
        customToast.error("Not able to send invitation");
      }
    } catch (error) {
      console.error("not able to send invitation", error);
      customToast.error("Not able to send invitation");
    }
  };

  const handleGetAllUsers = async () => {
    try {
      const res = await axiosInstance.get(GET_ALL_USERS_URL);
      setAllUsersList(res?.data || []);
    } catch (error) {
      console.error("Not able to fetch users", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  const visibleUsers = selectedNoteCollaboratorsDetails?.slice(0, MAX_VISIBLE);
  const remainingCount = selectedNoteCollaboratorsDetails?.length - MAX_VISIBLE;

  return (
    <div className="flex items-center gap-3">
      {/* Owns or colloborative */}
      <div className="text-[11px] bg-primary/10 text-primary font-semibold px-3 rounded-full py-1">
        {userNoteOwnsOrCollaborative === "owner" && "Owner"}
        {userNoteOwnsOrCollaborative === "collaborator" && "Collab"}
      </div>
      {/* Invited Users */}
      <div className="flex -space-x-2">
        {visibleUsers?.map((user) => (
          <div key={user?.user_id} className="relative group">
            {user?.profile_url ? (
              <img
                src={`${VIEW_UPLOADED_FILE_URL}/${user?.profile_url}`}
                className="w-9 h-9 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white text-sm font-semibold border-2 border-white">
                {getInitials(user?.user_name)}
              </div>
            )}

            {/* Tooltip */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
              {CapitalizedFirstChar(user?.user_name)}
            </div>
          </div>
        ))}

        {remainingCount > 0 && (
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-sm font-semibold border-2 border-white">
            +{remainingCount}
          </div>
        )}
      </div>

      {/* Invite Button */}
      {selectedNoteType == "mst-note" && userNoteOwnsOrCollaborative === "owner" && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 cursor-pointer px-3 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90 transition"
        >
          <MdOutlinePeopleAlt size={18} />
          Invite
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-105 rounded-xl shadow-xl p-5">
            {/* Header */}
            <div className={`flex justify-between items-center mb-4`}>
              <h2 className="text-lg font-semibold">Invite Collaborators</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <HiOutlineX size={22} />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <HiOutlineSearch
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Users List */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {allUsersList.length > 0 ? (
                allUsersList
                  .filter((u) =>
                    u.user_name?.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((user) => (
                    <div
                      key={user?.user_id}
                      className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        {user?.profile_url ? (
                          <img
                            src={`/uploads/${user?.profile_url}`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-sm font-semibold">
                            {getInitials(user?.user_name)}
                          </div>
                        )}

                        <span className="text-sm capitalize">
                          {user?.user_name}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          handleInvitePeople(user);
                        }}
                        className="text-sm px-3 py-1 bg-primary cursor-pointer text-white rounded-md hover:opacity-90"
                      >
                        Invite
                      </button>
                    </div>
                  ))
              ) : (
                <div className="text-center text-sm text-gray-500">
                  No users found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteUserToPrivateNotes;
