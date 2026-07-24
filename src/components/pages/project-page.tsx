"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  FolderGit2,
  Calendar,
  User,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

interface Project {
  id: number;
  slug: string;
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
  client: string | null;
  category: string;
  technologies: string;
  image: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  externalUrl: string | null;
}

interface DummyProject {
  id: number;
  slug: string;
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
  client: string;
  category: string;
  technologies: string;
  image: null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  externalUrl: null;
}

const DUMMY_PROJECTS: DummyProject[] = [
  {
    id: -1,
    slug: "sistem-manajemen-inventaris",
    titleId: "Sistem Manajemen Inventaris Terintegrasi",
    titleEn: "Integrated Inventory Management System",
    descriptionId:
      "Pengembangan sistem manajemen inventaris end-to-end untuk perusahaan manufaktur terkemuka. Sistem ini mengotomatiskan pelacakan stok, manajemen gudang, dan generasi laporan real-time yang terintegrasi langsung dengan laporan keuangan.",
    descriptionEn:
      "End-to-end inventory management system development for a leading manufacturing company. The system automates stock tracking, warehouse management, and real-time report generation integrated directly with financial reporting.",
    client: "PT. Manufaktur Jaya Abadi",
    category: "ERP System",
    technologies: "React, Node.js, MariaDB, Tailwind CSS, WebSocket",
    image: null,
    status: "completed",
    startDate: "2024-03-01",
    endDate: "2024-09-30",
    externalUrl: null,
  },
  {
    id: -2,
    slug: "aplikasi-ecommerce-mobile",
    titleId: "Aplikasi E-Commerce Mobile",
    titleEn: "Mobile E-Commerce Application",
    descriptionId:
      "Pembangunan aplikasi e-commerce cross-platform untuk jaringan ritel fashion. Fitur meliputi katalog produk, keranjang belanja, pembayaran terintegrasi, program loyalitas, dan dashboard admin untuk manajemen order.",
    descriptionEn:
      "Cross-platform e-commerce application development for a fashion retail network. Features include product catalog, shopping cart, integrated payment, loyalty program, and admin dashboard for order management.",
    client: "TokoBagus Fashion",
    category: "Mobile App",
    technologies: "React Native, Express.js, PostgreSQL, Redis, Stripe",
    image: null,
    status: "completed",
    startDate: "2024-01-15",
    endDate: "2024-06-20",
    externalUrl: null,
  },
  {
    id: -3,
    slug: "dashboard-analytics-realtime",
    titleId: "Dashboard Analytics Real-time",
    titleEn: "Real-time Analytics Dashboard",
    descriptionId:
      "Pembuatan dashboard analitik real-time untuk perusahaan logistik. Menampilkan visualisasi data pengiriman, tracking armada, analitik rute, dan predictive maintenance dengan integrasi GPS dan sensor IoT.",
    descriptionEn:
      "Real-time analytics dashboard creation for a logistics company. Displays delivery data visualization, fleet tracking, route analytics, and predictive maintenance with GPS and IoT sensor integration.",
    client: "DataVision Corp",
    category: "Web Application",
    technologies: "Next.js, Chart.js, WebSocket, Prisma, Mapbox GL",
    image: null,
    status: "ongoing",
    startDate: "2025-02-01",
    endDate: null,
    externalUrl: null,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" as const },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Web Application": FolderGit2,
  "Mobile App": Layers,
  "ERP System": FolderGit2,
  "Custom Software": FolderGit2,
};

function getStatusBadge(status: string, t: (key: string) => string) {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    ongoing: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      label: t("project.card.ongoing"),
    },
    completed: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      label: t("project.card.completed"),
    },
    upcoming: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      label: t("project.card.upcoming"),
    },
  };
  return badges[status] || badges.completed;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ProjectPage() {
  const { t, locale } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/project?active=true");
        const data = await res.json();
        const apiProjects = data.projects || [];
        setProjects(apiProjects.length > 0 ? apiProjects : DUMMY_PROJECTS);
      } catch {
        setProjects(DUMMY_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, [projects.length]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  // Auto-slide every 5 seconds, pause on hover
  useEffect(() => {
    if (projects.length <= 1 || paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [projects.length, paused]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-foreground/50">Loading...</div>
      </div>
    );
  }

  const project = projects[current];
  if (!project) return null;

  const title = locale === "en" ? project.titleEn : project.titleId;
  const description =
    locale === "en" ? project.descriptionEn : project.descriptionId;
  const statusBadge = getStatusBadge(project.status, t);
  const CatIcon = CATEGORY_ICONS[project.category] || FolderGit2;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-background via-background to-primary/5 py-24 sm:py-32">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <FolderGit2 className="h-4 w-4" />
              {locale === "en" ? "Our Work" : "Portofolio Kami"}
            </motion.div>

            <h1
              className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              {t("project.hero.title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t("project.hero.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Carousel */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <FolderGit2 className="mx-auto h-12 w-12 text-foreground/20" />
              <p className="mt-4 text-lg font-medium text-foreground/50">
                {t("project.empty.title")}
              </p>
              <p className="mt-1 text-sm text-foreground/40">
                {t("project.empty.description")}
              </p>
            </div>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Slide */}
              <div className="overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="flex flex-col gap-8 overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 lg:flex-row"
                  >
                    {/* Image Side */}
                    <div className="flex-shrink-0 lg:w-2/5">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-foreground/5 lg:aspect-[4/3]">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-3">
                            <CatIcon className="h-20 w-20 text-foreground/8" />
                            <span className="text-xs font-medium text-foreground/20">
                              {project.category}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusBadge.bg} ${statusBadge.text}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="mb-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {project.category}
                        </span>
                      </div>

                      <h3
                        className="mb-3 text-2xl font-bold text-foreground sm:text-3xl"
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        {title}
                      </h3>

                      <p className="mb-6 text-base leading-relaxed text-foreground/60">
                        {description}
                      </p>

                      <div className="mb-6 space-y-3">
                        {project.client && (
                          <div className="flex items-center gap-3 text-sm text-foreground/60">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5">
                              <User className="h-4 w-4 text-foreground/40" />
                            </div>
                            <div>
                              <span className="text-xs text-foreground/40">
                                {t("project.card.client")}
                              </span>
                              <p className="font-medium text-foreground/80">
                                {project.client}
                              </p>
                            </div>
                          </div>
                        )}

                        {project.technologies && (
                          <div className="flex items-center gap-3 text-sm text-foreground/60">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5">
                              <Layers className="h-4 w-4 text-foreground/40" />
                            </div>
                            <div>
                              <span className="text-xs text-foreground/40">
                                {t("project.card.technologies")}
                              </span>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {project.technologies.split(",").map((tech) => (
                                  <span
                                    key={tech.trim()}
                                    className="inline-block rounded-md bg-foreground/5 px-2 py-0.5 text-xs font-medium text-foreground/60"
                                  >
                                    {tech.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {project.startDate && (
                          <div className="flex items-center gap-3 text-sm text-foreground/60">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5">
                              <Calendar className="h-4 w-4 text-foreground/40" />
                            </div>
                            <div>
                              <span className="text-xs text-foreground/40">
                                {t("project.card.period")}
                              </span>
                              <p className="font-medium text-foreground/80">
                                {formatDate(project.startDate)}
                                {project.endDate &&
                                  ` — ${formatDate(project.endDate)}`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {project.externalUrl && (
                        <div>
                          <a
                            href={project.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground/70 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {t("project.card.viewProject")}
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Arrows */}
              {projects.length > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4 lg:hidden">
                  <button
                    onClick={goPrev}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground/60 shadow-md transition-all hover:border-primary/30 hover:text-primary"
                    aria-label="Previous project"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goNext}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground/60 shadow-md transition-all hover:border-primary/30 hover:text-primary"
                    aria-label="Next project"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Dots */}
              {projects.length > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  {projects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        idx === current
                          ? "w-10 bg-primary"
                          : "w-3 bg-foreground/15 hover:bg-foreground/30"
                      }`}
                      aria-label={`Go to project ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2
              className="mb-6 text-3xl font-bold md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {t("project.cta.title")}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
              {t("project.cta.description")}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-green px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-green/90 active:scale-[0.98]"
            >
              {t("project.cta.button")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
