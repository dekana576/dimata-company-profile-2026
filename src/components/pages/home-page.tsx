import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Radio,
  Award,
  Users,
  Clock,
  Workflow,
  Fingerprint,
  LineChart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Homepage — DIMATA IT Solutions
 *
 * Semua section (Hero, Stats, Products) digabung dalam satu file ini sesuai
 * permintaan. Konten diambil dari halaman resmi dimata.com yang di-upload
 * (title, angka, deskripsi produk) — tidak ada data yang dikarang.
 */

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { icon: Award, value: "20+", label: "Years of Experience" },
  { icon: Users, value: "197+", label: "Satisfied Clients" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

interface Product {
  number: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

const PRODUCTS: Product[] = [
  {
    number: "01",
    name: "ProChain",
    description: "Operational structure management",
    icon: Workflow,
  },
  {
    number: "02",
    name: "Hanoman",
    description: "Guest data and POS management",
    icon: Users,
  },
  {
    number: "03",
    name: "Hairisma",
    description: "Attendance and performance tracking",
    icon: Fingerprint,
  },
  {
    number: "04",
    name: "AISO",
    description: "Real-time financial reporting",
    icon: LineChart,
  },
];

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-28">
          {/* Kolom teks */}
          <div>

            <h1 className="mt-6 font-display text-[40px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[52px] lg:text-[56px]">
              Digitalization
              <br />
              for All
            </h1>

            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-foreground/60">
              Transform your business with innovative IT solutions. We help
              companies modernize operations, streamline processes, and
              achieve digital excellence.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-medium bg-accent px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Contact Us
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center justify-center gap-1.5 rounded-medium border border-teal px-6 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-mint"
              >
                View Solutions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Kolom visual: kolase kartu dashboard (AISO + ProChain + trust badge + live indicator) */}
          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-square">
              {/* Kartu utama: mock laporan keuangan (AISO) */}
              <div className="absolute inset-x-4 top-4 bottom-16 rounded-[24px] border border-teal bg-mint p-6 shadow-sm sm:inset-x-10 lg:inset-x-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-foreground/50">
                      Financial Reporting
                    </p>
                    <p className="font-mono text-[22px] font-semibold text-foreground">
                      AISO
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 text-[12px] font-medium text-foreground/60">
                    <Radio className="h-3 w-3 animate-pulse text-accent" />
                    Real-time
                  </span>
                </div>

                <div className="mt-8 flex h-32 items-end gap-2.5">
                  {[38, 62, 46, 80, 58, 94, 70].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-background"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className={`h-1.5 rounded-t-md ${
                          i === 5 ? "bg-accent" : "bg-teal"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-teal pt-4">
                  <p className="text-[13px] text-foreground/50">
                    Operational structure
                  </p>
                  <p className="font-mono text-[15px] font-semibold text-foreground">
                    ProChain
                  </p>
                </div>
              </div>

              {/* Badge melayang: trust indicator */}
              <div className="absolute -right-2 top-8 rounded-2xl border border-teal bg-background p-4 shadow-md sm:right-2">
                <p className="font-mono text-[28px] font-semibold leading-none text-accent">
                  197+
                </p>
                <p className="mt-1.5 text-[13px] text-foreground/60">
                  Klien Dipercaya
                </p>
              </div>

              {/* Badge melayang: uptime */}
              <div className="absolute bottom-0 left-0 flex items-center gap-2.5 rounded-2xl border border-teal bg-background px-4 py-3 shadow-md sm:left-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                <p className="text-[13px] font-medium text-foreground">
                  24/7 Support Online
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="border-t border-separator bg-mint/40">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="flex items-baseline gap-3">
              <span className="text-[13px] font-medium uppercase tracking-wide text-foreground/50">
                Trusted by
              </span>
              <span className="font-mono text-[26px] font-semibold text-foreground">
                197+
              </span>
              <span className="text-[15px] text-foreground/70">
                Klien Dipercaya
              </span>
            </div>
            <p className="max-w-xl text-[14px] leading-relaxed text-foreground/60">
              Businesses across Indonesia trust DIMATA for their digital
              transformation journey.
            </p>
          </div>
        </div>
      </section>

      {/* ================= STATS ("Why choose DIMATA?") ================= */}
      <section className="border-y border-separator bg-mint">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[38px]">
              Why choose DIMATA?
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-foreground/60">
              Since 2002, we have been helping businesses grow through
              innovative technology solutions and dedicated support.
            </p>
          </div>

          <dl className="mx-auto mt-14 grid max-w-4xl grid-cols-1 divide-y divide-teal overflow-hidden rounded-[20px] border border-teal bg-background sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 px-8 py-10 text-center"
              >
                <Icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
                <dd className="font-mono text-[36px] font-semibold leading-none text-foreground">
                  {value}
                </dd>
                <dt className="text-[14px] font-medium text-foreground/60">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[38px]">
              Complete digital solutions for modern businesses
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-foreground/60">
              From operational management to financial reporting, our suite
              of products helps you run your business more efficiently.
            </p>
            <Link
              href="/solutions"
              className="mt-7 inline-flex items-center justify-center gap-1.5 rounded-medium bg-accent px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Explore Our Solutions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map(({ number, name, description, icon: Icon }) => (
              <div
                key={name}
                className="group relative flex flex-col rounded-[20px] border border-teal bg-mint/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-mint hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-medium bg-background text-foreground">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-[13px] font-medium text-foreground/30">
                    {number}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-[19px] font-semibold text-foreground">
                  {name}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground/60">
                  {description}
                </p>

                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
