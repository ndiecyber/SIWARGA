import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CircleQuestionMark, MinusIcon, PlusIcon } from "lucide-react";
import React from "react";

const FAQItems = [
  {
    question: "Siapa saja yang bisa menggunakan SIWARGA?",
    answer:
      "SIWARGA dapat digunakan oleh seluruh warga terdaftar RT 04. Terdapat dua jenis akun: akun warga (memantau informasi pribadi) dan akun admin (pengurus RT mengelola data).",
  },
  {
    question: "Bagaimana cara mendaftar sebagai warga baru?",
    answer:
      "Warga baru mendaftar melalui halaman Daftar Warga dengan mengisi NIK, nomor rumah, dan data diri. Pengurus RT akan memverifikasi dan mengaktifkan akun dalam 1×24 jam.",
  },
  {
    question: "Apakah data pribadi saya aman?",
    answer:
      "Ya. Data warga dikelola secara lokal oleh pengurus RT dan hanya dapat diakses oleh admin terverifikasi. Warga hanya dapat melihat data miliknya sendiri.",
  },
  {
    question: "Apakah SIWARGA bisa diakses dari HP?",
    answer:
      "SIWARGA dirancang responsif dan dapat diakses nyaman melalui browser HP (Chrome, Safari, dll.) tanpa perlu mengunduh aplikasi. Tampilan warga dioptimalkan untuk layar mobile.",
  },
  {
    question: "Kapan iuran bulanan jatuh tempo?",
    answer:
      "Iuran bulanan sebesar Rp 25.000 jatuh tempo setiap tanggal 10. Pembayaran dapat dilakukan ke bendahara RT atau transfer ke rekening BRI RT 04 a.n. RT 04 Arjamukti.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24" id="faq">
      <div className="mx-auto max-w-275 px-6">
        <div className="text-center space-y-6">
          <Badge className="inline-flex items-center gap-1.5 rounded-[20px] border px-3.5 py-1.25 text-[12px] font-semibold uppercase tracking-[0.4px] border-primary/20 bg-secondary text-primary">
            <CircleQuestionMark /> <span className="text-primary">FAQ</span>
          </Badge>
          <h2
            className={cn(
              "text-[clamp(32px,5vw,52px)] font-semibold leading-[1.15] tracking-[-0.5px] text-foreground ",
            )}
          >
            Pertanyaan yang
            <br />
            <em className="italic text-primary font-fraunces">
              sering ditanyakan
            </em>
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-175">
          <Accordion type="single" collapsible>
            {FAQItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-[16px]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[14px]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
