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
} from "lucide-react";
import { User } from "../types";

export type Role = "ADMIN" | "WARGA" | "KETUA_RT";

// export interface User {
//   id: string;
//   name: string;
//   phoneNumber: string;
//   role: Role;
//   kkUrl: string;
//   ktpUrl: string;
//   createdAt: string | Date;
//   updatedAt: string | Date;
// }

interface Props {
  user: User;
}

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

function Field({
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
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 text-sm text-foreground wrap-break-word">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DetailUserDialog({ user }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Lihat detail"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Lihat detail</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Detail Warga</DialogTitle>
          <DialogDescription>
            Informasi lengkap warga. Data hanya dapat dilihat.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              NIK: {user.id}
            </p>
          </div>
          <Badge variant="secondary">{user.role}</Badge>
        </div>

        <Separator />

        {/* section 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Field icon={UserIcon} label="Nama Lengkap">
            {user.name}
          </Field>
          <Field icon={IdCard} label="Nomor Induk Kependudukan">
            {user.id}
          </Field>
          <Field icon={Phone} label="Nomor Telepon">
            {user.phoneNumber}
          </Field>
        </div>

        <Separator />

        {/* section 2 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Field icon={Shield} label="Role">
            <Badge variant="outline">{user.role}</Badge>
          </Field>
          <Field icon={Calendar} label="Terdaftar">
            {formatDate(user.createdAt)}
          </Field>
          <Field icon={FileText} label="Dokumen">
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={user.kkUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Lihat KK
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={user.ktpUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Lihat KTP
                </a>
              </Button>
            </div>
          </Field>

          <Field icon={Calendar} label="Diperbarui">
            {formatDate(user.updatedAt)}
          </Field>
        </div>

        <DialogFooter className="flex-col items-start gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
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
              onClick={() => navigator.clipboard.writeText(user.id)}
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
      </DialogContent>
    </Dialog>
  );
}
