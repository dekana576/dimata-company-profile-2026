"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  MapPin,
  Briefcase,
  Clock,
  HeartPulse,
  CalendarDays,
  GraduationCap,
  Users,
  Rocket,
  Layers,
  TrendingUp,
  FileText,
  MessagesSquare,
  Award,
  Mail,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/fragments/scroll-motion";
import { AnimatedBackground } from "@/components/fragments/animated-background";
import { useTranslation } from "@/hooks/use-translation";

interface Department {
  id: number;
  nameId: string;
  nameEn: string;
  sortOrder: number;
  isActive: boolean;
}

interface Job {
  id: number;
  slug: string;
  titleId: string;
  titleEn: string;
  departmentId: number;
  department: Department;
  location: string;
  type: string;
  summaryId: string;
  summaryEn: string;
  responsibilitiesId: string;
  responsibilitiesEn: string;
  requirementsId: string;
  requirementsEn: string;
  applyUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

const VALUE_PROPS_META: { icon: LucideIcon; keyIndex: number }[] = [
  { icon: Rocket, keyIndex: 0 },
  { icon: Layers, keyIndex: 1 },
  { icon: TrendingUp, keyIndex: 2 },
  { icon: Clock, keyIndex: 3 },
];

const BENEFITS_META: { icon: LucideIcon; keyIndex: number }[] = [
  { icon: HeartPulse, keyIndex: 0 },
  { icon: CalendarDays, keyIndex: 1 },
  { icon: GraduationCap, keyIndex: 2 },
  { icon: Clock, keyIndex: 3 },
  { icon: Users, keyIndex: 4 },
];

const HIRING_STEPS_META: { icon: LucideIcon; keyIndex: number }[] = [
  { icon: FileText, keyIndex: 0 },
  { icon: MessagesSquare, keyIndex: 1 },
  { icon: Users, keyIndex: 2 },
  { icon: Award, keyIndex: 3 },
];

const FAQS_META = [0, 1, 2, 3, 4];

function DepartmentBadge({ department }: { department: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-[12px] font-medium text-foreground/70">
      <Briefcase className="h-3 w-3 text-foreground/40" />
      {department}
    </span>
  );
}

export default function CareersPage() {
  const { t, locale } = useTranslation();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDept, setActiveDept] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const getDeptName = (dept: Department) => locale === "en" ? dept.nameEn : dept.nameId;
  const getJobTitle = (job: Job) => locale === "en" ? job.titleEn : job.titleId;
  const getJobSummary = (job: Job) => locale === "en" ? job.summaryEn : job.summaryId;
  const getJobResponsibilities = (job: Job) => locale === "en" ? job.responsibilitiesEn : job.responsibilitiesId;
  const getJobRequirements = (job: Job) => locale === "en" ? job.requirementsEn : job.requirementsId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, jobRes] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/jobs?active=true"),
        ]);
        const deptData = await deptRes.json();
        const jobData = await jobRes.json();
        setDepartments((deptData.departments || []).filter((d: Department) => d.isActive));
        setJobs(jobData.jobs || []);
      } catch (err) {
        console.error("Error fetching career data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeDepartments = useMemo(
    () => departments.filter((d) => d.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [departments],
  );

  const filteredJobs = useMemo(
    () => (activeDept === "all" ? jobs : jobs.filter((j) => getDeptName(j.department) === activeDept)),
    [activeDept, jobs, locale],
  );

  const handleSelectDept = (dept: string) => {
    setActiveDept(dept);
    setSelectedJob(null);
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApply = (job: Job) => {
    if (job.applyUrl) {
      window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    } else {
      const subject = locale === "en" ? `Application — ${getJobTitle(job)}` : `Lamaran — ${getJobTitle(job)}`;
      window.location.href = `mailto:karir@dimata.id?subject=${encodeURIComponent(subject)}`;
    }
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  useEffect(() => {
    if (selectedJob) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedJob]);

  useEffect(() => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      container.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  const parseJsonArray = (json: string): string[] => {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* ================= HERO SECTION ================= */}
      <section className="relative isolate min-h-[95vh] flex items-center bg-background overflow-hidden">
        <AnimatedBackground />
        <div className="absolute inset-0 lg:left-[35%] z-0">
          <Image
            src="/img/career/career.png"
            alt={t("career.hero.imageAlt")}
            fill
            className="object-cover object-center lg:object-left"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent lg:via-background/70" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 w-full mx-auto max-w-7xl px-6 py-20 lg:py-32">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            <Reveal from="up">
              <h1 className="font-display text-[42px] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-[56px] lg:text-[64px] drop-shadow-sm">
                {t("career.hero.title.0")} <br />
                <span className="text-transparent bg-clip-text bg-blue-400">
                  {t("career.hero.title.1")}
                </span>
              </h1>
              <p className="mt-6 text-[18px] leading-relaxed text-foreground/70 max-w-lg lg:text-foreground/80 font-medium">
                {t("career.hero.subtitle")}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#posisi-terbuka"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-[15px] font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-105"
                >
                  {t("career.hero.cta.openings")}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-foreground/20 bg-background/50 backdrop-blur-sm px-8 py-4 text-[15px] font-semibold text-foreground transition-all hover:bg-background/80"
                >
                  {t("career.hero.cta.about")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPS ================= */}
      <section className="bg-foreground/5 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[40px]">
              {t("career.values.sectionTitle")}
            </h2>
            <p className="mt-4 text-[16px] text-foreground/60">
              {t("career.values.sectionDesc")}
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS_META.map(({ icon: Icon, keyIndex }, i) => (
              <Reveal key={keyIndex} delay={i * 100} className="relative group">
                <div className="absolute inset-0 bg-background rounded-3xl shadow-sm transition-transform duration-300" />
                <div className="relative p-8 flex flex-col h-full border border-foreground/10 rounded-3xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-6 shadow-md">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-[18px] font-semibold text-foreground mb-3">
                    {t(`career.values.${keyIndex}.title`)}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-foreground/60">
                    {t(`career.values.${keyIndex}.desc`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HIRING PROCESS ================= */}
      <section className="bg-foreground/5 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Reveal>
              <h2 className="font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[40px]">
                {t("career.process.sectionTitle")}
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-foreground/60 max-w-md">
                {t("career.process.sectionDesc")}
              </p>
              
              <div className="mt-12 space-y-6">
                <h3 className="font-semibold text-foreground text-[18px]">
                  {t("career.process.benefitsTitle")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BENEFITS_META.map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className="flex gap-3 items-start p-4 bg-background rounded-2xl border border-foreground/10">
                        <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-[14px] text-foreground">
                            {t(`career.benefits.${b.keyIndex}.title`)}
                          </p>
                          <p className="text-[12px] text-foreground/50 mt-1 leading-snug">
                            {t(`career.benefits.${b.keyIndex}.desc`)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <div className="relative border-l-2 border-primary/20 ml-4 lg:ml-10 space-y-12 pb-8">
              {HIRING_STEPS_META.map(({ icon: Icon, keyIndex }, i) => (
                <Reveal key={keyIndex} delay={i * 100} className="relative pl-10">
                  <span className="absolute -left-[21px] top-0 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary text-primary shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-bold text-primary uppercase">
                      {t("career.process.stepLabel")} 0{i + 1}
                    </span>
                    <h3 className="font-display text-[20px] font-semibold text-foreground">
                      {t(`career.steps.${keyIndex}.title`)}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-foreground/60">
                      {t(`career.steps.${keyIndex}.desc`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= OPEN POSITIONS ================= */}
      <section id="posisi-terbuka" className="py-24 sm:py-32 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center mb-12">
            <h2 className="font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[40px]">
              {t("career.openings.sectionTitle")}
            </h2>
            <p className="mt-4 text-[16px] text-foreground/60">
              {t("career.openings.sectionDesc")}
            </p>
          </Reveal>

          {/* Filters */}
          {!loading && (
            <Reveal delay={100} className="flex flex-wrap justify-center gap-2 mb-12">
              <button
                onClick={() => handleSelectDept("all")}
                className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 ${
                  activeDept === "all"
                    ? "bg-foreground text-background shadow-md scale-105"
                    : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                }`}
              >
                {t("career.openings.departments.all")}
              </button>
              {activeDepartments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleSelectDept(getDeptName(dept))}
                  className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 ${
                    activeDept === getDeptName(dept)
                      ? "bg-foreground text-background shadow-md scale-105"
                      : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                  }`}
                >
                  {getDeptName(dept)}
                </button>
              ))}
            </Reveal>
          )}

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="col-span-full py-12 text-center text-foreground/50">
                Loading...
              </p>
            ) : filteredJobs.length === 0 ? (
              <p className="col-span-full py-12 text-center text-foreground/50">
                {locale === "en" ? "No positions available for this department" : "Belum ada job untuk posisi ini"}
              </p>
            ) : (
              filteredJobs.map((job, i) => (
                <Reveal key={job.id} delay={(i % 6) * 50}>
                  <button
                    onClick={() => handleSelectJob(job)}
                    className="group flex h-full w-full flex-col gap-4 rounded-3xl border border-foreground/10 bg-background p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Briefcase className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <span className="rounded-md bg-foreground/5 px-2.5 py-1 text-[11px] font-bold text-foreground/60 uppercase tracking-wider">
                        {job.type}
                      </span>
                    </div>

                    <div className="mt-2">
                      <h3 className="font-display text-[18px] font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                        {getJobTitle(job)}
                      </h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-foreground/60 line-clamp-2">
                        {getJobSummary(job)}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-5 border-t border-foreground/5">
                      <DepartmentBadge department={getDeptName(job.department)} />
                      <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground/50">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[13px] font-semibold text-primary pt-2 opacity-80 group-hover:opacity-100">
                      <span>{t("career.openings.seeDetail")}</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowRight className="h-4 w-4 -rotate-45" />
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ================= JOB DETAIL MODAL (POP-UP) ================= */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:py-12 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={closeModal}
            aria-hidden="true"
          />
          
          <div className="relative z-10 w-full max-w-3xl max-h-full overflow-y-auto rounded-[2rem] border border-foreground/10 bg-background shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-foreground/10 bg-background/95 px-6 py-5 backdrop-blur-md sm:px-10">
              <h3 className="font-display text-[20px] sm:text-[24px] font-bold text-foreground truncate pr-4">
                {getJobTitle(selectedJob)}
              </h3>
              <button
                onClick={closeModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
                aria-label={t("career.modal.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="rounded-md bg-primary/10 px-3 py-1.5 text-[12px] font-bold text-primary uppercase tracking-wider">
                  {selectedJob.type}
                </span>
                <DepartmentBadge department={getDeptName(selectedJob.department)} />
                <span className="flex items-center gap-1.5 text-[14px] text-foreground/60">
                  <MapPin className="h-4 w-4" />
                  {selectedJob.location}
                </span>
              </div>

              <p className="text-[16px] leading-relaxed text-foreground/80 font-medium">
                {getJobSummary(selectedJob)}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="rounded-2xl bg-foreground/5 p-6 border border-foreground/5">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-foreground/50 mb-4 flex items-center gap-2">
                    <span className="h-px w-6 bg-foreground/20" /> {t("career.modal.responsibilities")}
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {parseJsonArray(getJobResponsibilities(selectedJob)).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[14px] leading-relaxed text-foreground/70">
                        <ChevronRight className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-foreground/5 p-6 border border-foreground/5">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-foreground/50 mb-4 flex items-center gap-2">
                    <span className="h-px w-6 bg-foreground/20" /> {t("career.modal.requirements")}
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {parseJsonArray(getJobRequirements(selectedJob)).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[14px] leading-relaxed text-foreground/70">
                        <ChevronRight className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap-reverse items-center justify-end gap-4 pt-6 border-t border-foreground/10">
                <button
                  onClick={closeModal}
                  className="w-full sm:w-auto px-6 py-3.5 text-[15px] font-bold text-foreground/60 transition-colors hover:text-foreground"
                >
                  {t("career.modal.cancel")}
                </button>
                <button
                  onClick={() => handleApply(selectedJob)}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-[15px] font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-1"
                >
                  {t("career.modal.apply")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FAQ ================= */}
      <section className="bg-foreground/5 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <Reveal className="lg:col-span-4">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-primary">{t("career.faq.sectionBadge")}</span>
              <h2 className="mt-3 font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[40px]">
                {t("career.faq.sectionTitle")}
              </h2>
              <p className="mt-4 text-[16px] text-foreground/60">
                {t("career.faq.sectionDesc")}
              </p>
            </Reveal>

            <div className="lg:col-span-8 flex flex-col gap-4">
              {FAQS_META.map((idx, i) => (
                <Reveal key={idx} delay={i * 50}>
                  <details className="group rounded-2xl bg-background border border-foreground/10 p-6 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-[16px] font-semibold text-foreground">
                      {t(`career.faq.${idx}.q`)}
                      <span className="relative h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180">
                        <ChevronDown className="absolute inset-0 h-5 w-5 text-foreground/40" />
                      </span>
                    </summary>
                    <p className="mt-4 text-[15px] leading-relaxed text-foreground/60 border-t border-foreground/5 pt-4">
                      {t(`career.faq.${idx}.a`)}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}
      <section className="relative isolate py-24 sm:py-32 bg-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/10 p-4 mb-6">
            <Mail className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </span>
          <h2 className="font-display text-[36px] font-bold tracking-tight sm:text-[48px]">
            {t("career.cta.title")}
          </h2>
          <p className="mt-6 text-[18px] leading-relaxed text-white/70">
            {t("career.cta.desc")}
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href={`mailto:karir@dimata.id?subject=${encodeURIComponent(t("career.cta.btnGeneralSubject"))}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-[15px] font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-1"
            >
              {t("career.cta.btnGeneral")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
