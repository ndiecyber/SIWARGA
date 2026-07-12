"use client";

import { Smartphone, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";

interface PaymentDrawerProps {
  children: React.ReactNode;
  amount?: number;
}

const ADMIN_PHONE = "0878-1234-5678";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function PaymentDrawer({ children, amount }: PaymentDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="rounded-t-xl max-w-2xl mx-auto">
        <div className="flex max-h-[75vh] flex-col overflow-y-auto px-4 pb-8">
          {/* QRIS Image */}
          <div className="-mx-4 mt-2 shrink-0 overflow-hidden">
            <Image
              width={600}
              height={400}
              src="/images/payment/qris-dana-payment.jpeg"
              alt="QRIS Pembayaran"
              className="h-64 w-full object-contain bg-white rounded-3xl"
            />
          </div>

          {/* Header */}
          <DrawerHeader className="px-0">
            <DrawerTitle className="text-left text-lg font-extrabold">
              Pembayaran Iuran RT
            </DrawerTitle>
            {amount && (
              <DrawerDescription className="text-left">
                Total pembayaran:{" "}
                <span className="font-semibold text-foreground">
                  {formatRupiah(amount)}
                </span>
              </DrawerDescription>
            )}
          </DrawerHeader>

          {/* Instructions */}
          <div className="space-y-3 rounded-xl bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Smartphone className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">Scan QRIS</p>
                <p className="text-xs text-muted-foreground">
                  Buka aplikasi pembayaran (DANA, GoPay, OVO, Mobile Banking),
                  pilih scan QRIS, dan arahkan ke kode di atas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Phone className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">Konfirmasi ke Admin</p>
                <p className="text-xs text-muted-foreground">
                  Setelah pembayaran berhasil, hubungi admin di nomor berikut
                  untuk konfirmasi:
                </p>
                <a
                  href={`https://wa.me/${ADMIN_PHONE.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Phone className="size-3.5" />
                  {ADMIN_PHONE}
                </a>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Jika mengalami kendala, silakan hubungi pengurus RT untuk bantuan
            lebih lanjut.
          </p>

          <DrawerClose asChild>
            <Button variant="outline" className="mt-6 w-full shrink-0 rounded-xl">
              Tutup
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
