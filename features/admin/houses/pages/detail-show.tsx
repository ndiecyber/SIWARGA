import { useState } from "react";

import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function HouseShow({ house, open, onOpenChange, children }: HouseShowProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (nextOpenState: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpenState);
    }
    onOpenChange?.(nextOpenState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
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
            <DialogClose asChild>
              <Button variant="secondary">Tutup</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default HouseShow;
