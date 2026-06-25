"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
}

interface AddRondaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eligibleUsers: User[];
  onAdd: (userId: string) => Promise<any>;
  dayName: string;
}

export default function AddRondaDialog({
  isOpen,
  onClose,
  eligibleUsers,
  onAdd,
  dayName,
}: AddRondaDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter users based on search query
  const filteredUsers = eligibleUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber.includes(searchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Silakan pilih warga terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onAdd(selectedUserId);
      if (res?.success) {
        toast.success(res.message);
        setSelectedUserId("");
        setSearchQuery("");
        onClose();
      } else {
        toast.error(res?.message || "Gagal menambahkan petugas ronda");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Petugas Ronda</DialogTitle>
            <DialogDescription>
              Pilih warga yang akan ditugaskan ronda malam pada hari{" "}
              <span className="font-semibold text-foreground">{dayName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="search-user">Cari Nama Warga</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="search-user"
                  type="text"
                  placeholder="Cari nama atau nomor telepon..."
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="user-select">Pilih Warga</Label>
              <Select
                value={selectedUserId}
                onValueChange={setSelectedUserId}
              >
                <SelectTrigger id="user-select" className="w-full">
                  <SelectValue placeholder="-- Pilih Warga --" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {filteredUsers.length === 0 ? (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      Warga tidak ditemukan
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.phoneNumber})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Tambah Petugas"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
