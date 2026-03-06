import { useState } from "react";
import {
  FiBell,
  FiCalendar,
  FiSun,
  FiSearch,
  FiUsers,
  FiUser,
  FiLayers,
  FiFolder,
  FiBriefcase,
} from "react-icons/fi";
import { BiBell, BiSolidCommentAdd } from "react-icons/bi";
import AddEventForm from "./AddEventForm";
import EventCard from "./EventCard";
import { useEffect } from "react";
import { DELETE_EVENT_URL, GET_EVENTS_URL } from "../../api/api_routes";
import { axiosInstance } from "../../api/axios";
import { MdOutlineTaskAlt } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import DeleteConfirmModal from "../../reusable/DeleteConfirmModal";
import toast from "react-hot-toast";
import WorkspaceModeBadge from "../auth/workspaces/WorkspaceModeBadge";
import NoResultFound from "../../utils/info-screen/NoResultFound";

/* ---------- Constants ---------- */

const CATEGORIES = [
  { id: 9999, label: "All Events", icon: FiBell },
  { id: 1, label: "Holidays", icon: FiSun },
  { id: 2, label: "Meetings", icon: FiUsers },
  { id: 3, label: "Work", icon: FiBriefcase },
  { id: 4, label: "Tasks", icon: MdOutlineTaskAlt },
  { id: 5, label: "Projects", icon: FiFolder },
  { id: 6, label: "Events", icon: FiCalendar },
  { id: 7, label: "Personal", icon: FiUser },
  { id: 8, label: "General", icon: FiLayers },
];

/* ===================================================== */

export default function RemindersApp({ userData, setRefresh, refresh }) {
  const [activeCategory, setCategory] = useState(9999); // default
  const [activeCategoryName, setCategoryName] = useState("All Events"); // default
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [eventsDetails, setEventDetails] = useState([]);
  const [dueEvents, setDueEvents] = useState([]);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeteteEvent = async () => {
    try {
      if (!deleteEventId) {
        toast.error("Can't delete event at the moment");
        return;
      }

      if (!userData?.userId) {
        toast.error("Please login and try again");
        return;
      }
      const payload = {
        UserId: userData?.userId,
        EventId: deleteEventId,
      };
      const res = await axiosInstance.post(DELETE_EVENT_URL, payload);

      if (res?.status == 200) {
        toast.success("Event deleted successful");
      } else {
        toast.error("Can't delete event at the moment");
      }
    } catch (error) {
      toast.error("Can't delete event at the moment");
      console.error("not able to delete event", error);
    } finally {
      setRefresh((prev) => !prev);
    }
  };

  const handleFetchAllEvents = async () => {
    if (!userData?.userId) {
      console.error("Unauthorized user");
      return;
    }

    try {
      const res = await axiosInstance.get(GET_EVENTS_URL, {
        params: {
          userId: userData.userId,
          eventCategoryId: activeCategory || 9999,
        },
      });

      if (res?.data?.success === true && res?.data?.status === "FETCHED") {
        const allEvents = res?.data?.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueEvents = [];
        const todayAndFutureEvents = [];

        allEvents.forEach((ev) => {
          const eventDate = new Date(ev.eventDate);
          eventDate.setHours(0, 0, 0, 0);

          const diffInDays = Math.floor(
            (eventDate - today) / (1000 * 60 * 60 * 24),
          );

          // 1 day before event
          if (diffInDays === -1) {
            dueEvents.push(ev);
          }

          // today + future
          if (diffInDays >= 0) {
            todayAndFutureEvents.push(ev);
          }
        });

        setDueEvents(dueEvents);
        setEventDetails(todayAndFutureEvents);
      } else {
        setEventDetails([]);
        setDueEvents([]);
      }
    } catch (error) {
      console.error("Not able to fetch events details", error);
    }
  };

  useEffect(() => {
    handleFetchAllEvents();
  }, [userData?.userId, activeCategory, refresh]);

  return (
    <div className="h-full flex gap-3 bg-slate-100 font-sans text-slate-800">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white  flex flex-col rounded-md ">
        {/* Brand */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow">
            <IoCalendarOutline size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg">SharedNotes</h1>
            <p className="text-xs text-slate-400">Smart Reminder</p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {CATEGORIES?.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setCategoryName(cat.label);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition
                ${
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-primary/5 text-slate-500 cursor-pointer"
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="h-12 w-12 absolute bottom-20 left-62 z-40 cursor-pointer rounded-full bg-primary  text-white py-2  shadow-lg shadow-primary/40 hover:shadow-primary/80 duration-150 transition"
        >
          <span className="flex items-center justify-center gap-x-2 flex-nowrap">
            <BiSolidCommentAdd size={20} />
          </span>
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col bg-white rounded-md pb-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Events Manager</h2>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center bg-slate-100 px-4 py-2 rounded-xl w-80">
            <FiSearch className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="bg-transparent ml-2 w-full outline-none text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 flex gap-8 hide-scrollbar">
          {/* Event List */}
          <div className="flex-1 space-y-4">
            {eventsDetails?.length === 0 && dueEvents?.length === 0 && (
              <NoResultFound
                title="No reminders yet"
                desc="Create reminders from the calendar to keep track of upcoming events."
              />
            )}

            <div>
              {eventsDetails?.length > 0 && (
                <section className="mb-6">
                  <div className="flex itec justify-between">
                    <div className="pb-3 text-sm lg:text-lg font-semibold text-slate-600">
                      {activeCategoryName}
                    </div>
                    <WorkspaceModeBadge
                      privateDesc={"Only you can access this event."}
                      publicDesc={""}
                      selectedWorkspaceMode={"private"}
                    />
                  </div>
                  {eventsDetails?.map((ev, idx) => (
                    <div key={idx} className="pb-4">
                      <EventCard
                        key={ev.user_id}
                        event={ev}
                        setDeleteEventId={setDeleteEventId}
                        setShowDeleteModal={setShowDeleteModal}
                      />
                    </div>
                  ))}
                </section>
              )}

              {dueEvents?.length > 0 && (
                <section>
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base lg:text-lg font-semibold text-slate-800">
                        Overdue Events
                      </h2>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        Last 15 Days
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      Events that were due within the past 15 days.
                    </p>
                  </div>

                  {dueEvents?.map((ev, idx) => (
                    <div key={idx} className="pb-4">
                      <EventCard
                        key={ev.user_id}
                        event={ev}
                        setDeleteEventId={setDeleteEventId}
                        setShowDeleteModal={setShowDeleteModal}
                      />
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>

          {showForm && (
            <AddEventForm
              setRefresh={setRefresh}
              userData={userData}
              setShowForm={setShowForm}
              setCategory={setCategory}
              setCategoryName={setCategoryName}
            />
          )}
        </div>
      </main>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeteteEvent()}
        title="Delete Event?"
        description="This event will be permanently removed."
      />
    </div>
  );
}
