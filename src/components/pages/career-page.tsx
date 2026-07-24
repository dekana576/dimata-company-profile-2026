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

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Magang" | "Kontrak";
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

const DEPARTMENTS = ["Semua", "Engineering", "Product & Design", "Sales & Marketing", "Operations"];

const JOBS: JobOpening[] = [
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    department: "Engineering",
    location: "Denpasar · Hybrid",
    type: "Full-time",
    summary: "Bangun dan rawat layanan backend yang menopang ProChain, Hairisma, dan AISO.",
    responsibilities: [
      "Merancang dan membangun API yang dipakai lintas produk DIMATA",
      "Menjaga performa dan keandalan sistem yang berjalan 24/7",
      "Berkolaborasi dengan tim produk untuk fitur baru",
    ],
    requirements: [
      "Berpengalaman dengan salah satu: Go, Node.js, atau Python",
      "Familiar dengan database relasional dan desain API",
      "Terbiasa bekerja dengan Git dan proses code review",
    ],
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Denpasar · Hybrid",
    type: "Full-time",
    summary: "Wujudkan antarmuka yang dipakai ratusan bisnis setiap hari, dari dashboard sampai POS.",
    responsibilities: [
      "Membangun antarmuka dengan React/Next.js dan Tailwind",
      "Menerjemahkan desain jadi komponen yang rapi dan reusable",
      "Menjaga performa halaman di perangkat dengan koneksi terbatas",
    ],
    requirements: [
      "Berpengalaman dengan React dan TypeScript",
      "Paham dasar UX — tahu kapan sebuah interaksi terasa janggal",
      "Terbiasa bekerja dari desain di Figma",
    ],
  },
  {
    id: "qa-engineer",
    title: "QA Engineer",
    department: "Engineering",
    location: "Denpasar",
    type: "Full-time",
    summary: "Pastikan setiap fitur yang rilis tidak mengganggu transaksi bisnis yang sedang berjalan.",
    responsibilities: [
      "Menyusun test case untuk fitur baru dan regresi",
      "Menjalankan pengujian manual dan otomatis sebelum rilis",
      "Melaporkan bug dengan detail yang jelas ke tim engineering",
    ],
    requirements: [
      "Familiar dengan proses QA manual maupun automation dasar",
      "Teliti dan terbiasa berpikir dari sisi skenario pengguna",
      "Nilai plus: pernah menguji aplikasi POS, HRIS, atau akuntansi",
    ],
  },
  {
    id: "product-designer",
    title: "Product Designer (UI/UX)",
    department: "Product & Design",
    location: "Denpasar",
    type: "Full-time",
    summary: "Desain alur kerja yang dipakai kasir, HR, dan pemilik bisnis — bukan sekadar tampilan cantik.",
    responsibilities: [
      "Merancang wireframe dan UI untuk fitur di keempat produk DIMATA",
      "Melakukan riset singkat ke pengguna untuk validasi alur",
      "Menjaga konsistensi design system lintas produk",
    ],
    requirements: [
      "Punya portofolio desain produk (bukan hanya visual/branding)",
      "Terbiasa dengan Figma dan prinsip dasar design system",
      "Bisa menjelaskan alasan di balik keputusan desain",
    ],
  },
  {
    id: "sales-executive",
    title: "Sales Executive (B2B SaaS)",
    department: "Sales & Marketing",
    location: "Denpasar / Jakarta",
    type: "Full-time",
    summary: "Kenalkan ProChain, Hanoman, Hairisma, dan AISO ke bisnis yang masih serba manual.",
    responsibilities: [
      "Mencari dan menindaklanjuti prospek bisnis baru",
      "Melakukan demo produk sesuai kebutuhan calon klien",
      "Menjaga hubungan dengan klien selama proses onboarding awal",
    ],
    requirements: [
      "Pengalaman sales, lebih disukai di bidang software/teknologi",
      "Komunikatif dan nyaman melakukan presentasi ke klien",
      "Punya kendaraan sendiri untuk kunjungan klien",
    ],
  },
  {
    id: "customer-success",
    title: "Customer Success Specialist",
    department: "Operations",
    location: "Denpasar",
    type: "Full-time",
    summary: "Pastikan bisnis yang sudah pakai sistem DIMATA benar-benar terbantu, bukan cuma terdaftar.",
    responsibilities: [
      "Mendampingi klien di masa-masa awal pakai produk",
      "Menjawab pertanyaan dan menyelesaikan kendala penggunaan",
      "Mengumpulkan masukan klien untuk tim produk",
    ],
    requirements: [
      "Sabar, komunikatif, dan senang membantu menyelesaikan masalah",
      "Terbiasa menggunakan aplikasi berbasis web/mobile",
      "Nilai plus: pernah bekerja di bidang F&B, retail, atau hospitality",
    ],
  },
  {
    id: "implementation-specialist",
    title: "Implementation & Onboarding Specialist",
    department: "Operations",
    location: "Denpasar",
    type: "Full-time",
    summary: "Bantu bisnis pindah dari cara manual ke sistem DIMATA, dari setup sampai siap pakai.",
    responsibilities: [
      "Melakukan setup data awal (karyawan, menu, produk, dll.)",
      "Melatih tim klien menggunakan produk yang relevan",
      "Berkoordinasi dengan tim teknis untuk kebutuhan khusus klien",
    ],
    requirements: [
      "Terorganisir dan detail terhadap data",
      "Nyaman menjelaskan hal teknis dengan cara yang sederhana",
      "Bersedia melakukan kunjungan ke lokasi klien bila diperlukan",
    ],
  },
  {
    id: "intern-web-developer",
    title: "Internship Web Developer",
    department: "Engineering",
    location: "Denpasar",
    type: "Magang",
    summary: "Belajar langsung di tim yang membangun produk yang benar-benar dipakai, bukan proyek simulasi.",
    responsibilities: [
      "Membantu pengembangan fitur kecil di bawah bimbingan mentor",
      "Ikut serta dalam code review dan diskusi teknis tim",
      "Belajar proses kerja tim engineering dari dekat",
    ],
    requirements: [
      "Mahasiswa aktif atau fresh graduate jurusan terkait",
      "Familiar dengan HTML, CSS, JavaScript, dan dasar framework modern",
      "Mau belajar dan terbuka menerima masukan",
    ],
  },
];

