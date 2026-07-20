import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PhoneIcon,
  MailIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  HomeIcon,
} from "lucide-react";

function ContactLanding() {
  const contactDetails = [
    {
      name: "Ketua RT (Bp. Heri)",
      phone: "+62 812-3456-7890",
      role: "Layanan Warga & Administrasi",
      icon: PhoneIcon,
    },
    {
      name: "Pos Keamanan Utama",
      phone: "+62 821-9876-5432",
      role: "Keamanan & Darurat (24 Jam)",
      icon: ShieldCheckIcon,
    },
    {
      name: "Sekretariat RT 04",
      phone: "arjamukti.rt04@gmail.com",
      role: "Korespondensi & Surat Resmi",
      icon: MailIcon,
    },
  ];

  return (
    <section
      id="contact"
      className="flex flex-col items-center justify-center w-full px-6 py-20 bg-background text-foreground md:px-0"
    >
      <div className="container px-6 mx-auto mb-8 max-w-275">
        <div className="flex flex-col items-center max-w-3xl mx-auto text-center">
          <Badge className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-tight text-primary">
            <HomeIcon className="w-3 h-3" />
            <span>Hubungi Kami</span>
          </Badge>
          <h2
            className="font-fraunces font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{
              fontSize: "clamp(32px, 4.5vw, 50px)",
              letterSpacing: "-1px",
              marginBottom: "8px",
            }}
          >
            Butuh Layanan Warga?{" "}
            <em className="italic text-primary">Hubungi Pengurus RT</em>
          </h2>
          <p
            className="text-[16px] leading-[1.6] text-muted-foreground truncate w-full"
            style={{ maxWidth: "540px" }}
            title="Silakan hubungi pengurus RT 04 Arjamukti melalui kontak resmi di bawah ini untuk layanan administrasi, aduan, atau kebutuhan darurat."
          >
            Silakan hubungi pengurus RT 04 Arjamukti melalui kontak resmi di
            bawah ini untuk layanan administrasi, aduan, atau kebutuhan darurat.
          </p>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid w-full grid-cols-1 gap-5 px-4 mt-4 max-w-240 md:grid-cols-3">
        {contactDetails.map((contact, index) => {
          const Icon = contact.icon;

          return (
            <div
              key={index}
              className="flex flex-col p-5 transition-all duration-300 border shadow-sm group rounded-2xl border-border bg-card hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-xl bg-primary/10 text-primary">
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="mb-1 text-base font-bold text-card-foreground">
                {contact.name}
              </h3>

              <p className="mb-3 text-xs text-muted-foreground">
                {contact.role}
              </p>

              <span className="text-sm font-semibold break-all text-primary">
                {contact.phone}
              </span>
            </div>
          );
        })}
      </div>

      <div
        role="group"
        className="flex flex-col items-center justify-center gap-3 mt-6 sm:flex-row"
      >
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="lg" className="h-12 px-6 rounded-xl">
            <MessageSquareIcon className="w-5 h-5 mr-2" />
            <span>Hubungi via WhatsApp</span>
          </Button>
        </a>

        <Button
          variant="outline"
          size="lg"
          className="h-12 px-6 rounded-xl border-border bg-background hover:bg-muted"
        >
          <ShieldCheckIcon className="w-5 h-5 mr-2" />
          <span>Masuk Admin</span>
        </Button>
      </div>
    </section>
  );
}

export default ContactLanding;
