export function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split("T")[0]; // формат YYYY-MM-DD
}

export function isToday(dateString) {
  const today = new Date();
  const date = new Date(dateString);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}
