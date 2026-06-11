import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { HouseWithOwner } from "../types";
import DetailHouseView from "../components/detail-view";

interface HouseShowProps {
  house: HouseWithOwner;
  children: React.ReactNode;
}

function HouseShow({ house, children }: HouseShowProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Rumah</DialogTitle>
          <DialogDescription>
            Informasi lengkap rumah, data hanya dapat dilihat
          </DialogDescription>
          <DetailHouseView house={house} />
        </DialogHeader>
        <DialogFooter className="flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center text-xs text-muted-foreground">
              <Info className="mr-2" size={16} />
              Data hanya dapat dilihat, tidak dapat diubah
            </span>
            <Button variant="secondary">Tutup</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default HouseShow;