interface ValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
}

const VALUE_PROPS: ValueProp[] = [
  {
    icon: Rocket,
    title: "Kerjaan yang benar-benar dipakai",
    description: "Yang kamu bangun bukan proyek internal — langsung dipakai bisnis nyata, tiap hari.",
  },
  {
    icon: Layers,
    title: "Lintas produk sejak awal",
    description: "ProChain, Hanoman, Hairisma, AISO — satu tim kecil, cakupan kerja yang luas.",
  },
  {
    icon: TrendingUp,
    title: "Karir yang bergerak cepat",
    description: "Tim masih ramping, jadi tanggung jawab dan kesempatan berkembang datang lebih awal.",
  },
  {
    icon: Clock,
    title: "Fleksibel, dinilai dari hasil",
    description: "Jam kerja fleksibel — yang penting kerjaan selesai dan sistem tetap jalan.",
  },
];

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: HeartPulse,
    title: "Asuransi Kesehatan",
    description: "BPJS Kesehatan & Ketenagakerjaan sesuai ketentuan yang berlaku.",
  },
  {
    icon: CalendarDays,
    title: "Cuti Tahunan",
    description: "Cuti tahunan penuh setelah masa kerja minimal terpenuhi.",
  },
  {
    icon: GraduationCap,
    title: "Anggaran Belajar",
    description: "Dukungan untuk kursus, sertifikasi, atau buku yang menunjang pekerjaan.",
  },
  {
    icon: Clock,
    title: "Jam Kerja Fleksibel",
    description: "Selama target tercapai dan koordinasi tim tetap jalan, jam kerja fleksibel.",
  },
  {
    icon: Users,
    title: "Team Bonding",
    description: "Acara tim rutin untuk saling kenal di luar konteks kerja sehari-hari.",
  },
];

