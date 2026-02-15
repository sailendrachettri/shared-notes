export function formatePrettyDateTime(input) {
  if (!input) return "";

  const date = new Date(input);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now - date;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // ✅ Just now
  if (seconds < 60) {
    return "Just now";
  }

  // ✅ Minutes ago
  if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  }

  // ✅ Hours ago
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  // ✅ Yesterday
  if (days === 1) {
    return "Yesterday";
  }

  // ====== Normal Date Format ======

  const isSameYear = date.getFullYear() === now.getFullYear();

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const time = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return isSameYear
    ? `${day} ${month} at ${time}`
    : `${day} ${month} ${year} at ${time}`;
}
