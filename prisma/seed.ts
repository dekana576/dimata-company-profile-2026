import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { parseDatabaseUrl } from "../src/lib/db-config";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(parseDatabaseUrl());
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.CMS_ADMIN_EMAIL;
  const password = process.env.CMS_ADMIN_PASSWORD;
  const name = process.env.CMS_ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error(
      "CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD must be set in .env"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log(`Admin user created/updated: ${admin.email}`);

  // Seed events
  const events = [
    {
      slug: "workshop-transformasi-digital-umkm-2026",
      title: "Workshop Transformasi Digital untuk UMKM 2026",
      description: "Workshop intensif tentang penerapan solusi digital untuk UMKM. Pelajari cara mengoptimalkan operasional bisnis dengan teknologi ERP, HRIS, dan POS dari DIMATA IT Solutions.",
      content: `<h2>Workshop Transformasi Digital untuk UMKM</h2>
<p>Bergabunglah dalam workshop intensif yang dirancang khusus untuk pemilik UMKM yang ingin mentransformasi bisnis mereka melalui teknologi digital.</h2>

<h3>Yang Akan Dipelajari:</h3>
<ul>
<li>Pengenalan solusi ERP untuk UMKM</li>
<li>Manajemen inventori dan pembelian yang efisien</li>
<li>Sistem POS modern untuk retail dan hospitality</li>
<li>Integrasi HRIS untuk pengelolaan karyawan</li>
<li>Dasar-dasar analitik bisnis real-time</li>
</ul>

<h3>Manfaat:</h3>
<ul>
<li>Sertifikat peserta workshop</li>
<li>Konsultasi gratis 1 jam dengan konsultan DIMATA</li>
<li>Diskon khusus implementasi sistem</li>
<li>Akses ke materi workshop selamanya</li>
</ul>

<p>Workshop ini terbuka untuk 30 peserta terdaftar. Daftarkan diri Anda sekarang!</p>`,
      image: null,
      location: "Hotel Harris Seminyak, Bali",
      startDate: new Date("2026-08-15T09:00:00"),
      endDate: new Date("2026-08-15T16:00:00"),
      category: "Workshop",
      status: "upcoming",
      isActive: true,
    },
    {
      slug: "dimata-tech-talk-erp-modern-2026",
      title: "DIMATA Tech Talk: ERP Modern untuk Industri Hospitality",
      description: "Serie tech talk bulanan DIMATA membahas penerapan ERP modern di industri hospitality. Temukan bagaimana hotel dan restoran dapat meningkatkan efisiensi operasional.",
      content: `<h2>DIMATA Tech Talk: ERP Modern untuk Industri Hospitality</h2>
<p>Serie tech talk bulanan DIMATA hadir untuk membahas tren terbaru dalam penerapan ERP di industri hospitality.</p>

<h3>Pembicara:</h3>
<ul>
<li>CEO DIMATA IT Solutions - Vision & Strategic Direction</li>
<li>Head of Product - Fitur Terbaru ProChain & Hanoman</li>
<li>Customer Success Manager - Case Study Implementasi</li>
</ul>

<h3>Agenda:</h3>
<ol>
<li>Opening & Networking (30 menit)</li>
<li>Presentasi: Tren ERP di Hospitality 2026 (45 menit)</li>
<li>Live Demo: ProChain & Hanoman Integration (30 menit)</li>
<li>Case Study: Hotel XYZ Success Story (20 menit)</li>
<li>Q&A Session (25 menit)</li>
</ol>

<p>Acara ini GRATIS untuk semua peserta. Registrasi wajib.</p>`,
      image: null,
      location: "Online via Zoom",
      startDate: new Date("2026-07-25T14:00:00"),
      endDate: new Date("2026-07-25T16:30:00"),
      category: "Tech Talk",
      status: "upcoming",
      isActive: true,
    },
    {
      slug: "dimata-goes-to-campus-itb-2026",
      title: "DIMATA Goes to Campus: Career Talk & Tech Workshop di ITB",
      description: "DIMATA IT Solutions mengunjungi ITB untuk memberikan career talk dan workshop teknologi kepada mahasiswa informatika dan teknik elektro.",
      content: `<h2>DIMATA Goes to Campus: ITB 2026</h2>
<p>DIMATA IT Solutions percaya pada investasi masa depan. Dalam kunjungan ini, kami berbagi pengetahuan dan pengalaman dengan mahasiswa ITB.</p>

<h3>Rangkaian Acara:</h3>
<ul>
<li><strong>Career Talk</strong> - Peluang karir di industri IT solution provider</li>
<li><strong>Tech Workshop</strong> - Build your first ERP module with DIMATA stack</li>
<li><strong>Networking Session</strong> - Sesi tanya jawab dengan engineer DIMATA</li>
<li><strong>Internship Info</strong> - Informasi program magang DIMATA 2026</li>
</ul>

<p>Jadikan langkah pertama karir IT Anda bersama DIMATA!</p>`,
      image: null,
      location: "Gedung Teknik Elektro, ITB Bandung",
      startDate: new Date("2026-06-10T08:00:00"),
      endDate: new Date("2026-06-10T15:00:00"),
      category: "Campus Event",
      status: "completed",
      isActive: true,
    },
    {
      slug: "dimata-indonesia-computex-2026",
      title: "DIMATA di Indonesia Computex 2026: Solusi ERP Lokal Bertaraf Internasional",
      description: "DIMATA IT Solutions berpartisipasi dalam Indonesia Computex 2026 sebagai exhibitor, memamerkan lini lengkap solusi ERP, HRIS, dan POS lokal berkualitas internasional.",
      content: `<h2>Indonesia Computex 2026</h2>
<p>DIMATA IT Solutions hadir di booth A12 dalam pameran teknologi terbesar di Indonesia.</p>

<h3>Yang Dapat Anda Temui di Booth DIMATA:</h3>
<ul>
<li>Live demo ProChain, Hanoman, Hairisma, dan AISO</li>
<li>Konsultasi gratis dengan tim solution architect</li>
<li>Promo eksklusif untuk pendaftaran di hari pameran</li>
<li>Exclusive merchandise untuk pengunjung booth</li>
</ul>

<h3>Sesi Presentasi di Stage DIMATA:</h3>
<ol>
<li>10:00 - Keynote: "Building Indonesia's Digital Backbone"</li>
<li>11:30 - Workshop: "Real-time Analytics for SME"</li>
<li>14:00 - Panel: "The Future of Hospitality Tech in Indonesia"</li>
</ol>

<p>Jangan lewatkan kesempatan untuk melihat langsung solusi DIMATA!</p>`,
      image: null,
      location: "Jakarta Convention Center",
      startDate: new Date("2026-05-20T09:00:00"),
      endDate: new Date("2026-05-22T17:00:00"),
      category: "Exhibition",
      status: "completed",
      isActive: true,
    },
    {
      slug: "webinar-cybersecurity-untuk-bisnis-2026",
      title: "Webinar: Cybersecurity Best Practices untuk Bisnis Digital",
      description: "Webinar tentang pentingnya keamanan siber untuk bisnis digital. Pelajari best practices dalam melindungi data bisnis dan customer information dari ancaman siber.",
      content: `<h2>Cybersecurity Best Practices untuk Bisnis Digital</h2>
<p>Di era digital, keamanan siber menjadi prioritas utama bagi setiap bisnis. Webinar ini akan membahas langkah-langkah praktis yang dapat diimplementasikan oleh UMKM dan perusahaan menengah.</p>

<h3>Materi Webinar:</h3>
<ul>
<li>Threat landscape terkini untuk bisnis Indonesia</li>
<li>Implementasi zero-trust architecture untuk UMKM</li>
<li>Data protection & compliance (PDP Law)</li>
<li>Incident response planning</li>
<li>Security awareness training untuk karyawan</li>
</ul>

<p>Webinar ini diselenggarakan bekerja sama dengan asosiasi IT Indonesia.</p>`,
      image: null,
      location: "Online via Google Meet",
      startDate: new Date("2026-04-05T13:00:00"),
      endDate: new Date("2026-04-05T15:00:00"),
      category: "Webinar",
      status: "completed",
      isActive: true,
    },
    {
      slug: "dimata-annual-meetup-2025",
      title: "DIMATA Annual Meetup 2025: Celebrating 23 Years of Innovation",
      description: "Acara tahunan DIMATA IT Solutions untuk merayakan 23 tahun inovasi teknologi. Gathering klien, partner, dan tim DIMATA dalam semangat kolaborasi.",
      content: `<h2>DIMATA Annual Meetup 2025</h2>
<p>Tahun ke-23 DIMATA IT Solutions dirayakan bersama seluruh stakeholder dalam acara tahunan yang penuh inspirasi.</p>

<h3>Highlights:</h3>
<ul>
<li>Keynote CEO: "23 Years of Building Indonesia's Digital Infrastructure"</li>
<li>Product Roadmap 2026: Sneak peek fitur baru</li>
<li>Client Appreciation Awards</li>
<li>Live Entertainment & Dinner</li>
<li>Networking dengan 200+ tamu undangan</li>
</ul>

<p>Terima kasih atas kepercayaan selama 23 tahun. Mari terus berinovasi bersama!</p>`,
      image: null,
      location: "The Mulia Resort, Nusa Dua, Bali",
      startDate: new Date("2025-12-15T18:00:00"),
      endDate: new Date("2025-12-15T22:00:00"),
      category: "Meetup",
      status: "completed",
      isActive: true,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
    console.log(`Event created/updated: ${event.title}`);
  }

  // Seed departments
  const departmentsData = [
    { nameId: "Engineering", nameEn: "Engineering", sortOrder: 1 },
    { nameId: "Product & Design", nameEn: "Product & Design", sortOrder: 2 },
    { nameId: "Sales & Marketing", nameEn: "Sales & Marketing", sortOrder: 3 },
    { nameId: "Operations", nameEn: "Operations", sortOrder: 4 },
  ];

  const departments: Record<string, { id: number }> = {};
  for (const dept of departmentsData) {
    const created = await prisma.department.upsert({
      where: { nameId: dept.nameId },
      update: { sortOrder: dept.sortOrder },
      create: { nameId: dept.nameId, nameEn: dept.nameEn, sortOrder: dept.sortOrder, isActive: true },
    });
    departments[dept.nameId] = { id: created.id };
    console.log(`Department created/updated: ${dept.nameId}`);
  }

  // Seed jobs
  const jobsData = [
    {
      slug: "backend-engineer",
      titleId: "Backend Engineer",
      titleEn: "Backend Engineer",
      departmentId: departments["Engineering"].id,
      location: "Denpasar · Hybrid",
      type: "Full-time",
      summaryId: "Bangun dan rawat layanan backend yang menopang ProChain, Hairisma, dan AISO.",
      summaryEn: "Build and maintain backend services powering ProChain, Hairisma, and AISO.",
      responsibilitiesId: [
        "Merancang dan membangun API yang dipakai lintas produk DIMATA",
        "Menjaga performa dan keandalan sistem yang berjalan 24/7",
        "Berkolaborasi dengan tim produk untuk fitur baru",
      ],
      responsibilitiesEn: [
        "Design and build APIs used across DIMATA products",
        "Maintain performance and reliability of systems running 24/7",
        "Collaborate with product team for new features",
      ],
      requirementsId: [
        "Berpengalaman dengan salah satu: Go, Node.js, atau Python",
        "Familiar dengan database relasional dan desain API",
        "Terbiasa bekerja dengan Git dan proses code review",
      ],
      requirementsEn: [
        "Experienced with one of: Go, Node.js, or Python",
        "Familiar with relational databases and API design",
        "Comfortable working with Git and code review processes",
      ],
      applyUrl: "mailto:karir@dimata.id",
      sortOrder: 1,
    },
    {
      slug: "frontend-engineer",
      titleId: "Frontend Engineer",
      titleEn: "Frontend Engineer",
      departmentId: departments["Engineering"].id,
      location: "Denpasar · Hybrid",
      type: "Full-time",
      summaryId: "Wujudkan antarmuka yang dipakai ratusan bisnis setiap hari, dari dashboard sampai POS.",
      summaryEn: "Build interfaces used by hundreds of businesses daily, from dashboards to POS.",
      responsibilitiesId: [
        "Membangun antarmuka dengan React/Next.js dan Tailwind",
        "Menerjemahkan desain jadi komponen yang rapi dan reusable",
        "Menjaga performa halaman di perangkat dengan koneksi terbatas",
      ],
      responsibilitiesEn: [
        "Build interfaces with React/Next.js and Tailwind",
        "Translate designs into clean, reusable components",
        "Maintain page performance on devices with limited connectivity",
      ],
      requirementsId: [
        "Berpengalaman dengan React dan TypeScript",
        "Paham dasar UX — tahu kapan sebuah interaksi terasa janggal",
        "Terbiasa bekerja dari desain di Figma",
      ],
      requirementsEn: [
        "Experienced with React and TypeScript",
        "Understands UX basics — knows when an interaction feels off",
        "Comfortable working from Figma designs",
      ],
      applyUrl: "mailto:karir@dimata.id",
      sortOrder: 2,
    },
    {
      slug: "qa-engineer",
      titleId: "QA Engineer",
      titleEn: "QA Engineer",
      departmentId: departments["Engineering"].id,
      location: "Denpasar",
      type: "Full-time",
      summaryId: "Pastikan setiap fitur yang rilis tidak mengganggu transaksi bisnis yang sedang berjalan.",
      summaryEn: "Ensure every feature released doesn't disrupt ongoing business transactions.",
      responsibilitiesId: [
        "Menyusun test case untuk fitur baru dan regresi",
        "Menjalankan pengujian manual dan otomatis sebelum rilis",
        "Melaporkan bug dengan detail yang jelas ke tim engineering",
      ],
      responsibilitiesEn: [
        "Write test cases for new features and regression",
        "Run manual and automated testing before release",
        "Report bugs with clear details to the engineering team",
      ],
      requirementsId: [
        "Familiar dengan proses QA manual maupun automation dasar",
        "Teliti dan terbiasa berpikir dari sisi skenario pengguna",
        "Nilai plus: pernah menguji aplikasi POS, HRIS, atau akuntansi",
      ],
      requirementsEn: [
        "Familiar with manual QA and basic automation processes",
        "Detail-oriented and accustomed to thinking from user scenarios",
        "Plus: experience testing POS, HRIS, or accounting applications",
      ],
      applyUrl: "mailto:karir@dimata.id",
      sortOrder: 3,
    },
    {
      slug: "product-designer",
      titleId: "Product Designer (UI/UX)",
      titleEn: "Product Designer (UI/UX)",
      departmentId: departments["Product & Design"].id,
      location: "Denpasar",
      type: "Full-time",
      summaryId: "Desain alur kerja yang dipakai kasir, HR, dan pemilik bisnis — bukan sekadar tampilan cantik.",
      summaryEn: "Design workflows used by cashiers, HR, and business owners — not just pretty visuals.",
      responsibilitiesId: [
        "Merancang wireframe dan UI untuk fitur di keempat produk DIMATA",
        "Melakukan riset singkat ke pengguna untuk validasi alur",
        "Menjaga konsistensi design system lintas produk",
      ],
      responsibilitiesEn: [
        "Design wireframes and UI for features across all DIMATA products",
        "Conduct brief user research for workflow validation",
        "Maintain design system consistency across products",
      ],
      requirementsId: [
        "Punya portofolio desain produk (bukan hanya visual/branding)",
        "Terbiasa dengan Figma dan prinsip dasar design system",
        "Bisa menjelaskan alasan di balik keputusan desain",
      ],
      requirementsEn: [
        "Has a product design portfolio (not just visual/branding)",
        "Comfortable with Figma and basic design system principles",
        "Can explain the reasoning behind design decisions",
      ],
      applyUrl: "mailto:karir@dimata.id",
      sortOrder: 4,
    },
    {
      slug: "sales-executive",
      titleId: "Sales Executive (B2B SaaS)",
      titleEn: "Sales Executive (B2B SaaS)",
      departmentId: departments["Sales & Marketing"].id,
      location: "Denpasar / Jakarta",
      type: "Full-time",
      summaryId: "Kenalkan ProChain, Hanoman, Hairisma, dan AISO ke bisnis yang masih serba manual.",
      summaryEn: "Introduce ProChain, Hanoman, Hairisma, and AISO to businesses still relying on manual processes.",
      responsibilitiesId: [
        "Mencari dan menindaklanjuti prospek bisnis baru",
        "Melakukan demo produk sesuai kebutuhan calon klien",
        "Menjaga hubungan dengan klien selama proses onboarding awal",
      ],
      responsibilitiesEn: [
        "Find and follow up on new business prospects",
        "Conduct product demos tailored to potential client needs",
        "Maintain client relationships during initial onboarding",
      ],
      requirementsId: [
        "Pengalaman sales, lebih disukai di bidang software/teknologi",
        "Komunikatif dan nyaman melakukan presentasi ke klien",
        "Punya kendaraan sendiri untuk kunjungan klien",
      ],
      requirementsEn: [
        "Sales experience, preferably in software/technology",
        "Communicative and comfortable presenting to clients",
        "Own vehicle for client visits",
      ],
      applyUrl: "mailto:karir@dimata.id",
      sortOrder: 5,
    },
    {
      slug: "customer-success",
      titleId: "Customer Success Specialist",
      titleEn: "Customer Success Specialist",
      departmentId: departments["Operations"].id,
      location: "Denpasar",
      type: "Full-time",
      summaryId: "Pastikan bisnis yang sudah pakai sistem DIMATA benar-benar terbantu, bukan cuma terdaftar.",
      summaryEn: "Ensure businesses using DIMATA systems are truly helped, not just onboarded.",
      responsibilitiesId: [
        "Mendampingi klien di masa-masa awal pakai produk",
        "Menjawab pertanyaan dan menyelesaikan kendala penggunaan",
        "Mengumpulkan masukan klien untuk tim produk",
      ],
      responsibilitiesEn: [
        "Guide clients during their early days using the product",
        "Answer questions and resolve usage issues",
        "Gather client feedback for the product team",
      ],
      requirementsId: [
        "Sabar, komunikatif, dan senang membantu menyelesaikan masalah",
        "Terbiasa menggunakan aplikasi berbasis web/mobile",
        "Nilai plus: pernah bekerja di bidang F&B, retail, atau hospitality",
      ],
      requirementsEn: [
        "Patient, communicative, and enjoys solving problems",
        "Comfortable using web/mobile applications",
        "Plus: experience in F&B, retail, or hospitality",
      ],
      applyUrl: "mailto:karir@dimata.id",
      sortOrder: 6,
    },
    {
      slug: "implementation-specialist",
      titleId: "Implementation & Onboarding Specialist",
      titleEn: "Implementation & Onboarding Specialist",
      departmentId: departments["Operations"].id,
      location: "Denpasar",
      type: "Full-time",
      summaryId: "Bantu bisnis pindah dari cara manual ke sistem DIMATA, dari setup sampai siap pakai.",
      summaryEn: "Help businesses transition from manual processes to DIMATA systems, from setup to ready-to-use.",
      responsibilitiesId: [
        "Melakukan setup data awal (karyawan, menu, produk, dll.)",
        "Melatih tim klien menggunakan produk yang relevan",
        "Berkoordinasi dengan tim teknis untuk kebutuhan khusus klien",
      ],
      responsibilitiesEn: [
        "Perform initial data setup (employees, menu, products, etc.)",
        "Train client teams on relevant products",
        "Coordinate with technical team for special client requirements",
      ],
      requirementsId: [
        "Terorganisir dan detail terhadap data",
        "Nyaman menjelaskan hal teknis dengan cara yang sederhana",
        "Bersedia melakukan kunjungan ke lokasi klien bila diperlukan",
      ],
      requirementsEn: [
        "Organized and detail-oriented with data",
        "Comfortable explaining technical things in simple terms",
        "Willing to visit client locations when needed",
      ],
      applyUrl: "mailto:karir@dimata.id",
      sortOrder: 7,
    },
    {
      slug: "intern-web-developer",
      titleId: "Internship Web Developer",
      titleEn: "Internship Web Developer",
      departmentId: departments["Engineering"].id,
      location: "Denpasar",
      type: "Magang",
      summaryId: "Belajar langsung di tim yang membangun produk yang benar-benar dipakai, bukan proyek simulasi.",
      summaryEn: "Learn directly in a team building products that are actually used, not simulation projects.",
      responsibilitiesId: [
        "Membantu pengembangan fitur kecil di bawah bimbingan mentor",
        "Ikut serta dalam code review dan diskusi teknis tim",
        "Belajar proses kerja tim engineering dari dekat",
      ],
      responsibilitiesEn: [
        "Assist in developing small features under mentor guidance",
        "Participate in code reviews and technical team discussions",
        "Learn engineering team workflows up close",
      ],
      requirementsId: [
        "Mahasiswa aktif atau fresh graduate jurusan terkait",
        "Familiar dengan HTML, CSS, JavaScript, dan dasar framework modern",
        "Mau belajar dan terbuka menerima masukan",
      ],
      requirementsEn: [
        "Active student or fresh graduate in a relevant field",
        "Familiar with HTML, CSS, JavaScript, and modern framework basics",
        "Eager to learn and open to feedback",
      ],
      applyUrl: "mailto:karir@dimata.id",
      sortOrder: 8,
    },
  ];

  for (const job of jobsData) {
    const existing = await prisma.job.findUnique({ where: { slug: job.slug } });
    if (!existing) {
      await prisma.job.create({
        data: {
          ...job,
          responsibilitiesId: JSON.stringify(job.responsibilitiesId),
          responsibilitiesEn: JSON.stringify(job.responsibilitiesEn),
          requirementsId: JSON.stringify(job.requirementsId),
          requirementsEn: JSON.stringify(job.requirementsEn),
          isActive: true,
        },
      });
      console.log(`Job created: ${job.titleId}`);
    } else {
      console.log(`Job already exists: ${job.titleId}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
