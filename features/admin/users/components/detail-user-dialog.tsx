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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  User as UserIcon,
  Phone,
  Shield,
  FileText,
  Calendar,
  ExternalLink,
  IdCard,
  Info,
  Copy,
  LucideIcon,
} from "lucide-react";
// import { User } from "../types";
import { User } from "@/generated/prisma/browser";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

export type Role = "ADMIN" | "WARGA" | "KETUA_RT";

interface Props {
  user: User;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

export function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 text-sm text-foreground wrap-break-word">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DetailUserDialog({
  user,
  open,
  onOpenChange,
  children,
}: Props) {
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
      <DialogContent className="w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] overflow-hidden p-0 sm:max-w-lg md:max-w-5xl">
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle>Detail Warga</DialogTitle>
            <DialogDescription>
              Informasi lengkap warga. Data hanya dapat dilihat.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 px-6 pt-2 pb-4 space-y-4 overflow-y-auto">
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-center w-12 h-12 text-lg font-semibold rounded-full shrink-0 bg-primary text-primary-foreground">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-foreground">
                  {user.name}
                </p>
                <p className="text-xs truncate text-muted-foreground">
                  NIK: {user.identificationNumber}
                </p>
              </div>

              <Badge variant="secondary">
                {user.role === "ADMIN" ? "Pengurus" : "Warga"}
              </Badge>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <Field icon={UserIcon} label="Nama Lengkap">
                {user.name}
              </Field>

              <Field icon={IdCard} label="Nomor Induk Kependudukan">
                {user.identificationNumber}
              </Field>

              <Field icon={Phone} label="Nomor Telepon">
                {user.phoneNumber}
              </Field>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <Field icon={Shield} label="Peran">
                <Badge variant="outline">
                  {user.role === "ADMIN" ? "Pengurus" : "Warga"}
                </Badge>
              </Field>

              <Field icon={Calendar} label="Terdaftar">
                {formatDate(user.createdAt)}
              </Field>

              <Field icon={FileText} label="Dokumen">
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={user.kkUrl ?? ""} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Lihat KK
                    </a>
                  </Button>

                  <Button asChild variant="outline" size="sm">
                    <a
                      href={user.ktpUrl ?? ""}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Lihat KTP
                    </a>
                  </Button>
                </div>
              </Field>

              <Field icon={Calendar} label="Diperbarui">
                {formatDate(user.updatedAt)}
              </Field>
            </div>
          </div>

          <DialogFooter className="flex-col items-start gap-3 px-6 py-4 border-t shrink-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Data ini bersifat pribadi dan hanya digunakan untuk keperluan
                administrasi warga.
              </p>
            </div>

            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 sm:flex-none"
                onClick={() => {
                  navigator.clipboard.writeText(
                    user.identificationNumber ?? "",
                  );
                  toast.info("Nomor Induk Kependudukan berhasil disalin");
                }}
              >
                <Copy className="mr-1.5 h-4 w-4" />
                Salin NIK
              </Button>

              <DialogClose asChild>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  Tutup
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
