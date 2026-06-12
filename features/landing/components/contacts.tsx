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
      className="flex flex-col items-center justify-center w-full gap-8 px-6 py-20 bg-primary text-primary-foreground md:px-0"
    >
      <Badge className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-tight bg-white/10 text-white border border-white/20">
        <Home className="h-3 w-3" /> <span>Hubungi Kami</span>
      </Badge>

      <div
        className={cn(
          fraunces.className,
          "text-4xl md:text-5xl font-bold leading-tight text-center max-w-[700px] px-4",
        )}
      >
        <h1>Butuh Layanan Warga?</h1>
        <h1 className="opacity-85 mt-2">Hubungi Pengurus RT</h1>
      </div>
      <span className="text-center text-wrap opacity-85 text-sm md:text-base max-w-[500px]">
        Silakan hubungi pengurus RT 04 Arjamukti melalui kontak resmi di bawah ini untuk layanan administrasi, aduan, atau kebutuhan darurat.
      </span>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-[960px] px-4 mt-4">
        {contactDetails.map((contact, index) => {
          const Icon = contact.icon;
          return (
            <div
              key={index}
              className="flex flex-col p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {contact.name}
              </h3>
              <p className="text-xs text-white/70 mb-3">
                {contact.role}
              </p>
              <span className="text-sm font-semibold text-secondary break-all">
                {contact.phone}
              </span>
            </div>
          );
        })}
      </div>

      <div
        role="group"
        className="flex flex-col sm:flex-row items-center gap-3 mt-6 justify-center"
      >
        <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="lg" className="rounded-xl h-12 px-6">
            <MessageSquare className="mr-2 h-5 w-5" />
            <span>Hubungi via WhatsApp</span>
          </Button>
        </a>
        <Button
          variant="outline"
          size="lg"
          className="bg-transparent border-white/20 hover:bg-white/10 hover:text-white rounded-xl h-12 px-6"
        >
          <ShieldCheck className="mr-2 h-5 w-5" />
          <span>Masuk Admin</span>
        </Button>
      </div>
    </section>
  );
}

export default ContactLanding;
