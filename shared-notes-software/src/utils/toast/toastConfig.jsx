// utils/toast/toastConfig.jsx

import toast from "react-hot-toast";
import { IoCheckmarkOutline, IoAlertCircleOutline, IoInformationCircleOutline, IoWarningOutline, IoCloseOutline } from "react-icons/io5";

const variants = {
  success: {
    icon: IoCheckmarkOutline,
    iconColor: "#1a7f4b",
    iconBg: "#edf7f2",
    border: "#b8e6cc",
    bar: "#1a7f4b",
  },
  error: {
    icon: IoAlertCircleOutline,
    iconColor: "#d25564",
    iconBg: "#fdf0f1",
    border: "#f5c0c5",
    bar: "#d25564",
  },
  info: {
    icon: IoInformationCircleOutline,
    iconColor: "#2563eb",
    iconBg: "#edf3fd",
    border: "#bcd4f5",
    bar: "#2563eb",
  },
  warning: {
    icon: IoWarningOutline,
    iconColor: "#d97706",
    iconBg: "#fef8ec",
    border: "#fad9a0",
    bar: "#d97706",
  },
};

const ToastUI = ({ t, type, message, description }) => {
  const v = variants[type];
  const Icon = v.icon;

  return (
    <div
      // style={{ borderColor: v.border }}
      className={`
        flex items-center gap-2.5 bg-white border rounded-[10px] border-slate-200
        px-3.5 py-2.5 w-[320px] relative overflow-hidden
        shadow-[0_2px_10px_rgba(0,0,0,0.06)]
        transition-all duration-300
        ${t.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
    >
      {/* Icon */}
      <div
        style={{ background: v.iconBg }}
        className="flex-shrink-0 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center"
      >
        <Icon size={15} style={{ color: v.iconColor }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-800 leading-tight">{message}</p>
        {description && (
          <p className="text-[11.5px] text-gray-400 mt-0.5 leading-tight">{description}</p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="flex-shrink-0 w-[20px] h-[20px] rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-colors"
      >
        <IoCloseOutline size={13} />
      </button>

      {/* Bottom progress bar */}
      <div
        style={{ background: v.bar }}
        className="absolute bottom-0 left-0 h-[2px] rounded-b-[10px]"
      >
        <div
          style={{
            width: "100%",
            animation: `shrink ${t.duration ?? 4000}ms linear forwards`,
            background: v.bar,
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};

// ── Public API ──────────────────────────────────────────────
const showToast = (type, message, description, options = {}) => {
  return toast.custom(
    (t) => <ToastUI t={t} type={type} message={message} description={description} />,
    { duration: 4000, ...options }
  );
};

export const customToast = {
  success: (message, description, options) => showToast("success", message, description, options),
  error:   (message, description, options) => showToast("error",   message, description, options),
  info:    (message, description, options) => showToast("info",    message, description, options),
  warning: (message, description, options) => showToast("warning", message, description, options),
};