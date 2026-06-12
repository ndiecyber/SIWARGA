import { AnnouncementDashboard } from "../components/announcment-view";

export type Announcement = {
  id: number;
  category: string;
  title: string;
  description: string;
  eventDate: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
interface AnnouncmentPageProps {
  announcements: Announcement[];
}

const AnnouncmentPage = ({ announcements }: AnnouncmentPageProps) => {
  return (
    <div className="min-h-full">
      <AnnouncementDashboard announcements={announcements} />
    </div>
  );
};

export default AnnouncmentPage;