interface HiringStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const HIRING_STEPS: HiringStep[] = [
  {
    number: "01",
    title: "Kirim Lamaran",
    description: "Pilih posisi yang cocok, kirim CV dan portofolio (jika ada) lewat tombol lamar.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Screening & Tes Awal",
    description: "Tim rekrutmen meninjau lamaran dan bisa menghubungi untuk tes singkat sesuai posisi.",
    icon: MessagesSquare,
  },
  {
    number: "03",
    title: "Interview Tim & User",
    description: "Ngobrol dengan tim terkait untuk saling kenal dan memastikan ekspektasi sejalan.",
    icon: Users,
  },
  {
    number: "04",
    title: "Offering & Onboarding",
    description: "Kalau cocok di kedua sisi, lanjut ke penawaran dan proses onboarding.",
    icon: Award,
  },
];

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Apakah DIMATA menerima fresh graduate?",
    answer:
      "Ya. Beberapa posisi terbuka untuk fresh graduate yang punya dasar yang sesuai dan mau belajar cepat, terutama di tim engineering dan operations.",
  },
  {
    question: "Apakah ada opsi kerja remote atau WFH?",
    answer:
      "Sebagian besar posisi bersifat hybrid — sebagian waktu di kantor, sebagian bisa remote — karena beberapa peran butuh koordinasi langsung dengan tim atau kunjungan ke klien.",
  },
  {
    question: "Kalau posisi yang saya mau belum dibuka, apakah CV saya tetap disimpan?",
    answer:
      'Bisa. Kirim CV lewat tombol "Kirim CV Umum" di bagian bawah halaman ini, dan kami akan hubungi kalau ada posisi yang cocok.',
  },
  {
    question: "Berapa lama proses seleksinya?",
    answer:
      "Bervariasi tergantung posisi, tapi umumnya 1–3 minggu dari lamaran masuk sampai keputusan akhir. Kami usahakan tetap mengabari meski hasilnya belum sesuai.",
  },
  {
    question: "Apakah ada program magang selain yang tercantum?",
    answer:
      "Kami membuka magang secara berkala, terutama di tim engineering dan design. Kalau saat ini belum ada lowongan magang yang cocok, tetap bisa kirim CV umum.",
  },
];

interface OfficePhoto {
  src: string;
  alt: string;
}

const OFFICE_PHOTOS: OfficePhoto[] = [
  { src: "/img/career/office-workspace.png", alt: "Ruang kerja utama" },
  { src: "/img/career/meeting-room.png", alt: "Ruang meeting" },
  { src: "/img/career/lounge-and-pantry.png", alt: "Lounge & Pantry" },
  { src: "/img/career/office-discussion.png", alt: "Area diskusi" },
  { src: "/img/career/office-outdoor.png", alt: "Balkon & Area Outdoor" },
];

function DepartmentBadge({ department }: { department: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-[12px] font-medium text-foreground/70">
      <Briefcase className="h-3 w-3 text-foreground/40" />
      {department}
    </span>
  );
}

