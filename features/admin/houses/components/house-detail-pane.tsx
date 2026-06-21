"use client";

import { HouseIcon, MapPin, PhoneIcon, UserIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HouseStatus } from "@/generated/prisma/browser";

import { HouseWithOwner } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HouseDetailPaneProps {
  house: HouseWithOwner | null;
}

function HouseDetailPane({ house }: HouseDetailPaneProps) {
  return (
    <div className="flex flex-col h-full gap-1">
      <Card className="gap-3 border ring-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-start gap-2">
            <HouseIcon size={14} />
            Detail Properti
          </CardTitle>
          <CardDescription>Informasi detail properti</CardDescription>
        </CardHeader>
        <CardContent className="flex-col flex-1 gap-6 overflow-y-auto">
          {/* Nomor Rumah */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
              Nomor Rumah
            </span>
            <p className="font-semibold uppercase">
              {house ? house.block + house.houseNumber : "-"}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
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
                {house.status === HouseStatus.OCCUPIED ? "Occupied" : "Vacant"}
              </Badge>
            ) : (
              <p className="text-muted-foreground">-</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-3 border shadow-xs ring-0">
        {/* Pemilik */}
        <CardHeader>
          <CardTitle className="flex items-center justify-start gap-2">
            <UserIcon size={14} />
            Informasi Pemilik
          </CardTitle>
          <CardDescription>Informasi pemilik properti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
              Nama Pemilik
            </span>
            <p>{house?.owner?.name ?? "-"}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
              No. Telepon
            </span>
            <div className="flex items-center gap-2">
              <PhoneIcon size={14} className="shrink-0 text-muted-foreground" />
              <p>{house?.owner?.phoneNumber ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-3 border ring-0">
        {/* Peta Interaktif Placeholder */}
        <CardHeader>
          <CardTitle className="flex items-center justify-start gap-2">
            <MapPin size={14} />
            Peta Interaktif
          </CardTitle>
          <CardDescription>
            Peta interaktif akan ditampilkan di sini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-sm border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
            Peta akan ditampilkan di sini
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HouseDetailPane;
