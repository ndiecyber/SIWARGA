export function calculateAnnouncementStatus(
  eventDate: Date | string | null | undefined,
): string {
  if (!eventDate) return "upcoming";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);

  if (event < today) return "done";
  if (event.getTime() === today.getTime()) return "ongoing";
  return "upcoming";
}
