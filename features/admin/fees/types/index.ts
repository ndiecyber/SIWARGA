export type FeeStatus = "LUNAS" | "TERTUNDA" | "BELUM_DIBUAT";

export interface FeeRow {
  id: string;
  block: string;
  houseNumber: string;
  ownerName: string;
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
