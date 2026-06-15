import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fraunces } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Phone, Mail, MessageSquare, ShieldCheck, Home } from "lucide-react";

function ContactLanding() {
  const contactDetails = [
    {
      name: "Ketua RT (Bp. Heri)",
      phone: "+62 812-3456-7890",
      role: "Layanan Warga & Administrasi",
      icon: Phone,
    },
    {
      name: "Pos Keamanan Utama",
      phone: "+62 821-9876-5432",
      role: "Keamanan & Darurat (24 Jam)",
      icon: ShieldCheck,
    },
    {
      name: "Sekretariat RT 04",
      phone: "arjamukti.rt04@gmail.com",
      role: "Korespondensi & Surat Resmi",
      icon: Mail,
    },
  ];

  return (
    <section
      id="contact"
      className="flex w-full flex-col items-center justify-center bg-background px-6 py-20 text-foreground md:px-0"
    >
      <div className="container mx-auto max-w-275 px-6 mb-8">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <Badge className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-tight text-primary">
            <Home className="h-3 w-3" />
            <span>Hubungi Kami</span>
          </Badge>
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{ fontSize: "clamp(32px, 4.5vw, 50px)", letterSpacing: "-1px", marginBottom: "8px" }}
          >
            Butuh Layanan Warga? <em className="italic text-primary">Hubungi Pengurus RT</em>
          </h2>
          <p
            className="text-[16px] leading-[1.6] text-muted-foreground truncate w-full"
            style={{ maxWidth: "540px" }}
            title="Silakan hubungi pengurus RT 04 Arjamukti melalui kontak resmi di bawah ini untuk layanan administrasi, aduan, atau kebutuhan darurat."
          >
            Silakan hubungi pengurus RT 04 Arjamukti melalui kontak resmi di bawah ini untuk layanan administrasi, aduan, atau kebutuhan darurat.
          </p>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="mt-4 grid w-full max-w-[960px] grid-cols-1 gap-5 px-4 md:grid-cols-3">
        {contactDetails.map((contact, index) => {
          const Icon = contact.icon;

          return (
            <div
              key={index}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mb-1 text-base font-bold text-card-foreground">
                {contact.name}
              </h3>

              <p className="mb-3 text-xs text-muted-foreground">
                {contact.role}
              </p>

              <span className="break-all text-sm font-semibold text-primary">
                {contact.phone}
              </span>
            </div>
          );
        })}
      </div>

      <div
        role="group"
        className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="lg" className="h-12 rounded-xl px-6">
            <MessageSquare className="mr-2 h-5 w-5" />
            <span>Hubungi via WhatsApp</span>
          </Button>
        </a>

        <Button
          variant="outline"
          size="lg"
          className="h-12 rounded-xl border-border bg-background px-6 hover:bg-muted"
        >
          <ShieldCheck className="mr-2 h-5 w-5" />
          <span>Masuk Admin</span>
        </Button>
      </div>
    </section>
  );
}

export default ContactLanding;
