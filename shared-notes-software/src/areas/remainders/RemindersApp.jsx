import { useState } from "react";
import {
  FiBell,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiFlag,
  FiSun,
  FiSearch,
  FiEdit3,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiChevronRight,
  FiMapPin,
  FiUsers,
  FiTrendingUp,
  FiGift,
  FiUser,
  FiLayers,
  FiFolder,
  FiBriefcase,
} from "react-icons/fi";
import DropdownReusable from "../../utils/dropdowns/DropdownReusable";
import { BiSolidCommentAdd } from "react-icons/bi";
import AddEventForm from "./AddEventForm";
import EventCard from "./EventCard";
import { useEffect } from "react";
import { GET_EVENTS_URL } from "../../api/api_routes";
import { axiosInstance } from "../../api/axios";

/* ---------- Constants ---------- */

const CATEGORIES = [
  { id: 9999, label: "All Events", icon: FiBell },
  { id: 1, label: "Holidays", icon: FiSun },
  { id: 2, label: "Meetings", icon: FiUsers },
  { id: 3, label: "Work", icon: FiBriefcase },
  { id: 4, label: "Tasks", icon: FiBriefcase },
  { id: 5, label: "Projects", icon: FiFolder },
  { id: 6, label: "Events", icon: FiCalendar },
  { id: 7, label: "Personal", icon: FiUser },
  { id: 8, label: "General", icon: FiLayers },
];

/* ===================================================== */

export default function RemindersApp({ userData }) {
  const [events, setEvents] = useState([]);
  const [activeCategory, setCategory] = useState(9999); // default
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [eventsDetails, setEventDetails] = useState([]);

  function toggleDone(id) {
    setEvents((ev) =>
      ev.map((e) => (e.id === id ? { ...e, done: !e.done } : e)),
    );
  }

  function deleteEv(id) {
    setEvents((ev) => ev.filter((e) => e.id !== id));
  }

  const handleFetchAllEvents = async () => {
    if (!userData?.userId) {
      console.log("Unauthorized user");
      return;
    }

    console.log(activeCategory);

    try {
      const res = await axiosInstance.get(GET_EVENTS_URL, {
        params: {
          userId: userData.userId,
          eventCategoryId: activeCategory || 9999,
        },
      });

      if (res?.data?.success == true && res?.data?.status == "FETCHED") {
        setEventDetails(res?.data?.data || []);
      } else {
        setEventDetails([]);
      }

      console.log(res.data);
    } catch (error) {
      console.log("Not able to fetch events details", error);
    }
  };

  useEffect(() => {
    handleFetchAllEvents();
  }, [userData?.userId, activeCategory]);

  return (
    <div className="h-full flex gap-3 bg-slate-100 font-sans text-slate-800">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white  flex flex-col rounded-md ">
        {/* Brand */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow">
            <FiBell />
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
                onClick={() => setCategory(cat.id)}
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
      <main className="flex-1 flex flex-col bg-white rounded-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Events & Remainders</h2>
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
        <div className="flex-1 overflow-y-auto p-8 flex gap-8">
          {/* Event List */}
          <div className="flex-1 space-y-4">
            {eventsDetails?.length === 0 && (
              <div className="text-center text-slate-400 mt-20">
                <FiCalendar size={36} className="mx-auto mb-3 opacity-30" />
                No events found
              </div>
            )}

            {eventsDetails?.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                onToggleDone={toggleDone}
                onDelete={deleteEv}
              />
            ))}
          </div>

          {showForm && (
            <AddEventForm userData={userData} setShowForm={setShowForm} />
          )}
        </div>
      </main>
    </div>
  );
}
