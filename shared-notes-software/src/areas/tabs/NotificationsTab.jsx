import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axios";
import {
  INVITE_USER_NOTE_ACCEPT_REJECT_URL,
  INVITE_USER_NOTE_INVITE_NOTIFICATIONS_URL,
} from "../../api/api_routes";
import toast from "react-hot-toast";
import { HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import { formatePrettyDateTime } from "../../utils/date-time/formatePrettyDateTime";
import { VIEW_UPLOADED_FILE_URL } from "../../config/env";
import { CapitalizedFirstChar } from "../../utils/string-formate/CapitalizedFirstChar";
import { GetNameInitials } from "../../utils/string-formate/GetNameInitials";
import GenericConfirmModal from "../../reusable/GenericConfirmModal";
import LoginRequired from "../../utils/info-screen/LoginRequired";

const NotificationsTab = ({ userData, setRefresh, refresh, setOpenRegistrationWindow }) => {
  const [notesInviteDetails, setNotesInviteDetails] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [inviteActionType, setInviteActionType] = useState(null);
  const [selectedInvitationNoteId, setSelectedInvitationNoteId] =
    useState(null);
  const [isGenericConfirmModalOpen, setIsGenericConfirmModalOpen] =
    useState(false);
  const [selectedInviteNoteUserId, setSelectedInviteNoteUserId] =
    useState(null);

  const handleAcceptOrRejectNoteInvitation = async () => {
    try {
      if (!userData?.userId) {
        toast.error("Please login and try again");
        return;
      }

      if (!inviteActionType) {
        toast.error("Please select action");
        return;
      }

      if (!selectedInvitationNoteId) {
        toast.error("Invalid Note Id");
        return;
      }

      const payload = {
        UserId: selectedInviteNoteUserId,
        NoteId: selectedInvitationNoteId,
        InviteStatus: inviteActionType,
      };
      const res = await axiosInstance.post(
        INVITE_USER_NOTE_ACCEPT_REJECT_URL,
        payload,
      );
      console.log(res);
      if (res?.data?.success == true && res?.data?.status == "UPDATED") {
        toast.success(`Invitation ${inviteActionType}`);
      } else {
        toast.error(`Not able to ${inviteActionType} note`);
      }
    } catch (error) {
      toast.error(`Not able to ${inviteActionType} note`);
      console.error(`Not able to ${inviteActionType} note`, error);
    } finally {
      setRefresh((prev) => !prev);
    }
  };

  const handleGetNoteInviteNotifications = async () => {
    if (!userData?.userId) {
      console.info("Please login and try again");
      return;
    }

    try {
      const payload = {
        UserId: userData?.userId,
      };

      const res = await axiosInstance.post(
        INVITE_USER_NOTE_INVITE_NOTIFICATIONS_URL,
        payload,
      );

      if (res?.status === 200) {
        setNotificationCount(res?.data?.length || 0);
        setNotesInviteDetails(res?.data || []);
      }
    } catch (error) {
      console.error("not able to fetch notification for note", error);
    }
  };

  useEffect(() => {
    handleGetNoteInviteNotifications();
  }, [refresh]);

  if (!userData?.userId) {
    return (
      <LoginRequired
        description="You must sign in to view this page."
        onLoginClick={() => {
          setOpenRegistrationWindow(true);
        }}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>

        {notificationCount > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-primary text-white text-xs font-semibold">
            {notificationCount}
          </span>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {notesInviteDetails?.length > 0 ? (
          notesInviteDetails.map((item) => (
            <div
              key={item?.notes_Access_Id}
              className="flex items-start justify-between p-4 rounded-lg border border-slate-200 bg-white hover:bg-gray-50 transition"
            >
              {/* Left Content */}
              <div className="flex items-start gap-3">
                {/* Avatar */}
                {item?.profile_Url ? (
                  <img
                    src={`${VIEW_UPLOADED_FILE_URL}/${item?.profile_Url}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-semibold">
                    {GetNameInitials(item?.invited_By_Name)}
                  </div>
                )}

                {/* Message */}
                <div>
                  <p className="text-sm">
                    <span className="font-semibold capitalize">
                      {item?.invited_By_Name}
                    </span>{" "}
                    invited you to collaborate on
                    <span className="font-medium text-primary ml-1">
                      {CapitalizedFirstChar(item?.note_Title)}
                    </span>
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {formatePrettyDateTime(item?.created_At)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedInvitationNoteId(item?.note_Id);
                    setSelectedInviteNoteUserId(item?.user_Id);
                    setInviteActionType("accepted");
                    setIsGenericConfirmModalOpen(true);
                  }}
                  className="flex items-center cursor-pointer gap-1 text-xs px-3 py-1 rounded-md bg-primary text-white hover:opacity-90"
                >
                  <HiOutlineCheck size={14} />
                  Accept
                </button>

                <button
                  onClick={() => {
                    setSelectedInvitationNoteId(item?.note_Id);
                    setSelectedInviteNoteUserId(item?.user_Id);
                    setInviteActionType("rejected");
                    setIsGenericConfirmModalOpen(true);
                  }}
                  className="flex items-center cursor-pointer gap-1 text-xs px-3 py-1 rounded-md border border-slate-200 hover:bg-gray-100"
                >
                  <HiOutlineX size={14} />
                  Decline
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10 text-sm">
            No notifications
          </div>
        )}
      </div>

      <GenericConfirmModal
        isOpen={isGenericConfirmModalOpen}
        onClose={() => setIsGenericConfirmModalOpen(false)}
        onConfirm={() => handleAcceptOrRejectNoteInvitation()}
        title={`${inviteActionType === "accepted" ? "Accept" : "Reject"} Note Invitation`}
        description={
          inviteActionType === "accepted"
            ? "You will be able to collaborate on this note."
            : "You will NOT able to collaborate on this note."
        }
      />
    </div>
  );
};

export default NotificationsTab;
