import {
  Dialog,
  DialogContent,
  DialogDescription,
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
        {/* <DialogFooter className="flex items-center justify-end">
          <Button >Tutup</Button>
          <Button>Edit</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

export default HouseShow;
