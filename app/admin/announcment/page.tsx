import AdministrationLayout from "@/components/layouts/administration-layout";
import AnnouncmentPage from "@/features/Admin/pages/announcments-page";

export const metadata = {
  title: "Pengumuman | SIWARGA Admin",
  description: "Kelola pengumuman warga perumahan",
};

function Page() {
  return (
    <AdministrationLayout>
      <AnnouncmentPage />
    </AdministrationLayout>
  );
}

export default Page;
