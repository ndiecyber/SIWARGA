"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { markAsPaidAction } from "../actions/mark-as-paid";

const PAYMENT_METHODS = [
  { value: "TUNAI", label: "Tunai" },
  { value: "TRANSFER_BANK", label: "Transfer Bank" },
  { value: "QRIS", label: "QRIS" },
  { value: "E_WALLET", label: "E-Wallet" },
];

interface MarkPaidDialogProps {
  monthlyDueId: string | null;
  houseLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarkPaidDialog({
  monthlyDueId,
  houseLabel,
  open,
  onOpenChange,
}: MarkPaidDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState("25000");
  const [paymentMethod, setPaymentMethod] = useState("TUNAI");

  const handleSubmit = async () => {
    if (!monthlyDueId) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Mencatat pembayaran...");

    const result = await markAsPaidAction({
      monthlyDueId,
      amountPaid: Number(amount),
      paymentMethod,
    });

    if (result.success) {
      toast.success(result.message, { id: toastId });
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.message, { id: toastId });
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Catat Pembayaran</DialogTitle>
          <DialogDescription>
            Catat pembayaran iuran untuk {houseLabel}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah Dibayar</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="paymentMethod">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !monthlyDueId}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isSubmitting ? "Menyimpan..." : "Konfirmasi Pembayaran"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
