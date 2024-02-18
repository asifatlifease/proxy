export function calculateHours(
  checkin: string | Date,
  checkout: Date | string
) {
  const checkinDate = checkin as Date;
  const checkoutDate = checkout as Date;
  if (
    !checkinDate ||
    !checkoutDate ||
    typeof checkinDate === "string" ||
    typeof checkoutDate === "string"
  ) {
    return "0h 0m";
  }
  const diff = checkoutDate.getTime() - checkinDate.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export function getTime(date: string) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  return `${hours}:${minutes}`;
}

export function getDate(date: string) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
}
