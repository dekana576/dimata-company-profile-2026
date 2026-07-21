"use client";

/**
 * Syarat dan Ketentuan Layanan — DIMATA IT Solutions
 * ------------------------------------------------------------------
 * Disarankan diletakkan di: app/terms/page.tsx atau app/syarat-dan-ketentuan/page.tsx
 *
 * Versi Minimalis:
 * - Tanpa ikon, mengandalkan hierarki tipografi dan penomoran monospaced (01-13).
 * - Konsisten dengan desain komponen Kebijakan Privasi sebelumnya.
 */

import Link from "next/link";
import { Chip, Card } from "@heroui/react";
import { Reveal } from "@/components/fragments/scroll-motion";
import { AnimatedBackground } from "@/components/fragments/animated-background";

/* ------------------------------------------------------------------ */
/* Status chip minimalis                                              */
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
/* Daftar Isi (TOC)                                                   */
/* ------------------------------------------------------------------ */

interface TocEntry {
  id: string;
  number: string;
  title: string;
}

const TOC: TocEntry[] = [
  { id: "pendahuluan", number: "01", title: "Pendahuluan & Penerimaan" },
  { id: "definisi", number: "02", title: "Definisi Layanan" },
  { id: "pendaftaran-akun", number: "03", title: "Pendaftaran & Keamanan Akun" },
  { id: "pembayaran-langganan", number: "04", title: "Pembayaran & Berlangganan" },
  { id: "masa-percobaan", number: "05", title: "Masa Percobaan (Trial)" },
  { id: "penggunaan-sah", number: "06", title: "Batasan & Penggunaan Sah" },
  { id: "hak-kekayaan-intelektual", number: "07", title: "Hak Kekayaan Intelektual" },
  { id: "data-pelanggan", number: "08", title: "Kepemilikan Data Pelanggan" },
  { id: "pembatasan-tanggung-jawab", number: "09", title: "Pembatasan Tanggung Jawab" },
  { id: "ganti-rugi", number: "10", title: "Ganti Rugi" },
  { id: "penghentian-layanan", number: "11", title: "Penghentian Layanan" },
  { id: "hukum-yurisdiksi", number: "12", title: "Hukum & Yurisdiksi" },
  { id: "kontak", number: "13", title: "Hubungi Kami" },
];

const CONTACTS = [
  { label: "Surel Legal", value: "legal@dimata.id" },
  { label: "Telepon", value: "+62 21 5000 1234" },
  { label: "Kantor Pusat", value: "Jakarta, Indonesia" },
];

/* ------------------------------------------------------------------ */
/* Wrapper section — Card minimalis berbasis tipografi                 */
/* ------------------------------------------------------------------ */

