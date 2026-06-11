"use client";

import { ArrowUpRight, Copy, House, Phone, User } from "lucide-react";
import { HouseWithOwner } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DetailUserDialog from "@/features/admin/users/components/detail-user-dialog";
import { toast } from "sonner";
import { useState } from "react";

interface DetailHouseViewProps {
  house: HouseWithOwner;
}

function DetailHouseView({ house }: DetailHouseViewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      setTimeout(() => setCopied(false), 3000);
      toast.success(message);
    } catch (error) {
      toast.error("Gagal menyalin data. Silahkan coba lagi.");
    }
  }

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
        <div className="flex gap-2">
          <div className="flex items-center justify-center rounded-md bg-primary/20">
            <House className="m-4 text-primary" />
          </div>
          <div className="flex flex-col gap-1 leading-tight">
            <h1 className="flex gap-0 text-2xl font-bold uppercase">
              {house.block}
              {house.houseNumber}
            </h1>
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Nomor Properti
            </span>
          </div>
        </div>
        <Badge className="bg-primary/20 text-primary">{house.status}</Badge>
      </header>

      <section about="House owner information">
        <div className="flex items-center justify-between w-full mb-2">
          <h1 className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
            <User size={16} />
            Informasi Pemilik
          </h1>

          {house.owner && (
            <DetailUserDialog user={house.owner}>
              <Button variant="outline" size="sm">
                Detail
                <ArrowUpRight size={16} />
              </Button>
            </DetailUserDialog>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-sm text-muted-foreground">Nama Pemilik</h2>
            <div className="flex items-center h-10 mt-1">
              {house.owner?.name ?? "-"}
            </div>
          </div>

          <div>
            <h2 className="text-sm text-muted-foreground">No. Telepon</h2>
            <div className="flex items-center justify-between h-10 gap-4 mt-1">
              <div className="flex items-center min-w-0 gap-2">
                <Phone size={16} className="shrink-0" />
                <span className="truncate">
                  {house.owner?.phoneNumber ?? "-"}
                </span>
              </div>

              {house.owner && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    handleCopy(
                      house.owner?.phoneNumber ?? "",
                      "Nomor telepon berhasil disalin.",
                    );
                  }}
                >
                  <Copy />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DetailHouseView;
