export function formatePrettyDateTime(input) {
  if (!input) return "";

  const date = new Date(input);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
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