function TermsSection({
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
/* Callout minimalis                                                  */
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

export default function TermsOfServicePage() {
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
          className="pointer-events-none absolute right-[-10%] top-1/3 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-primary/15 blur-[150px]"
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="mt-7 font-display text-[38px] font-bold leading-[1.08] tracking-tight text-foreground sm:text-[50px]">
            Syarat &amp; <span className="text-primary">Ketentuan</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-foreground/60">
            Perjanjian resmi yang mengatur hak, kewajiban, dan batasan dalam penggunaan 
            seluruh ekosistem perangkat lunak dan layanan DIMATA IT Solutions.
          </p>

          {/* Readout strip */}
          <div className="mt-10 flex w-full max-w-xl flex-wrap gap-x-10 gap-y-5 border-t border-foreground/10 pt-7">
            {[
              { label: "Berlaku sejak", value: "20 Jul 2026" },
              { label: "Versi dokumen", value: "3.0" },
              { label: "Yurisdiksi", value: "Indonesia" },
              { label: "Entitas", value: "PT Dimata Sora Jayate" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="font-mono text-[15px] font-semibold text-foreground">
                  {item.value}
                </span>
                <span className="text-[11px] uppercase tracking-[0.1em] text-foreground/45">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BODY ================= */}
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
            <TermsSection entry={TOC[0]}>
              <p>
                Syarat dan Ketentuan Layanan ini (&ldquo;<strong className="text-foreground">Ketentuan</strong>&rdquo;) 
                mengatur hubungan hukum antara PT Dimata Sora Jayate (&ldquo;<strong className="text-foreground">DIMATA</strong>&rdquo;, &ldquo;<strong className="text-foreground">kami</strong>&rdquo;) 
                dengan Anda selaku pengguna, klien korporat, atau badan usaha (&ldquo;<strong className="text-foreground">Pelanggan</strong>&rdquo;, &ldquo;<strong className="text-foreground">Anda</strong>&rdquo;) .
              </p>
              <p>
                Dengan mendaftar, mengunduh, mengakses dashboard, atau menggunakan modul perangkat lunak apa pun 
                yang disediakan oleh DIMATA, Anda menyatakan bahwa Anda telah membaca, memahami, dan setuju untuk 
                terikat oleh Ketentuan ini beserta Kebijakan Privasi kami .
              </p>
              <Callout>
                Jika Anda menyetujui Ketentuan ini atas nama badan hukum atau perusahaan, Anda menyatakan dan 
                menjamin bahwa Anda memiliki wewenang sah untuk mengikat entitas tersebut terhadap seluruh pasal dalam dokumen ini.
              </Callout>
            </TermsSection>

            <TermsSection entry={TOC[1]}>
              <p>
                &ldquo;<strong>Layanan</strong>&rdquo; mengacu pada seluruh ekosistem perangkat lunak berbasis awan (cloud), 
                on-premise, antarmuka pemrograman aplikasi (API), dan modul pendukung yang dikembangkan dan disediakan oleh DIMATA , termasuk namun tidak terbatas pada:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong className="text-foreground">ProChain:</strong> Sistem manajemen supply chain dan manufaktur terintegrasi.</li>
                <li><strong className="text-foreground">Hanoman:</strong> Platform Human Resource Information System (HRIS) dan payroll.</li>
                <li><strong className="text-foreground">Hairisma:</strong> Sistem manajemen properti (PMS) untuk perhotelan dan resor.</li>
                <li><strong className="text-foreground">AISO:</strong> Modul akuntansi profesional dan pelaporan keuangan bisnis.</li>
              </ul>
              <p>
                Layanan mencakup pembaruan sistem berkala, pemeliharaan teknis, serta fitur-fitur baru yang mungkin kami 
                rilis di masa mendatang .
              </p>
            </TermsSection>

            <TermsSection entry={TOC[2]}>
              <p>
                Untuk menggunakan Layanan, Anda diwajibkan memberikan informasi pendaftaran yang akurat, lengkap, dan terkini, 
                serta memperbaruinya jika terjadi perubahan (seperti email perusahaan, penanggung jawab teknis, atau identitas legal) .
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Anda bertanggung jawab penuh atas kerahasiaan kredensial login (username, kata sandi, token API) akun Anda .</li>
                <li>Segala aktivitas yang terjadi di bawah akun Anda akan dianggap sebagai aktivitas yang sah dari Anda .</li>
                <li>Anda wajib segera memberitahukan tim teknis DIMATA apabila mengetahui atau mencurigai adanya akses ilegal atau peretasan terhadap akun Anda .</li>
              </ul>
            </TermsSection>

            <TermsSection entry={TOC[3]}>
              <p>
                Sebagian besar Layanan kami disediakan dengan sistem berbayar berbasis langganan (&ldquo;<strong className="text-foreground">Layanan Premium</strong>&rdquo;) .
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong className="text-foreground">Siklus Tagihan:</strong> Tagihan akan diproses sesuai dengan siklus yang Anda pilih (bulanan atau tahunan) terhitung sejak tanggal aktivasi .</li>
                <li><strong className="text-foreground">Perubahan Harga:</strong> DIMATA berhak menyesuaikan struktur harga dengan memberikan pemberitahuan tertulis sekurang-kurangnya 30 hari sebelum siklus tagihan berikutnya efektif .</li>
                <li><strong className="text-foreground">Pajak &amp; Biaya:</strong> Seluruh biaya yang dibayarkan tidak termasuk pajak (PPN/PPh) serta biaya transaksi antarbank, yang sepenuhnya menjadi tanggungan Pelanggan .</li>
                <li><strong className="text-foreground">Keterlambatan:</strong> Keterlambatan pembayaran dapat mengakibatkan pembekuan sementara (suspensi) hak akses ke sistem hingga tunggakan dilunasi .</li>
              </ul>
              <Callout>
                Seluruh pembayaran yang telah berhasil diproses oleh sistem DIMATA bersifat final dan tidak dapat dikembalikan (non-refundable) , kecuali diatur secara khusus dalam perjanjian tingkat layanan (SLA) terpisah.
              </Callout>
            </TermsSection>

            <TermsSection entry={TOC[4]}>
              <p>
                DIMATA dapat menawarkan masa percobaan gratis (&ldquo;<strong className="text-foreground">Periode Trial</strong>&rdquo;) 
                selama durasi tertentu agar Anda dapat mengevaluasi fungsionalitas modul .
              </p>
              <p>
                Selama Periode Trial, Layanan disediakan sebagaimana adanya (*as is*) tanpa jaminan ketersediaan (uptime SLA) . 
                Apabila masa percobaan berakhir dan Anda tidak melakukan aktivasi langganan berbayar, akses Anda ke modul 
                tersebut akan dihentikan secara otomatis . Data yang telah Anda masukkan selama masa trial akan kami simpan 
                selama maksimal 30 hari sebelum dihapus secara permanen .
              </p>
            </TermsSection>

            <TermsSection entry={TOC[5]}>
              <p>
                Anda setuju untuk menggunakan Layanan hanya untuk tujuan bisnis operasional yang sah menurut hukum dan 
                peraturan perundang-undangan yang berlaku di Republik Indonesia . Anda secara tegas dilarang untuk:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Meyalin, memodifikasi, mengadaptasi, mendekompilasi, atau melalukan rekayasa balik (*reverse engineering*) pada kode sumber Layanan .</li>
                <li>Menyewakan, menjual kembali, atau mensublisensikan hak akses Layanan kepada pihak ketiga tanpa izin tertulis dari DIMATA .</li>
                <li>Menggunakan sistem untuk menyimpan atau mentransmisikan kode berbahaya (virus, *ransomware*, *malware*) .</li>
                <li>Melakukan pengujian kerentanan (*penetration testing* atau *stress test*) tanpa izin pengawasan dari tim keamanan DIMATA.</li>
              </ul>
            </TermsSection>

            <TermsSection entry={TOC[6]}>
              <p>
                Seluruh hak, kepemilikan, dan kepentingan atas Layanan, termasuk kode sumber, desain antarmuka, merek dagang, 
                logo, dan algoritma sistem, adalah kepemilikan eksklusif PT Dimata Sora Jayate .
              </p>
              <p>
                Ketentuan ini hanya memberikan Anda hak lisensi terbatas, non-eksklusif, dan tidak dapat dialihkan untuk 
                menggunakan perangkat lunak selama masa langganan aktif . Tidak ada pengalihan hak milik intelektual apa pun 
                yang terjadi dari DIMATA kepada Anda .
              </p>
            </TermsSection>

            <TermsSection entry={TOC[7]}>
              <p>
                Anda tetap menjadi pemilik sah secara hukum atas setiap data bisnis, catatan transaksi, data SDM, 
                dan file yang Anda masukkan ke dalam modul Layanan (&ldquo;<strong className="text-foreground">Data Pelanggan</strong>&rdquo;) .
              </p>
              <p>
                Anda memberikan hak terbatas kepada DIMATA semata-mata untuk memproses, menyimpan, dan melakukan 
                pencadangan (*backup*) atas Data Pelanggan demi keperluan operasional berjalannya Layanan . DIMATA 
                menjamin tidak akan menjual, menyebarkan, atau memanfaatkan Data Pelanggan untuk kepentingan komersial eksternal .
              </p>
            </TermsSection>

            <TermsSection entry={TOC[8]}>
              <p>
                Layanan disediakan berbasis &ldquo;sebagaimana adanya&rdquo; (*as is*) . Sejauh yang diizinkan oleh hukum yang berlaku, 
                DIMATA tidak bertanggung jawab atas:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Kerugian tidak langsung, insidental, atau konsekuensial, termasuk kehilangan keuntungan bisnis atau reputasi akibat gangguan sistem .</li>
                <li>Gangguan layanan yang disebabkan oleh keadaan kahar (*Force Majeure*), termasuk bencana alam, kebijakan pemerintah, atau putusnya jaringan infrastruktur telekomunikasi nasional.</li>
                <li>Kelalaian pihak ketiga, seperti kegagalan gateway pembayaran eksternal atau penyedia jaringan internet Anda .</li>
              </ul>
              <Callout>
                Dalam keadaan apa pun, batas maksimal akumulasi tanggung jawab finansial DIMATA atas segala klaim yang 
                timbul dari Ketentuan ini terbatas pada total biaya langganan yang telah dibayarkan oleh Pelanggan kepada 
                DIMATA dalam jangka waktu 1 (satu) bulan terakhir sebelum terjadinya peristiwa yang mendasari klaim .
              </Callout>
            </TermsSection>

            <TermsSection entry={TOC[9]}>
              <p>
                Anda setuju untuk membebaskan dan melindungi DIMATA, direksi, karyawan, dan mitranya dari segala tuntutan, 
                gugatan hukum, kerugian, atau biaya (termasuk biaya advokat) yang timbul akibat:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Pelanggaran Anda terhadap salah satu pasal dalam Ketentuan Layanan ini .</li>
                <li>Penyalahgunaan Layanan atau pemanfaatan modul yang melanggar hukum oleh akun Anda .</li>
                <li>Pelanggaran hak pihak ketiga atau sengketa internal yang terjadi di dalam organisasi bisnis Anda .</li>
              </ul>
            </TermsSection>

            <TermsSection entry={TOC[10]}>
              <p>
                DIMATA berhak menangguhkan atau mengakhiri layanan Anda secara sepihak dan seketika apabila Anda 
                terbukti melanggar ketentuan hukum, gagal melunasi tagihan yang telah jatuh tempo, atau melakukan ancaman keamanan terhadap sistem .
              </p>
              <p>
                Jika Anda memutuskan untuk mengakhiri langganan, Anda wajib memberikan pemberitahuan tertulis sekurang-kurangnya 
                14 hari sebelum masa siklus berakhir . DIMATA akan memberikan akses ekspor data selama 30 hari pasca-penghentian 
                sebelum data Anda dihapus secara permanen dari server produksi .
              </p>
            </TermsSection>

            <TermsSection entry={TOC[11]}>
              <p>
                Ketentuan Layanan ini diatur oleh, dan ditafsirkan sesuai dengan, hukum perundang-undangan Negara Kesatuan Republik Indonesia .
              </p>
              <p>
                Setiap perselisihan atau sengketa yang timbul dari penafsiran atau pelaksanaan Perjanjian ini pertama-tama 
                akan diselesaikan secara musyawarah untuk mufakat dalam jangka waktu 30 (tiga puluh) hari . Apabila mufakat 
                tidak tercapai, kedua belah pihak sepakat untuk menyelesaikan sengketa tersebut melalui yurisdiksi eksklusif 
                Pengadilan Negeri Jakarta Selatan .
              </p>
            </TermsSection>

            <TermsSection entry={TOC[12]}>
              <p>
                Apabila Anda memiliki pertanyaan, keberatan, atau membutuhkan penjelasan lebih lanjut terkait dokumen 
                Syarat dan Ketentuan ini, silakan hubungi tim legal kami:
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
            </TermsSection>

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
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[160px]"
        />
        <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
          
          <h2 className="mt-7 font-display text-[30px] font-bold tracking-tight text-foreground sm:text-[38px]">
            Butuh klarifikasi terkait kontrak layanan?
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-foreground/60">
            Tim kami bersedia membantu mendiskusikan *Service Level Agreement* (SLA) 
            maupun kebutuhan *Full Custom Solution* untuk perusahaan Anda.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-[15px] font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
            >
              Hubungi Tim Legal
            </Link>
            <Link
              href="/privacy-policy"
              className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-7 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/10"
            >
              Lihat Kebijakan Privasi
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}