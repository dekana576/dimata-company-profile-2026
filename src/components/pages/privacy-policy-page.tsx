"use client";

/**
 * Kebijakan Privasi — DIMATA IT Solutions
 * ------------------------------------------------------------------
 * Disarankan diletakkan di: app/privacy-policy/page.tsx
 * (atau app/kebijakan-privasi/page.tsx bila route Indonesia)
 *
 * Versi Minimalis:
 * - Tanpa ikon untuk tampilan yang lebih bersih, tenang, dan fokus pada teks.
 * - Mengandalkan penomoran monospaced (01-14) sebagai elemen panduan visual.
 * - Menggunakan token warna, grid, dan komponen animasi (AnimatedBackground, Reveal)
 *   yang senada dengan rancangan homepage.
 */

import Link from "next/link";
import { Chip, Card } from "@heroui/react";
import { Reveal } from "@/components/fragments/scroll-motion";
import { AnimatedBackground } from "@/components/fragments/animated-background";

/* ------------------------------------------------------------------ */
/* Status chip — padanan StatusChip "SYSTEM ONLINE" di homepage        */
/* ------------------------------------------------------------------ */

function StatusChip({
  label = "SYSTEM ONLINE",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Chip
      className={`inline-flex items-center gap-2 border border-foreground/15 bg-foreground/5 px-3 py-1 font-mono text-[11px] font-medium tracking-[0.08em] text-foreground/70 ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      {label}
    </Chip>
  );
}

/* ------------------------------------------------------------------ */
/* Data untuk sidebar TOC — angka 01–14 sebagai fokus visual minimalis */
/* ------------------------------------------------------------------ */

interface TocEntry {
  id: string;
  number: string;
  title: string;
}

const TOC: TocEntry[] = [
  { id: "pendahuluan", number: "01", title: "Pendahuluan" },
  { id: "definisi", number: "02", title: "Definisi" },
  { id: "data-dikumpulkan", number: "03", title: "Data yang Dikumpulkan" },
  { id: "tujuan-penggunaan", number: "04", title: "Tujuan Penggunaan Data" },
  { id: "dasar-hukum", number: "05", title: "Dasar Hukum Pemrosesan" },
  { id: "berbagi-data", number: "06", title: "Berbagi & Pengungkapan" },
  { id: "keamanan-data", number: "07", title: "Keamanan Data" },
  { id: "retensi-data", number: "08", title: "Retensi & Penghapusan" },
  { id: "hak-anda", number: "09", title: "Hak Anda" },
  { id: "cookie", number: "10", title: "Cookie & Pelacakan" },
  { id: "transfer-lintas-negara", number: "11", title: "Transfer Lintas Negara" },
  { id: "privasi-anak", number: "12", title: "Privasi Anak" },
  { id: "perubahan-kebijakan", number: "13", title: "Perubahan Kebijakan" },
  { id: "kontak", number: "14", title: "Hubungi Kami" },
];

const DEFINITIONS: { term: string; meaning: string }[] = [
  {
    term: "Data Pribadi",
    meaning:
      "Setiap informasi tentang perseorangan yang teridentifikasi atau dapat diidentifikasi, baik secara langsung maupun tidak langsung.",
  },
  {
    term: "Data Perusahaan",
    meaning:
      "Data operasional milik entitas Pelanggan yang diproses melalui modul suite DIMATA (ProChain, Hanoman, Hairisma, AISO), seperti data transaksi, inventaris, akuntansi, dan kepegawaian.",
  },
  {
    term: "Pengguna",
    meaning:
      "Individu yang diberi akses masuk ke akun Layanan oleh Pelanggan, termasuk staf, admin, atau pihak yang ditunjuk.",
  },
  {
    term: "Pelanggan",
    meaning: "Badan usaha atau perorangan yang berlangganan salah satu atau lebih Layanan DIMATA.",
  },
  {
    term: "Pemroses Data",
    meaning:
      "Pihak yang memproses Data Pribadi atas nama dan sesuai instruksi Pengendali Data (dalam hal ini, DIMATA).",
  },
];

const CONTACTS = [
  { label: "Surel", value: "marketing@dimata.id" },
  { label: "Telepon", value: "+62 81125031177" },
  { label: "Kantor Pusat", value: "Jl. Danau Tempe 21A, Sidakarya, Denpasar, Bali 80224" },
];

/* ------------------------------------------------------------------ */
/* Wrapper section — Card minimalis berbasis tipografi                 */
/* ------------------------------------------------------------------ */

function PolicySection({
  entry,
  children,
}: {
  entry: TocEntry;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <Card
        id={entry.id}
        variant="transparent"
        className="scroll-mt-32 rounded-[28px] border border-teal bg-background p-7 sm:p-10"
      >
        <div className="mb-6 flex items-center gap-4 border-b border-foreground/10 pb-5">
          <span className="font-mono text-[14px] font-semibold tracking-wider text-primary">
            {entry.number}
          </span>
          <h2 className="font-display text-[21px] font-semibold tracking-tight text-foreground sm:text-[23px]">
            {entry.title}
          </h2>
        </div>
        <div className="space-y-4 text-[14.5px] leading-relaxed text-foreground/65">
          {children}
        </div>
      </Card>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Callout minimalis — untuk highlight persetujuan / catatan penting  */
/* ------------------------------------------------------------------ */

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-teal bg-mint px-6 py-4">
      <p className="text-[13.5px] leading-relaxed text-foreground/75">
        {children}
      </p>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden bg-background pb-16 pt-32 text-foreground sm:pb-20">
        <AnimatedBackground />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] bg-dot-grid text-foreground"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-1/3 h-105 w-105 -translate-y-1/2 rounded-full bg-primary/15 blur-[150px]"
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="mt-7 font-display text-[38px] font-bold leading-[1.08] tracking-tight text-foreground sm:text-[50px]">
            Kebijakan <span className="text-primary">Privasi</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-foreground/60">
            Bagaimana DIMATA mengumpulkan, memproses, menyimpan, dan melindungi
            data yang mengalir melalui ProChain, Hanoman, Hairisma, dan AISO —
            mulai dari data akun Pelanggan hingga data operasional yang
            tersimpan di dalam sistem.
          </p>

          {/* Readout strip — padanan HERO_METRICS di homepage */}
          <div className="mt-10 flex w-full max-w-xl flex-wrap gap-x-10 gap-y-5 border-t border-foreground/10 pt-7">
            {[
              { label: "Berlaku sejak", value: "20 Jul 2026" },
              { label: "Versi dokumen", value: "2.1" },
              { label: "Yurisdiksi", value: "Indonesia" },
              { label: "Rujukan", value: "UU 27/2022 PDP" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="font-mono text-[15px] font-semibold text-foreground">
                  {item.value}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-foreground/45">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BODY: TOC + SECTIONS ================= */}
      <section className="relative bg-mint/40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[260px_1fr] lg:gap-14 lg:px-8">
          {/* Sidebar TOC Minimalis */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[24px] border border-teal bg-background p-4">
              <div className="px-2 pb-3 pt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/40">
                Daftar Isi
              </div>
              <nav className="flex flex-col gap-0.5">
                {TOC.map(({ id, number, title }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="group flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] font-medium text-foreground/65 transition-colors hover:bg-mint hover:text-foreground"
                  >
                    <span className="w-5 shrink-0 font-mono text-[11px] text-primary">
                      {number}
                    </span>
                    <span className="truncate">{title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content column */}
          <div className="flex flex-col gap-5">
            <PolicySection entry={TOC[0]}>
              <p>
                PT Dimata Sora Jayate (&ldquo;<strong className="text-foreground">DIMATA</strong>
                &rdquo;, &ldquo;<strong className="text-foreground">kami</strong>&rdquo;)
                mengoperasikan suite perangkat lunak terpadu — ProChain, Hanoman,
                Hairisma, dan AISO — beserta situs web, dashboard, API, dan
                layanan pendukung yang terhubung dengannya (secara bersama
                disebut &ldquo;<strong className="text-foreground">Layanan</strong>&rdquo;).
              </p>
              <p>
                Kebijakan Privasi ini menjelaskan bagaimana kami memperlakukan
                data pribadi milik Anda selaku pengguna, Pelanggan, calon
                Pelanggan, karyawan dari Pelanggan kami, maupun pengunjung
                situs kami (&ldquo;<strong className="text-foreground">Anda</strong>&rdquo;).
                Dokumen ini berlaku untuk setiap data yang diserahkan kepada
                kami, baik pada saat pendaftaran akun, penggunaan modul suite
                sehari-hari, maupun interaksi lain dengan tim DIMATA.
              </p>
              <Callout>
                Dengan membuat akun, mengakses dashboard, atau menggunakan
                salah satu modul Layanan DIMATA, Anda menyatakan telah
                membaca, memahami, dan menyetujui Kebijakan Privasi ini
                beserta Syarat dan Ketentuan Layanan yang menyertainya.
              </Callout>
            </PolicySection>

            <PolicySection entry={TOC[1]}>
              <div className="overflow-hidden rounded-2xl border border-teal">
                {DEFINITIONS.map((d, i) => (
                  <div
                    key={d.term}
                    className={`grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:gap-4 ${
                      i !== DEFINITIONS.length - 1 ? "border-b border-teal" : ""
                    } ${i % 2 === 0 ? "bg-background" : "bg-mint/50"}`}
                  >
                    <span className="font-mono text-[12.5px] font-semibold text-foreground">
                      {d.term}
                    </span>
                    <span className="text-[13.5px] leading-relaxed text-foreground/65">
                      {d.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </PolicySection>

            <PolicySection entry={TOC[2]}>
              <h3 className="font-display text-[15px] font-semibold text-foreground">
                3.1 Data yang Anda berikan langsung
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>Data identitas dan kontak: nama, jabatan, alamat surel, nomor telepon, alamat kantor.</li>
                <li>Data akun: nama pengguna, kata sandi terenkripsi, peran akses (role), preferensi modul.</li>
                <li>Data legalitas usaha: NIB, NPWP, akta pendirian, dan dokumen pendukung lain saat proses onboarding Pelanggan korporat.</li>
                <li>Data pembayaran dan penagihan: metode pembayaran, riwayat langganan, dan data faktur — diproses melalui mitra pembayaran berlisensi.</li>
              </ul>

              <h3 className="font-display text-[15px] font-semibold text-foreground pt-2">
                3.2 Data yang dihasilkan dari penggunaan Layanan
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>Data operasional yang Anda masukkan ke dalam modul suite (misalnya data penjualan, stok, akuntansi, atau kepegawaian), yang secara hukum tetap menjadi milik Pelanggan.</li>
                <li>Log aktivitas sistem: waktu masuk, alamat IP, jenis perangkat, versi peramban, dan jejak audit perubahan data.</li>
                <li>Data teknis: metrik performa, laporan kesalahan (error log), dan data diagnostik yang membantu kami menjaga keandalan sistem.</li>
              </ul>

              <h3 className="font-display text-[15px] font-semibold text-foreground pt-2">
                3.3 Data dari pihak ketiga
              </h3>
              <p>
                Bila Anda menghubungkan Layanan dengan sistem pihak ketiga —
                misalnya gateway pembayaran, layanan logistik, atau sistem
                perpajakan elektronik — kami dapat menerima data terkait
                sejauh diperlukan untuk menjalankan integrasi tersebut, sesuai
                otorisasi yang Anda berikan.
              </p>
            </PolicySection>

            <PolicySection entry={TOC[3]}>
              <p>Kami memproses data yang dikumpulkan untuk tujuan berikut:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Menyediakan, menjalankan, dan memelihara fungsi inti setiap modul suite yang Anda gunakan.</li>
                <li>Melakukan verifikasi identitas, autentikasi akun, dan pengelolaan hak akses pengguna.</li>
                <li>Memproses penagihan, memperbarui status langganan, dan mengelola siklus pembayaran.</li>
                <li>Memberikan dukungan teknis, menangani permintaan bantuan, dan menyelesaikan gangguan layanan.</li>
                <li>Meningkatkan keandalan, performa, dan keamanan sistem melalui analisis data agregat dan anonim.</li>
                <li>Memenuhi kewajiban hukum, termasuk kewajiban perpajakan, permintaan aparat penegak hukum yang sah, dan audit kepatuhan.</li>
                <li>Mengirimkan informasi terkait Layanan, seperti pemberitahuan pemeliharaan sistem, pembaruan fitur, atau perubahan kebijakan.</li>
              </ul>
              <Callout>
                Kami tidak menggunakan Data Perusahaan yang Anda masukkan ke
                dalam modul operasional untuk tujuan pemasaran ataupun
                membagikannya kepada pihak ketiga di luar penyedia
                infrastruktur yang mendukung Layanan.
              </Callout>
            </PolicySection>

            <PolicySection entry={TOC[4]}>
              <p>
                Kami memproses Data Pribadi Anda berdasarkan salah satu atau
                kombinasi dasar berikut, sejalan dengan Undang-Undang Nomor 27
                Tahun 2022 tentang Pelindungan Data Pribadi:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong className="text-foreground">Persetujuan</strong> — yang Anda berikan secara eksplisit pada saat pendaftaran atau melalui pengaturan preferensi.</li>
                <li><strong className="text-foreground">Pelaksanaan kontrak</strong> — pemrosesan yang diperlukan untuk menjalankan perjanjian langganan Layanan.</li>
                <li><strong className="text-foreground">Kewajiban hukum</strong> — misalnya kewajiban perpajakan atau permintaan resmi dari otoritas berwenang.</li>
                <li><strong className="text-foreground">Kepentingan sah</strong> — seperti pencegahan penipuan, pemeliharaan keamanan sistem, dan peningkatan kualitas Layanan, dijalankan secara proporsional dan tidak mengesampingkan hak Anda.</li>
              </ul>
            </PolicySection>

            <PolicySection entry={TOC[5]}>
              <p>Kami tidak menjual Data Pribadi Anda. Data dapat kami bagikan secara terbatas dalam situasi berikut:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong className="text-foreground">Penyedia infrastruktur teknis</strong> — seperti layanan komputasi awan dan penyimpanan data, yang terikat kewajiban kerahasiaan kontraktual dengan kami.</li>
                <li><strong className="text-foreground">Mitra pembayaran berlisensi</strong> — untuk memproses transaksi penagihan dan langganan secara aman.</li>
                <li><strong className="text-foreground">Integrasi pihak ketiga yang Anda aktifkan sendiri</strong> — misalnya sistem pajak elektronik, marketplace, atau logistik yang Anda hubungkan ke akun Anda.</li>
                <li><strong className="text-foreground">Otoritas hukum</strong> — apabila diwajibkan oleh peraturan perundang-undangan, perintah pengadilan, atau proses hukum yang sah.</li>
                <li><strong className="text-foreground">Transaksi korporasi</strong> — seperti merger, akuisisi, atau restrukturisasi bisnis, dengan tetap tunduk pada kewajiban perlindungan data yang setara.</li>
              </ul>
              <p>
                Setiap pihak ketiga yang menerima data dari kami terikat
                kewajiban kontraktual untuk menjaga kerahasiaan dan hanya
                memproses data sesuai instruksi serta tujuan yang telah
                disepakati.
              </p>
            </PolicySection>

            <PolicySection entry={TOC[6]}>
              <p>Kami menerapkan langkah-langkah teknis dan organisasional untuk melindungi data dalam suite DIMATA, termasuk namun tidak terbatas pada:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Enkripsi data saat transit (TLS) dan saat tersimpan (at rest) untuk data sensitif.</li>
                <li>Kontrol akses berbasis peran (role-based access control) di tingkat modul dan data.</li>
                <li>Pencatatan jejak audit (audit trail) atas setiap perubahan data penting dalam sistem.</li>
                <li>Pemantauan keamanan berkelanjutan dan pengujian kerentanan sistem secara berkala.</li>
                <li>Pembatasan akses internal — hanya personel yang memiliki kebutuhan operasional yang dapat mengakses data Pelanggan.</li>
              </ul>
              <p>
                Meski kami menerapkan standar keamanan yang wajar dan
                mengikuti praktik industri, tidak ada sistem transmisi maupun
                penyimpanan data elektronik yang sepenuhnya bebas risiko. Kami
                mendorong Anda untuk turut menjaga kerahasiaan kredensial akun
                dan segera melapor bila mencurigai adanya akses tidak sah.
              </p>
            </PolicySection>

            <PolicySection entry={TOC[7]}>
              <p>
                Kami menyimpan data selama akun Layanan Anda aktif, dan
                selanjutnya selama diperlukan untuk memenuhi tujuan yang
                dijelaskan dalam kebijakan ini, termasuk kewajiban hukum,
                akuntansi, atau pelaporan.
              </p>
              <p>
                Setelah masa langganan berakhir, Data Perusahaan yang
                tersimpan dalam modul suite akan disimpan pada masa tenggang
                tertentu untuk memungkinkan pemulihan atau ekspor data,
                sebagaimana diatur dalam perjanjian langganan, sebelum
                akhirnya dihapus atau dianonimkan secara permanen dari sistem
                produksi kami.
              </p>
            </PolicySection>

            <PolicySection entry={TOC[8]}>
              <p>Sesuai dengan peraturan pelindungan data yang berlaku, Anda berhak untuk:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Meminta akses dan salinan atas Data Pribadi yang kami simpan tentang Anda.</li>
                <li>Meminta koreksi atas data yang tidak akurat atau tidak lengkap.</li>
                <li>Meminta penghapusan data, sepanjang tidak bertentangan dengan kewajiban hukum yang berlaku.</li>
                <li>Menarik persetujuan yang sebelumnya Anda berikan, tanpa memengaruhi keabsahan pemrosesan yang telah dilakukan sebelumnya.</li>
                <li>Mengajukan keberatan atas pemrosesan tertentu, termasuk untuk tujuan pemasaran langsung.</li>
                <li>Meminta portabilitas data dalam format yang umum digunakan, sepanjang secara teknis memungkinkan.</li>
              </ul>
              <p>
                Untuk menggunakan hak-hak tersebut, silakan hubungi kami
                melalui kanal pada bagian 14. Kami akan menanggapi permintaan
                Anda dalam jangka waktu yang wajar sesuai ketentuan yang
                berlaku.
              </p>
            </PolicySection>

            <PolicySection entry={TOC[9]}>
              <p>
                Situs dan dashboard kami menggunakan cookie serta teknologi
                serupa untuk menjaga sesi masuk Anda tetap aktif, mengingat
                preferensi tampilan, dan memahami pola penggunaan secara
                agregat guna meningkatkan Layanan. Anda dapat mengatur ulang
                atau menonaktifkan cookie melalui pengaturan peramban, meski
                hal ini dapat memengaruhi fungsi tertentu pada dashboard.
              </p>
            </PolicySection>

            <PolicySection entry={TOC[10]}>
              <p>
                Sebagian infrastruktur teknis kami dapat berada di luar
                wilayah Indonesia. Apabila data ditransfer ke luar negeri,
                kami memastikan penerima data menerapkan tingkat perlindungan
                yang setara dan sesuai ketentuan transfer data lintas batas
                dalam UU Pelindungan Data Pribadi, termasuk melalui perjanjian
                pemrosesan data dan pengamanan kontraktual yang memadai.
              </p>
            </PolicySection>

            <PolicySection entry={TOC[11]}>
              <p>
                Layanan DIMATA dirancang untuk digunakan oleh pelaku usaha dan
                karyawan dewasa dalam konteks bisnis, dan tidak ditujukan bagi
                anak di bawah usia 18 tahun. Kami tidak dengan sengaja
                mengumpulkan Data Pribadi dari anak-anak. Apabila kami
                mengetahui adanya data semacam itu, kami akan menghapusnya
                sesegera mungkin.
              </p>
            </PolicySection>

            <PolicySection entry={TOC[12]}>
              <p>
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke
                waktu untuk mencerminkan perubahan pada Layanan, teknologi,
                atau ketentuan hukum yang berlaku. Perubahan material akan
                kami sampaikan melalui dashboard Layanan atau surel resmi
                sebelum tanggal berlaku efektif. Tanggal pembaruan terakhir
                selalu tercantum pada bagian atas dokumen ini.
              </p>
            </PolicySection>

            <PolicySection entry={TOC[13]}>
              <p>
                Untuk pertanyaan, permintaan terkait data pribadi, atau
                laporan insiden keamanan, silakan hubungi tim kami melalui:
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {CONTACTS.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col justify-center rounded-2xl border border-teal bg-mint px-5 py-4.5"
                  >
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/45">
                      {label}
                    </p>
                    <p className="mt-1.5 text-[14px] font-medium text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </PolicySection>
          </div>
        </div>
      </section>

      {/* ================= CLOSING CTA MINIMALIS ================= */}
      <section className="relative isolate overflow-hidden bg-background text-foreground">
        <AnimatedBackground />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] bg-dot-grid text-foreground"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[160px]"
        />
        <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="mt-7 font-display text-[30px] font-bold tracking-tight text-foreground sm:text-[38px]">
            Ada pertanyaan tentang data Anda?
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-foreground/60">
            Tim kami siap membantu permintaan akses, koreksi, atau penghapusan
            data — sesuai hak Anda pada bagian 09.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-[15px] font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
            >
              Hubungi Tim Privasi
            </Link>
            <Link
              href="/terms-of-service"
              className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-7 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/10"
            >
              Lihat Syarat & Ketentuan
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}