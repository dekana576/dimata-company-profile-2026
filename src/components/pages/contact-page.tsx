"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowUpRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import WhatsAppFloat from "@/components/ui/whatsapp-float";
import { useLanguage } from "@/contexts/language-context";

/* ─── Animation ─── */

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" as const },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

/* ─── Data ─── */

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "marketing@dimata.com",
    href: "mailto:marketing@dimata.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+62 81125031177",
    href: "tel:+6281125031177",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Jl. Danau Tempe 21A, Sidakarya, Denpasar, Bali 80224",
    href: null,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Monday - Friday: 9:00 AM - 5:00 PM",
    href: null,
  },
];

type FormStatus = "idle" | "loading" | "success" | "error";

/* ─── Page Component ─── */

export default function ContactPage() {
  const [status, setStatus] = useState<{
    type: FormStatus;
    message: string;
  }>({ type: "idle", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLanguage();

  const validate = (data: { name: string; email: string; message: string }) => {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Name is required";
    if (!data.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Please enter a valid email address";
    if (!data.message.trim()) e.message = "Message is required";
    else if (data.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      subject: (formData.get("subject") as string) || "",
      message: (formData.get("message") as string) || "",
    };

    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setStatus({ type: "loading", message: "Sending..." });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send message");
      }

      setStatus({
        type: "success",
        message:
          "Pesan Anda telah diterima! Kami akan segera menghubungi Anda.",
      });
      form.reset();
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Pesan Anda tidak dapat dikirim saat ini. Silakan periksa koneksi Anda dan coba lagi.",
      });
    }
  };

  return (
    <main className='flex-1'>
      <WhatsAppFloat />
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className='relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-28'
      >
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className='mx-auto max-w-3xl text-center'
          >
            <h1 className='text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl'>
              {t("contact.hero.title")} <span className='text-primary'>{t("contact.hero.titleHighlight")}</span>
            </h1>
            <p className='mt-6 text-lg leading-relaxed text-muted-foreground'>
              {t("contact.hero.description")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Info + Form */}
      <section className='py-20 md:py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-16'>
            {/* Left — Contact Information */}
            <motion.div {...fadeUp}>
              <h2 className='text-2xl font-bold text-foreground md:text-3xl'>
                {t("contact.info.title")}
              </h2>
              <p className='mt-3 text-muted-foreground'>
                {t("contact.info.description")}
              </p>

              <ul className='mt-8 space-y-5'>
                {CONTACT_INFO.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className='flex items-start gap-4'>
                      <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
                        <Icon className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>
                          {item.label}
                        </p>
                        <p className='mt-0.5 text-foreground'>{item.value}</p>
                      </div>
                    </div>
                  );

                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          className='block rounded-xl transition-colors hover:bg-muted/50'
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className='mt-8 rounded-xl border border-border bg-muted/50 p-5'>
                <p className='text-sm text-muted-foreground'>
                  {t("contact.info.urgent")}
                </p>
                <div className='mt-2 flex flex-wrap gap-3'>
                  <a
                    href='mailto:marketing@dimata.com'
                    className='inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline'
                  >
                    marketing@dimata.com
                    <ArrowUpRight className='h-3.5 w-3.5' />
                  </a>
                  <a
                    href='tel:+6281125031177'
                    className='inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline'
                  >
                    +62 81125031177
                    <ArrowUpRight className='h-3.5 w-3.5' />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right — Contact Form */}
            <motion.div {...fadeUp}>
              <div className='rounded-2xl border border-border bg-card p-8'>
                <h2 className='text-2xl font-bold text-foreground'>
                  {t("contact.form.title")}
                </h2>

                <form onSubmit={handleSubmit} className='mt-6 space-y-5'>
                  {/* Name */}
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-foreground'
                    >
                      {t("contact.form.name")}
                    </label>
                    <input
                      id='name'
                      name='name'
                      type='text'
                      required
                      placeholder={t("contact.form.namePlaceholder")}
                      className='mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                    />
                    {errors.name && (
                      <p className='mt-1 text-xs text-destructive'>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-foreground'
                    >
                      Email
                    </label>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      required
                      placeholder='your.email@example.com'
                      className='mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                    />
                    {errors.email && (
                      <p className='mt-1 text-xs text-destructive'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor='subject'
                      className='block text-sm font-medium text-foreground'
                    >
                      {t("contact.form.subject")}{" "}
                      <span className='text-muted-foreground'>({t("contact.form.optional")})</span>
                    </label>
                    <input
                      id='subject'
                      name='subject'
                      type='text'
                      placeholder={t("contact.form.subjectPlaceholder")}
                      className='mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor='message'
                      className='block text-sm font-medium text-foreground'
                    >
                      {t("contact.form.message")}
                    </label>
                    <textarea
                      id='message'
                      name='message'
                      rows={5}
                      required
                      placeholder={t("contact.form.messagePlaceholder")}
                      className='mt-1.5 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                    />
                    {errors.message && (
                      <p className='mt-1 text-xs text-destructive'>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type='submit'
                    disabled={status.type === "loading"}
                    className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {status.type === "loading" ? (
                      t("contact.form.sending")
                    ) : (
                      <>
                        {t("contact.form.submit")}
                        <Send className='h-4 w-4' />
                      </>
                    )}
                  </button>

                  {/* Status Message */}
                  {status.type !== "idle" && status.type !== "loading" && (
                    <div
                      className={`flex items-center gap-2 rounded-xl p-3 text-sm ${
                        status.type === "success"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {status.type === "success" ? (
                        <CheckCircle className='h-4 w-4 shrink-0' />
                      ) : (
                        <XCircle className='h-4 w-4 shrink-0' />
                      )}
                      {status.message}
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visit Our Office */}
      <section className='bg-muted py-20 md:py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div {...fadeUp} className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
              {t("contact.visit.title")}
            </h2>
            <p className='mt-4 text-lg text-muted-foreground'>
              {t("contact.visit.description")}
            </p>
          </motion.div>

          <motion.div {...fadeUp} className='mt-10'>
            <div className='overflow-hidden rounded-2xl border border-border'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12492.605!2d115.2394689!3d-8.7058704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd240f2a46e6c7b%3A0x440fcb4f4a5e5b00!2sJl.%20Danau%20Tempe%2C%20Sidakarya%2C%20Kec.%20Denpasar%20Sel.%2C%20Kota%20Denpasar%2C%20Bali%2080224!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid'
                width='100%'
                height='450'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='DIMATA IT Solutions Office Location'
                className='h-[350px] w-full md:h-[450px]'
              />
            </div>
            <div className='mt-4 flex items-center justify-center gap-2 text-muted-foreground'>
              <MapPin className='h-4 w-4 text-primary' />
              <span className='text-sm'>
                Jl. Danau Tempe 21A, Sidakarya, Denpasar, Bali 80224
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
