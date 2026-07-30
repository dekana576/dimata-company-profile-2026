import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { parseDatabaseUrl } from "../src/lib/db-config";

config();
config({ path: ".env.local" });

const adapter = new PrismaMariaDb(parseDatabaseUrl());
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding blog data...");

  // Create categories
  const categories = [
    {
      slug: "bisnis-ekonomi",
      nameId: "Bisnis & Ekonomi",
      nameEn: "Business & Economy",
      sortOrder: 1,
    },
    {
      slug: "digital-informasi",
      nameId: "Digital & Informasi",
      nameEn: "Digital & Information",
      sortOrder: 2,
    },
    {
      slug: "teknologi",
      nameId: "Teknologi",
      nameEn: "Technology",
      sortOrder: 3,
    },
    {
      slug: "tutorial-tips",
      nameId: "Tutorial & Tips",
      nameEn: "Tutorials & Tips",
      sortOrder: 4,
    },
    {
      slug: "press-release",
      nameId: "Press Release",
      nameEn: "Press Release",
      sortOrder: 5,
    },
  ];

  for (const cat of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { nameId: cat.nameId, nameEn: cat.nameEn, sortOrder: cat.sortOrder },
      create: { ...cat, isActive: true },
    });
  }

  console.log(`Created ${categories.length} categories`);

  // Get category IDs
  const digitalInfo = await prisma.blogCategory.findUnique({ where: { slug: "digital-informasi" } });
  const teknologi = await prisma.blogCategory.findUnique({ where: { slug: "teknologi" } });
  const bisnis = await prisma.blogCategory.findUnique({ where: { slug: "bisnis-ekonomi" } });
  const tutorial = await prisma.blogCategory.findUnique({ where: { slug: "tutorial-tips" } });
  const pressRelease = await prisma.blogCategory.findUnique({ where: { slug: "press-release" } });

  const sampleCategories = (ids: (number | undefined)[]) =>
    ids.filter((id): id is number => id != null).map((categoryId) => ({ categoryId }));

  // Sample posts
  const posts = [
    {
      slug: "transformasi-digital-umkm-indonesia",
      title: "Transformasi Digital UMKM Indonesia di Tahun 2026",
      authorName: "DIMATA",
      status: "published",
      publishedAt: new Date("2026-07-15"),
      isFeatured: true,
      excerpt:
        "UMKM di Indonesia semakin bertransformasi ke era digital. Simak tren dan strategi terkini untuk memenangkan persaingan di pasar digital.",
      content: `<h2>Transformasi Digital UMKM: Sebuah Keniscayaan</h2>
<p>Di era digital ini, transformasi digital bukan lagi sebuah pilihan melainkan sebuah keharusan bagi UMKM di Indonesia. Dengan lebih dari 64 juta UMKM yang berkontribusi terhadap 61% PDB nasional, digitalisasi menjadi kunci utama dalam meningkatkan daya saing.</p>

<h2>Tren Digitalisasi UMKM 2026</h2>
<p>Beberapa tren yang perlu diperhatikan oleh pelaku UMKM:</p>
<ul>
  <li><strong>Penerapan AI dan Chatbot:</strong> Layanan pelanggan 24/7 dengan biaya terjangkau</li>
  <li><strong>Omnichannel Marketing:</strong> Integrasi berbagai platform penjualan</li>
  <li><strong>Cloud-Based POS System:</strong> Manajemen inventaris dan penjualan real-time</li>
  <li><strong>Digital Payment:</strong> QRIS dan e-wallet sebagai standar pembayaran</li>
</ul>

<h2>Bagaimana DIMATA Membantu?</h2>
<p>DIMATA hadir dengan solusi <a href="/products/prochain">ProChain</a> yang membantu UMKM mengelola rantai pasok digital, serta <a href="/products/hanoman">Hanoman</a> untuk transformasi layanan publik dan bisnis.</p>

<blockquote>"Transformasi digital bukan tentang teknologi, tapi tentang bagaimana kita mengubah cara berpikir dan berbisnis." - Tim DIMATA</blockquote>`,
      categoryIds: [digitalInfo?.id, bisnis?.id].filter((id): id is number => id != null),
    },
    {
      slug: "pentingnya-cybersecurity-perusahaan-modern",
      title: "Pentingnya Cybersecurity untuk Perusahaan Modern",
      authorName: "DIMATA",
      status: "published",
      publishedAt: new Date("2026-07-10"),
      isFeatured: false,
      excerpt:
        "Ancaman siber semakin canggih. Pelajari bagaimana perusahaan dapat melindungi data dan sistem mereka dari serangan siber.",
      content: `<h2>Ancaman Siber di Era Digital</h2>
<p>Serangan siber semakin hari semakin canggih dan merugikan. Data dari BSSN menunjukkan bahwa Indonesia mengalami lebih dari 1,5 miliar serangan siber sepanjang tahun 2025.</p>

<h2>Tips Melindungi Perusahaan Anda</h2>
<ol>
  <li>Implementasi multi-factor authentication (MFA)</li>
  <li>Enkripsi data sensitif</li>
  <li>Regular security audit dan penetration testing</li>
  <li>Employee cybersecurity awareness training</li>
  <li>Backup data secara berkala</li>
</ol>

<h2>Solusi dari DIMATA</h2>
<p>DIMATA menyediakan konsultasi dan implementasi sistem keamanan siber yang disesuaikan dengan kebutuhan perusahaan Anda.</p>`,
      categoryIds: [teknologi?.id].filter((id): id is number => id != null),
    },
    {
      slug: "solusi-it-untuk-smart-city",
      title: "Solusi IT untuk Mewujudkan Smart City di Indonesia",
      authorName: "DIMATA",
      status: "published",
      publishedAt: new Date("2026-07-05"),
      isFeatured: false,
      excerpt:
        "Konsep smart city bukan lagi wacana. Pelajari bagaimana teknologi informasi dapat membantu mewujudkan kota pintar di Indonesia.",
      content: `<h2>Apa itu Smart City?</h2>
<p>Smart city adalah konsep pengelolaan kota yang menggunakan teknologi informasi dan komunikasi untuk meningkatkan efisiensi pelayanan publik, partisipasi masyarakat, dan kualitas hidup warga.</p>

<h2>Pilar Smart City</h2>
<ul>
  <li><strong>Smart Governance:</strong> Pelayanan publik berbasis digital</li>
  <li><strong>Smart Economy:</strong> Ekosistem bisnis digital</li>
  <li><strong>Smart Mobility:</strong> Transportasi cerdas dan terintegrasi</li>
  <li><strong>Smart Environment:</strong> Pengelolaan lingkungan berbasis data</li>
  <li><strong>Smart People:</strong> Masyarakat melek teknologi</li>
  <li><strong>Smart Living:</strong> Kualitas hidup yang lebih baik</li>
</ul>

<p>Dengan <a href="/products/aiso">Aiso</a>, DIMATA membantu pemerintah daerah dalam mengimplementasikan sistem informasi manajemen yang terintegrasi.</p>`,
      categoryIds: [digitalInfo?.id, teknologi?.id].filter((id): id is number => id != null),
    },
    {
      slug: "tips-memilih-solusi-erp-untuk-bisnis",
      title: "Tips Memilih Solusi ERP yang Tepat untuk Bisnis Anda",
      authorName: "DIMATA",
      status: "published",
      publishedAt: new Date("2026-06-28"),
      isFeatured: false,
      excerpt:
        "Memilih sistem ERP yang tepat sangat penting untuk efisiensi bisnis. Simak tips lengkapnya berikut ini.",
      content: `<h2>Mengapa ERP Penting?</h2>
<p>Enterprise Resource Planning (ERP) mengintegrasikan semua proses bisnis dalam satu sistem terpadu, mulai dari keuangan, SDM, hingga manajemen inventaris.</p>

<h2>Tips Memilih ERP</h2>
<ol>
  <li>Sesuaikan dengan skala bisnis Anda</li>
  <li>Pastikan fitur sesuai kebutuhan</li>
  <li>Perhatikan kemudahan integrasi</li>
  <li>Cek reputasi vendor dan dukungan teknis</li>
  <li>Hitung total cost of ownership (TCO)</li>
  <li>Minta demo dan trial sebelum memutuskan</li>
</ol>

<h2>Rekomendasi DIMATA</h2>
<p>DIMATA menawarkan solusi <a href="/products/prochain">ProChain</a> yang dapat dikustomisasi sesuai kebutuhan bisnis Anda, dengan dukungan teknis 24/7.</p>`,
      categoryIds: [tutorial?.id, bisnis?.id].filter((id): id is number => id != null),
    },
    {
      slug: "dilantik-presiden-dimata-resmi-jadi-mitra-it",
      title: "DIMATA Resmi Menjadi Mitra IT Pemerintah dalam Transformasi Digital Nasional",
      authorName: "Tim Humas DIMATA",
      status: "published",
      publishedAt: new Date("2026-06-20"),
      isFeatured: false,
      excerpt:
        "DIMATA IT Solutions resmi ditunjuk sebagai mitra strategis pemerintah dalam percepatan transformasi digital nasional.",
      content: `<h2>Pengumuman Resmi</h2>
<p>Jakarta, 20 Juni 2026 - PT DIMATA IT Solutions resmi ditunjuk sebagai mitra strategis Kementerian Komunikasi dan Informatika dalam program percepatan transformasi digital nasional. Penunjukan ini ditandai dengan penandatanganan MoU yang dilakukan di Jakarta.</p>

<h2>Ruang Lingkup Kerja Sama</h2>
<ul>
  <li>Pengembangan sistem informasi manajemen pemerintahan</li>
  <li>Implementasi smart city di 10 kota/kabupaten</li>
  <li>Pelatihan digitalisasi bagi ASN</li>
  <li>Pengembangan infrastruktur cloud computing</li>
</ul>

<p>"Kami bangga dapat dipercaya oleh pemerintah untuk berkontribusi dalam transformasi digital Indonesia," ujar CEO DIMATA dalam konferensi pers.</p>`,
      categoryIds: [pressRelease?.id].filter((id): id is number => id != null),
    },
  ];

  for (const postData of posts) {
    const { categoryIds, ...postFields } = postData;
    const existing = await prisma.blogPost.findUnique({ where: { slug: postData.slug } });
    if (!existing) {
      await prisma.blogPost.create({
        data: {
          ...postFields,
          isActive: true,
          sortOrder: 0,
          categories: {
            create: categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
      });
    }
  }

  console.log(`Seeded ${posts.length} blog posts`);
  console.log("Blog seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
