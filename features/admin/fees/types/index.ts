export type FeeStatus = "LUNAS" | "TERTUNDA" | "BELUM_DIBUAT";

export interface FeeRow {
  id: string;
  block: string;
  houseNumber: string;
  ownerName: string;
  status: FeeStatus;
  lastPaymentDate: string | null;
}
