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

const DUMMY_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    category: "Keamanan",
    title: "Peningkatan Keamanan Lingkungan Malam Hari",
    description:
      "Diberitahukan kepada seluruh warga bahwa mulai tanggal 15 Juni 2026, jadwal ronda malam akan ditambah menjadi 3 shift. Harap seluruh kepala keluarga turut berpartisipasi sesuai jadwal yang telah dibagikan.",
    eventDate: new Date("2026-06-15"),
    status: "upcoming",
    createdAt: new Date("2026-06-01"),
    updatedAt: new Date("2026-06-01"),
  },
  {
    id: 2,
    category: "Kebersihan",
    title: "Kerja Bakti Rutin Minggu Ini",
    description:
      "Warga diharapkan hadir pada kegiatan kerja bakti rutin yang akan dilaksanakan pada hari Minggu pukul 07.00 WIB. Membawa peralatan kebersihan masing-masing. Lokasi: Taman depan Blok A.",
    eventDate: new Date("2026-06-12"),
    status: "ongoing",
    createdAt: new Date("2026-06-03"),
    updatedAt: new Date("2026-06-03"),
  },
  {
    id: 3,
    category: "Keuangan",
    title: "Pembayaran Iuran Bulan Juni",
    description:
      "Mengingatkan kepada seluruh warga untuk segera melunasi iuran bulanan bulan Juni sebelum tanggal 10. Pembayaran dapat dilakukan melalui aplikasi SIWARGA atau langsung ke bendahara RT.",
    eventDate: new Date("2026-06-10"),
    status: "upcoming",
    createdAt: new Date("2026-06-01"),
    updatedAt: new Date("2026-06-01"),
  },
  {
    id: 4,
    category: "Sosial",
    title: "Perayaan Hari Kemerdekaan RI ke-81",
    description:
      "Panitia 17 Agustus mengundang seluruh warga untuk berpartisipasi dalam rangkaian kegiatan perayaan HUT RI. Pendaftaran lomba dibuka mulai 1 Juli. Hadiah menarik menanti!",
    eventDate: new Date("2026-08-17"),
    status: "upcoming",
    createdAt: new Date("2026-06-05"),
    updatedAt: new Date("2026-06-05"),
  },
  {
    id: 5,
    category: "Infrastruktur",
    title: "Perbaikan Jalan Blok B Selesai",
    description:
      "Perbaikan jalan di area Blok B telah selesai dilaksanakan. Warga sudah dapat melewati jalan tersebut. Terima kasih atas kesabaran dan kerja sama selama proses perbaikan berlangsung.",
    eventDate: null,
    status: "done",
    createdAt: new Date("2026-05-20"),
    updatedAt: new Date("2026-06-02"),
  },
  {
    id: 6,
    category: "Sosial",
    title: "Posyandu Balita Bulan Juni",
    description:
      "Kegiatan Posyandu Balita bulan Juni akan dilaksanakan pada Rabu, 18 Juni 2026 pukul 09.00–12.00 WIB di Balai RW. Harap membawa buku KIA dan kartu posyandu.",
    eventDate: new Date("2026-06-18"),
    status: "upcoming",
    createdAt: new Date("2026-06-07"),
    updatedAt: new Date("2026-06-07"),
  },
];

const AnnouncmentPage = () => {
  return (
    <div className="min-h-full">
      <AnnouncementDashboard announcements={DUMMY_ANNOUNCEMENTS} />
    </div>
  );
};

export default AnnouncmentPage;
