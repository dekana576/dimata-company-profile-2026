import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
