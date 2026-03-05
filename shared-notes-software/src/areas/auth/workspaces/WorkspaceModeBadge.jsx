import { HiOutlineLockClosed, HiOutlineLockOpen } from "react-icons/hi";

export default function WorkspaceModeBadge({
  selectedWorkspaceMode,
  publicDesc,
  privateDesc,
}) {
  const isPrivate = selectedWorkspaceMode?.toLowerCase() === "private";

  const styles = isPrivate
    ? {
        bg: "bg-primary/10",
        text: "text-primary",
        iconColor: "text-primary",
        tooltip: privateDesc || "Only you can access this page.",
      }
    : {
        bg: "bg-green-100",
        text: "text-green-600",
        iconColor: "text-green-600",
        tooltip: publicDesc || "Anyone with access can view this page.",
      };

  return (
    <div className="relative group inline-flex">
      <span
        className={`capitalize inline-flex opacity-45 items-center gap-1.5 p-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-default ${styles.text}`}
      >
        {isPrivate ? (
          <HiOutlineLockClosed
            size={15}
            className={`text-[13px] ${styles.iconColor}`}
          />
        ) : (
          <HiOutlineLockOpen
            size={15}
            className={`text-[13px] ${styles.iconColor}`}
          />
        )}
        {/* {selectedWorkspaceMode} */}
      </span>

      {/* Tooltip */}
      <div
        className="absolute right-3  top-full mt-1 
                      opacity-0 group-hover:opacity-100 
                      pointer-events-none 
                      transition-all duration-200 
                      scale-95 group-hover:scale-100
                      bg-slate-900 text-white text-[11px] 
                      px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20"
      >
        {styles.tooltip}
      </div>
    </div>
  );
}
