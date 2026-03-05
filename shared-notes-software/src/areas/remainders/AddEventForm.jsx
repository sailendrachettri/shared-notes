import React from "react";
import { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import DropdownReusable from "../../utils/dropdowns/DropdownReusable";
import { axiosInstance } from "../../api/axios";
import { ADD_EVENT_URL } from "../../api/api_routes";
import toast from "react-hot-toast";

const today = new Date().toISOString().split("T")[0];

function emptyForm() {
  return {
    title: "",
    category: "meeting",
    date: "",
    time: "",
    priority: "Medium",
    note: "",
    location: "",
  };
}

const AddEventForm = ({
  setShowForm,
  userData,
  setRefresh,
  setCategory,
  setCategoryName,
}) => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categoryOptions = [
    { value: 1, label: "Holidays" },
    { value: 2, label: "Meetings" },
    { value: 3, label: "Work" },
    { value: 4, label: "Tasks" },
    { value: 5, label: "Projects" },
    { value: 6, label: "Events" },
    { value: 7, label: "Personal" },
    { value: 8, label: "General" },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      console.log(form);
      if (!form.title.trim()) return setError("Title required");
      if (!form.date) return setError("Date required");

      if (!userData?.userId) {
        toast.error("Please login and try again");
        return;
      }
      const payload = {
        UserId: userData?.userId,
        EventTitle: form?.title,
        EventDate: form?.date,
        EventCategoryId: selectedCategory?.value,
        EventTime: form.time ? `${form.time}:00` : null,
      };

      const res = await axiosInstance.post(ADD_EVENT_URL, payload);

      if (res?.data?.success == true && res?.data?.status == "CREATED") {
        toast.success(res?.data?.message || "Event created successful");
        setForm(emptyForm());
        setCategory(selectedCategory?.value);
        setCategoryName(selectedCategory?.label);
        setShowForm(false);
        setError("");
      } else {
        toast.error("Can't create event at the moment");
      }
    } catch (error) {
      console.error("not able to add event", error);
      toast.error("Can't create event at the moment");
    } finally {
      setTimeout(() => {
        setSubmitting(false);
      }, 500);

      setRefresh((prev) => !prev);
    }
  };

  return (
    <>
      <section>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowForm(false)}
          />

          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 px-8 pb-10 space-y-5 animate-in fade-in zoom-in duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">
                Add New Event
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <FiAlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-sm text-slate-500 mb-1 block">
                Event Title
              </label>
              <input
                placeholder="Enter event title"
                value={form.title}
                maxLength={80}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm text-slate-500 mb-1 block">
                Event Type
              </label>
              <DropdownReusable
                options={categoryOptions}
                setSelectedOption={setSelectedCategory}
                selectedOption={selectedCategory}
                isMultiple={false}
                placeholder="Select event type"
              />
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-500 mb-1 block">
                  Date
                </label>
                <input
                  type="date"
                  min={today}
                  value={form.date}
                  max={new Date()}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>

              <div>
                <label className="text-sm text-slate-500 mb-1 block">
                  Time
                </label>
                <input
                  type="time"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, time: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                disabled={submitting}
                onClick={() => {
                  handleSubmit();
                }}
                className={`${submitting ? "bg-slate-300 text-slate-600" : "bg-primary text-white"} flex-1 py-2.5 rounded-xl hover:opacity-90 transition font-medium cursor-pointer`}
              >
                {submitting ? "Saving..." : "Save Event"}
              </button>

              <button
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                className="flex-1 border border-slate-300 text-slate-600 py-2.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddEventForm;
