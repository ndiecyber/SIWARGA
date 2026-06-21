export type FeeStatus = "LUNAS" | "TERTUNDA" | "BELUM_DIBUAT";
export type OwnershipStatus = "MILIK_SENDIRI" | "MENGONTRAK";

export interface FeeRow {
  id: string;
  block: string;
  houseNumber: string;
  ownerName: string;
  residentName: string;
  ownershipStatus: OwnershipStatus | null;
  status: FeeStatus;
  monthlyDueId: string | null;
  lastPaymentDate: string | null;
}

export interface FeeStats {
  totalHouses: number;
  totalTagihan: number;
  paidCount: number;
  unpaidCount: number;
  notGeneratedCount: number;
  paidAmount: number;
  totalTarget: number;
}

export interface FeesPageProps {
  houses: FeeRow[];
  stats: FeeStats;
  period: {
    month: number;
    year: number;
  };
}