export default function CareersPage() {
  const [activeDept, setActiveDept] = useState("Semua");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  const sliderRef = useRef<HTMLDivElement>(null);

  const filteredJobs = useMemo(
    () => (activeDept === "Semua" ? JOBS : JOBS.filter((j) => j.department === activeDept)),
    [activeDept],
  );

  const selectedJob = JOBS.find((j) => j.id === selectedJobId) ?? null;

  const handleSelectDept = (dept: string) => {
    setActiveDept(dept);
    setSelectedJobId(null);
  };

  const handleSelectJob = (id: string) => {
    setSelectedJobId(id);
  };

  const closeModal = () => {
    setSelectedJobId(null);
  };

  // Kunci scroll halaman ketika pop-up (modal) terbuka
  useEffect(() => {
    if (selectedJobId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedJobId]);

  // Scroll otomatis ke tengah slider saat halaman dimuat
  useEffect(() => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      container.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* ================= HERO SECTION (FULL IMAGE RIGHT W/ GRADIENTS) ================= */}
      <section className="relative isolate min-h-[95vh] flex items-center bg-background overflow-hidden">
        {/* Latar Belakang Gambar Penuh di Kanan */}
        <div className="absolute inset-0 lg:left-[35%] z-0">
          <Image
            src="/img/career/career.png"
            alt="Suasana Kerja Dimata"
            fill
            className="object-cover object-center lg:object-left"
            priority
          />
          {/* Layer 1: Gradasi dari warna background (kiri) ke transparan (kanan) */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent lg:via-background/70" />
          
          {/* Layer 2: Gradasi hitam di kanan ke transparan (kiri) */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Konten Teks di Kiri */}
        <div className="relative z-10 w-full mx-auto max-w-7xl px-6 py-20 lg:py-32">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            <Reveal from="up">
              <h1 className="font-display text-[42px] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-[56px] lg:text-[64px] drop-shadow-sm">
                Bangun kode yang <br />
                <span className="text-transparent bg-clip-text bg-blue-400">
                  menggerakkan bisnis.
                </span>
              </h1>
              <p className="mt-6 text-[18px] leading-relaxed text-foreground/70 max-w-lg lg:text-foreground/80 font-medium">
                Kami membangun ekosistem digital untuk ratusan bisnis nyata. Kalau kamu lebih suka melihat hasil kerjamu dipakai langsung setiap hari daripada sekadar berteori, ini tempatmu.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#posisi-terbuka"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-[15px] font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-105"
                >
                  Lihat Posisi Terbuka
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-foreground/20 bg-background/50 backdrop-blur-sm px-8 py-4 text-[15px] font-semibold text-foreground transition-all hover:bg-background/80"
                >
                  Kenali Kami
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
              Bukan sekadar tempat kerja
            </h2>
            <p className="mt-4 text-[16px] text-foreground/60">
              Alasan kenapa orang-orang terbaik memilih untuk bertumbuh bersama kami.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map(({ icon: Icon, title, description }, i) => (
              <Reveal key={title} delay={i * 100} className="relative group">
                <div className="absolute inset-0 bg-background rounded-3xl shadow-sm transition-transform duration-300 group-hover:-translate-y-2" />
                <div className="relative p-8 flex flex-col h-full border border-foreground/10 rounded-3xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-6 shadow-md">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-[18px] font-semibold text-foreground mb-3">{title}</h3>
                  <p className="text-[14px] leading-relaxed text-foreground/60">{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SLIDER GALLERY ================= */}
      <section className="py-24 sm:py-32 bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <h2 className="font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[40px]">
                Intip Markas Kami
              </h2>
              <p className="mt-4 text-[16px] text-foreground/60">
                Tempat yang dirancang untuk fokus kolaborasi, namun tetap memberikan ruang nyaman untuk berkreasi secara individu.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-foreground/50 text-[14px] font-medium">
              <span>Geser untuk melihat</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Reveal>
        </div>

        {/* Scrollable Container Container */}
        <Reveal delay={100} className="w-full relative">
          <div 
            ref={sliderRef}
            // Efek memudar di kanan dan kiri menggunakan CSS mask-image
            style={{ 
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
              maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
            }}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-[20vw] sm:px-[30vw] md:px-[35vw]"
          >
            {OFFICE_PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[4/3] w-[75vw] sm:w-[50vw] md:w-[40vw] lg:w-[36rem] shrink-0 snap-center overflow-hidden rounded-none border border-foreground/10 group"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ================= HIRING PROCESS ================= */}
      <section className="bg-foreground/5 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Reveal>
              <h2 className="font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[40px]">
                Proses Rekrutmen yang Cepat & Transparan
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-foreground/60 max-w-md">
                Kami sangat menghargai waktumu. Tidak ada tahapan berbelit. Ini adalah 4 langkah mudah untuk bergabung dengan ekosistem kami.
              </p>
              
              <div className="mt-12 space-y-6">
                <h3 className="font-semibold text-foreground text-[18px]">Fasilitas Tambahan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BENEFITS.map((b, i) => (
                    <div key={i} className="flex gap-3 items-start p-4 bg-background rounded-2xl border border-foreground/10">
                      <b.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[14px] text-foreground">{b.title}</p>
                        <p className="text-[12px] text-foreground/50 mt-1 leading-snug">{b.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="relative border-l-2 border-primary/20 ml-4 lg:ml-10 space-y-12 pb-8">
              {HIRING_STEPS.map(({ number, title, description, icon: Icon }, i) => (
                <Reveal key={number} delay={i * 100} className="relative pl-10">
                  <span className="absolute -left-[21px] top-0 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary text-primary shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-bold text-primary">LANGKAH {number}</span>
                    <h3 className="font-display text-[20px] font-semibold text-foreground">{title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-foreground/60">{description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= OPEN POSITIONS (CARD GRID W/ MODAL) ================= */}
      <section id="posisi-terbuka" className="py-24 sm:py-32 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center mb-12">
            <h2 className="font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[40px]">
              Posisi Terbuka
            </h2>
            <p className="mt-4 text-[16px] text-foreground/60">
              Temukan peran yang cocok dengan keahlianmu.
            </p>
          </Reveal>

          {/* Filters */}
          <Reveal delay={100} className="flex flex-wrap justify-center gap-2 mb-12">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => handleSelectDept(dept)}
                className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 ${
                  activeDept === dept
                    ? "bg-foreground text-background shadow-md scale-105"
                    : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                }`}
              >
                {dept}
              </button>
            ))}
          </Reveal>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.length === 0 ? (
              <p className="col-span-full py-12 text-center text-foreground/50">
                Belum ada posisi terbuka di departemen ini.
              </p>
            ) : (
              filteredJobs.map((job, i) => (
                <Reveal key={job.id} delay={(i % 6) * 50}>
                  <button
                    onClick={() => handleSelectJob(job.id)}
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
                        {job.title}
                      </h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-foreground/60 line-clamp-2">
                        {job.summary}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-5 border-t border-foreground/5">
                      <DepartmentBadge department={job.department} />
                      <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground/50">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[13px] font-semibold text-primary pt-2 opacity-80 group-hover:opacity-100">
                      <span>Lihat Detail</span>
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
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={closeModal}
            aria-hidden="true"
          />
          
          {/* Modal Box */}
          <div className="relative z-10 w-full max-w-3xl max-h-full overflow-y-auto rounded-[2rem] border border-foreground/10 bg-background shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header Sticky (Opsional: agar tombol close tetap terlihat) */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-foreground/10 bg-background/95 px-6 py-5 backdrop-blur-md sm:px-10">
              <h3 className="font-display text-[20px] sm:text-[24px] font-bold text-foreground truncate pr-4">
                {selectedJob.title}
              </h3>
              <button
                onClick={closeModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="rounded-md bg-primary/10 px-3 py-1.5 text-[12px] font-bold text-primary uppercase tracking-wider">
                  {selectedJob.type}
                </span>
                <DepartmentBadge department={selectedJob.department} />
                <span className="flex items-center gap-1.5 text-[14px] text-foreground/60">
                  <MapPin className="h-4 w-4" />
                  {selectedJob.location}
                </span>
              </div>

              <p className="text-[16px] leading-relaxed text-foreground/80 font-medium">
                {selectedJob.summary}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="rounded-2xl bg-foreground/5 p-6 border border-foreground/5">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-foreground/50 mb-4 flex items-center gap-2">
                    <span className="h-px w-6 bg-foreground/20" /> Tanggung Jawab
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {selectedJob.responsibilities.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[14px] leading-relaxed text-foreground/70">
                        <ChevronRight className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-foreground/5 p-6 border border-foreground/5">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-foreground/50 mb-4 flex items-center gap-2">
                    <span className="h-px w-6 bg-foreground/20" /> Kualifikasi / Syarat
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {selectedJob.requirements.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[14px] leading-relaxed text-foreground/70">
                        <ChevronRight className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Footer (Action Buttons) */}
              <div className="mt-10 flex flex-wrap-reverse items-center justify-end gap-4 pt-6 border-t border-foreground/10">
                <button
                  onClick={closeModal}
                  className="w-full sm:w-auto px-6 py-3.5 text-[15px] font-bold text-foreground/60 transition-colors hover:text-foreground"
                >
                  Batal
                </button>
                <a
                  href={`mailto:karir@dimata.id?subject=${encodeURIComponent(`Lamaran — ${selectedJob.title}`)}`}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-[15px] font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-1"
                >
                  Kirim Lamaran
                  <ArrowRight className="h-4 w-4" />
                </a>
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
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-primary">FAQ</span>
              <h2 className="mt-3 font-display text-[32px] font-bold tracking-tight text-foreground sm:text-[40px]">
                Pertanyaan Umum
              </h2>
              <p className="mt-4 text-[16px] text-foreground/60">
                Punya pertanyaan sebelum melamar? Mungkin jawabannya ada di sini.
              </p>
            </Reveal>

            <div className="lg:col-span-8 flex flex-col gap-4">
              {FAQS.map((faq, i) => (
                <Reveal key={i} delay={i * 50}>
                  <details className="group rounded-2xl bg-background border border-foreground/10 p-6 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-[16px] font-semibold text-foreground">
                      {faq.question}
                      <span className="relative h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180">
                        <ChevronDown className="absolute inset-0 h-5 w-5 text-foreground/40" />
                      </span>
                    </summary>
                    <p className="mt-4 text-[15px] leading-relaxed text-foreground/60 border-t border-foreground/5 pt-4">
                      {faq.answer}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}
      <section className="relative isolate py-24 sm:py-32 bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-background/10 p-4 mb-6">
            <Mail className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </span>
          <h2 className="font-display text-[36px] font-bold tracking-tight sm:text-[48px]">
            Belum menemukan posisi yang pas?
          </h2>
          <p className="mt-6 text-[18px] leading-relaxed text-background/70">
            Jangan biarkan itu menghalangimu. Kami selalu terbuka untuk talenta hebat. Kirimkan CV dan portofolio kamu, dan kami akan menghubungimu saat ada posisi yang tepat.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:karir@dimata.id?subject=Kirim%20CV%20Umum"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-[15px] font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-1"
            >
              Kirim CV Umum
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-background/10 px-8 py-4 text-[15px] font-bold text-background border border-background/20 transition-colors hover:bg-background/20"
            >
              Hubungi Tim HR
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}