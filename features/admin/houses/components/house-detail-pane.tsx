"use client";

import {
  EyeIcon,
  HouseIcon,
  MapPin,
  PhoneIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HouseStatus } from "@/generated/prisma/browser";
import { HouseWithOwner, HouseWithResidentsWithUser } from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DetailUserDialog from "@/features/admin/users/components/detail-user-dialog";

interface HouseDetailPaneProps {
  house: (HouseWithOwner & HouseWithResidentsWithUser) | null;
}

function HouseDetailPane({ house }: HouseDetailPaneProps) {
  const mainResident = house?.residents.find(
    (r) => r.residentRole === "MAIN_RESIDENT",
  );

  return (
    <div className="flex flex-col h-full gap-3">
      <Accordion
        type="multiple"
        defaultValue={["detail", "pemilik", "penghuni"]}
        className="flex flex-col gap-2"
      >
        {/* Detail Properti */}
        <AccordionItem
          value="detail"
          className="border shadow-xs rounded-xl bg-card"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <HouseIcon className="size-4 text-primary" />
              </div>
              <span className="text-sm font-semibold">Detail Properti</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  Nomor Rumah
                </span>
                <p className="font-semibold uppercase">
                  {house ? house.block + house.houseNumber : "-"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  Status
                </span>
                {house ? (
                  <Badge
                    variant={
                      house.status === HouseStatus.OCCUPIED
                        ? "default"
                        : "secondary"
                    }
                    className={
                      house.status === HouseStatus.OCCUPIED
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                    }
                  >
                    {house.status === HouseStatus.OCCUPIED
                      ? "Ditempati"
                      : "Kosong"}
                  </Badge>
                ) : (
                  <p className="text-muted-foreground">-</p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Informasi Pemilik */}
        <AccordionItem
          value="pemilik"
          className="border shadow-xs rounded-xl bg-card"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <UserIcon className="size-4 text-primary" />
              </div>
              <span className="text-sm font-semibold">Informasi Pemilik</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 space-y-1">
                  <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                    Nama Pemilik
                  </span>
                  <p className="truncate">{house?.owner?.name ?? "-"}</p>
                </div>
                {house?.owner && (
                  <DetailUserDialog user={house.owner}>
                    <Button variant="outline" size="sm" className="shrink-0">
                      <EyeIcon className="size-3" />
                      Detail
                    </Button>
                  </DetailUserDialog>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  No. Telepon
                </span>
                <div className="flex items-center gap-2">
                  <PhoneIcon
                    size={14}
                    className="shrink-0 text-muted-foreground"
                  />
                  <p>{house?.owner?.phoneNumber ?? "-"}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Penghuni Utama */}
        <AccordionItem
          value="penghuni"
          className="border shadow-xs rounded-xl bg-card"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <UsersIcon className="size-4 text-primary" />
              </div>
              <span className="text-sm font-semibold">Penghuni Utama</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 space-y-1">
                  <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                    Nama Penghuni
                  </span>
                  <p className="truncate">{mainResident?.user?.name ?? "-"}</p>
                </div>
                {mainResident?.user && (
                  <DetailUserDialog user={mainResident.user}>
                    <Button variant="outline" size="sm" className="shrink-0">
                      <EyeIcon className="size-3" />
                      Detail
                    </Button>
                  </DetailUserDialog>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  No. Telepon
                </span>
                <div className="flex items-center gap-2">
                  <PhoneIcon
                    size={14}
                    className="shrink-0 text-muted-foreground"
                  />
                  <p>{mainResident?.user?.phoneNumber ?? "-"}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Peta Interaktif */}
        <AccordionItem
          value="peta"
          className="border shadow-xs rounded-xl bg-card"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                <MapPin className="size-4 text-primary" />
              </div>
              <span className="text-sm font-semibold">Peta Interaktif</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="flex items-center justify-center h-32 text-sm border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
              Peta akan ditampilkan di sini
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default HouseDetailPane;
