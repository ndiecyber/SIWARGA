import { Announcement } from "@/generated/prisma/browser";

import { AnnouncementDashboard } from "../components/announcement-view";

interface Props {
  announcements: Announcement[];
}

const AnnouncementPage = ({ announcements }: Props) => {
  return (
    <div className="min-h-full">
      <AnnouncementDashboard announcements={announcements} />
    </div>
  );
};

export default AnnouncementPage;
