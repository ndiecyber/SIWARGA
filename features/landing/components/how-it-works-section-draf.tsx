import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  LayoutGrid,
  ListOrdered,
  LogIn,
  UserPlus,
} from "lucide-react";
import React from "react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Daftar Akun",
    description:
      "Warga mendaftar dengan NIK dan nomor rumah. Admin verifikasi dan aktifkan akun.",
  },
  {
    number: "02",
    icon: LogIn,
    title: "Masuk ke Sistem",
    description:
      "Login dengan username dan password. Warga dan admin memiliki tampilan berbeda.",
  },
  {
    number: "03",
    icon: LayoutGrid,
    title: "Akses Dashboard",
    description:
      "Lihat status iuran, pengumuman terbaru, dan informasi RT kapanpun dibutuhkan.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Pantau & Kelola",
    description:
      "Admin mengelola data dan keuangan. Warga memantau status dan riwayat iuran.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-primary py-27 text-white">
      <div className="mx-auto max-w-275 px-6">
        <div className="text-center">
          <Badge className="inline-flex items-center gap-1.5 rounded-[20px] border px-3.5 py-1.25 text-[12px] font-semibold uppercase tracking-[0.4px] border-primary/20 bg-secondary text-primary">
            <ListOrdered />{" "}
            <span className="text-primary">Cara Penggunaan</span>
          </Badge>
          <h2
            className={cn(
              "text-[clamp(32px,5vw,52px)] font-semibold leading-[1.15] tracking-[-0.5px] font-fraunces",
            )}
          >
            Mulai dalam
            <br />
            <em className="italic opacity-85">4 langkah mudah</em>
          </h2>
        </div>

        <div
          data-reveal
          data-revealed="false"
          className="mt-13 grid grid-cols-4 gap-0.5 max-[768px]:grid-cols-2 max-[460px]:grid-cols-1"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-[18px] border border-white/10 bg-white/6 px-5.5 py-7"
              >
                {index < steps.length - 1 ? (
                  <div className="absolute -right-4.5 top-1/2 z-1 -translate-y-1/2 text-[18px] text-white/20 max-[768px]:hidden">
                    →
                  </div>
                ) : null}
                <div
                  className={cn(
                    "mb-3.5 text-[40px] font-semibold leading-none text-white/15 font-fraunces",
                  )}
                >
                  {step.number}
                </div>
                <div className="mb-3.5 flex size-11.5 items-center justify-center rounded-[13px] bg-white/12">
                  <Icon aria-hidden className="size-5.25 text-white" />
                </div>
                <div
                  className={cn(
                    "mb-1.75 text-[15px] font-semibold font-fraunces",
                  )}
                >
                  {step.title}
                </div>
                <div className="text-[13px] leading-[1.6] text-white/65">
                  {step.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
