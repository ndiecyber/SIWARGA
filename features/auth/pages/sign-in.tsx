import { useState } from "react";

import { LogIn, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import UserSignInForm from "../components/user-sign-in-form";
import AdminSignInForm from "../components/admin-sign-in-form";

interface Props {
  children?: React.ReactNode;
}

function SignIn({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="gap-2">
            <LogIn className="h-4 w-4" />
            Masuk
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Masuk ke SiWarga</DialogTitle>
          <DialogDescription>
            Pilih jenis akun yang sesuai untuk masuk ke sistem.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "user" | "admin")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="gap-2">
              <UserRound className="h-4 w-4" />
              Warga
            </TabsTrigger>

            <TabsTrigger value="admin" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Pengurus
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <UserSignInForm onSuccess={() => setOpen(false)} />
          </TabsContent>

          <TabsContent value="admin">
            <AdminSignInForm onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default SignIn;
