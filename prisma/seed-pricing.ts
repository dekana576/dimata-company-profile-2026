import { config } from "dotenv";
config();
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { parseDatabaseUrl } from "../src/lib/db-config";

const adapter = new PrismaMariaDb(parseDatabaseUrl());
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding pricing data...");

  // ─── Products ──────────────────────────────────────────────

  const products = [
    {
      key: "prochain",
      icon: "/img/products/prochain-logo-no-text.png",
      iconDark: null as string | null,
      descriptionId: "Manajemen struktur operasional — cabang, peran, dan SOP tetap sinkron.",
      descriptionEn: "Operational structure management — branches, roles, and SOPs in sync.",
      sortOrder: 0,
    },
    {
      key: "hanoman",
      icon: "/img/products/hanoman-logo-no-text.png",
      iconDark: null as string | null,
      descriptionId: "POS dan manajemen tamu — setiap transaksi dan profil tamu terekam.",
      descriptionEn: "POS and guest management — every transaction and profile captured.",
      sortOrder: 1,
    },
    {
      key: "hairisma",
      icon: "/img/products/hairisma-logo-no-text.png",
      iconDark: "/img/products/hairisma-logo-no-text-darkmode.png",
      descriptionId: "Kehadiran dan kinerja staf — absensi, jadwal shift, dan payroll.",
      descriptionEn: "Staff attendance and performance — schedules, shifts, and payroll.",
      sortOrder: 2,
    },
    {
      key: "aiso",
      icon: "/img/products/aiso-logo-no-text.png",
      iconDark: null as string | null,
      descriptionId: "Pelaporan keuangan real-time — pendapatan, penggajian, dan biaya.",
      descriptionEn: "Real-time financial reporting — revenue, payroll, and costs.",
      sortOrder: 3,
    },
  ];

  const productRecords: Record<string, number> = {};
  for (const p of products) {
    const record = await prisma.pricingProduct.upsert({
      where: { key: p.key },
      update: {
        icon: p.icon,
        iconDark: p.iconDark,
        descriptionId: p.descriptionId,
        descriptionEn: p.descriptionEn,
        sortOrder: p.sortOrder,
      },
      create: p,
    });
    productRecords[p.key] = record.id;
    console.log(`Product upserted: ${p.key} (id=${record.id})`);
  }

  // ─── Pricing Tiers + Features ──────────────────────────────

  interface TierData {
    name: string;
    price: number;
    period: string;
    highlighted?: boolean;
    badge?: string;
    features: { labelId: string; labelEn: string; included: boolean }[];
  }

  interface ProductDeployment {
    productKey: string;
    deployment: string;
    tiers: TierData[];
  }

  const allTiers: ProductDeployment[] = [
    // ── SaaS: ProChain ──
    {
      productKey: "prochain",
      deployment: "saas",
      tiers: [
        {
          name: "Standard", price: 150000, period: "/bulan/outlet",
          features: [
            { labelId: "Manajemen pesanan pembelian", labelEn: "Purchase order management", included: true },
            { labelId: "Pelacakan stok real-time", labelEn: "Real-time stock tracking", included: true },
            { labelId: "Laporan penjualan dasar", labelEn: "Basic sales reports", included: true },
            { labelId: "1 lokasi / 1 pengguna", labelEn: "1 location / 1 user", included: true },
            { labelId: "Multi-cabang", labelEn: "Multi-branch", included: false },
            { labelId: "Integrasi akuntansi", labelEn: "Accounting integration", included: false },
            { labelId: "API kustom", labelEn: "Custom API", included: false },
          ],
        },
        {
          name: "Professional", price: 350000, period: "/bulan/outlet", highlighted: true, badge: "Populer",
          features: [
            { labelId: "Manajemen pesanan pembelian", labelEn: "Purchase order management", included: true },
            { labelId: "Pelacakan stok real-time", labelEn: "Real-time stock tracking", included: true },
            { labelId: "Laporan penjualan lengkap", labelEn: "Comprehensive sales reports", included: true },
            { labelId: "Multi lokasi (hingga 10)", labelEn: "Multi location (up to 10)", included: true },
            { labelId: "Multi pengguna + role", labelEn: "Multi user + role management", included: true },
            { labelId: "Integrasi akuntansi", labelEn: "Accounting integration", included: true },
            { labelId: "API kustom", labelEn: "Custom API", included: false },
          ],
        },
        {
          name: "Premium", price: 650000, period: "/bulan/outlet",
          features: [
            { labelId: "Semua fitur Professional", labelEn: "All Professional features", included: true },
            { labelId: "Multi-cabang tanpa batas", labelEn: "Unlimited branches", included: true },
            { labelId: "Integrasi akuntansi lengkap", labelEn: "Full accounting integration", included: true },
            { labelId: "API kustom + Webhook", labelEn: "Custom API + Webhook", included: true },
            { labelId: "Dedicated account manager", labelEn: "Dedicated account manager", included: true },
            { labelId: "SLA 99.9% uptime", labelEn: "SLA 99.9% uptime", included: true },
            { labelId: "White-label opsional", labelEn: "Optional white-label", included: true },
          ],
        },
      ],
    },
    // ── SaaS: Hanoman ──
    {
      productKey: "hanoman",
      deployment: "saas",
      tiers: [
        {
          name: "Standard", price: 175000, period: "/bulan/outlet",
          features: [
            { labelId: "Sistem POS dasar", labelEn: "Basic POS system", included: true },
            { labelId: "Manajemen profil tamu", labelEn: "Guest profile management", included: true },
            { labelId: "Pencetakan struk", labelEn: "Receipt printing", included: true },
            { labelId: "Pembayaran tunai & non-tunai", labelEn: "Cash & non-cash payments", included: true },
            { labelId: "Reservasi online", labelEn: "Online reservation", included: false },
            { labelId: "CRM & loyalitas", labelEn: "CRM & loyalty", included: false },
            { labelId: "Integrasi marketplace", labelEn: "Marketplace integration", included: false },
          ],
        },
        {
          name: "Professional", price: 400000, period: "/bulan/outlet", highlighted: true, badge: "Populer",
          features: [
            { labelId: "Semua fitur Standard", labelEn: "All Standard features", included: true },
            { labelId: "Reservasi & booking online", labelEn: "Reservation & online booking", included: true },
            { labelId: "CRM + deposit pelanggan", labelEn: "CRM + customer deposit", included: true },
            { labelId: "Multi outlet (hingga 10)", labelEn: "Multi outlet (up to 10)", included: true },
            { labelId: "Denah meja interaktif", labelEn: "Interactive table map", included: true },
            { labelId: "Struk digital (WA/SMS)", labelEn: "Digital receipts (WA/SMS)", included: true },
            { labelId: "Integrasi marketplace", labelEn: "Marketplace integration", included: false },
          ],
        },
        {
          name: "Premium", price: 750000, period: "/bulan/outlet",
          features: [
            { labelId: "Semua fitur Professional", labelEn: "All Professional features", included: true },
            { labelId: "Multi outlet tanpa batas", labelEn: "Unlimited outlets", included: true },
            { labelId: "Integrasi marketplace", labelEn: "Marketplace integration", included: true },
            { labelId: "Loyalty program lengkap", labelEn: "Full loyalty program", included: true },
            { labelId: "Order online (GoFood/GrabFood)", labelEn: "Online ordering (GoFood/GrabFood)", included: true },
            { labelId: "API + custom integration", labelEn: "API + custom integration", included: true },
            { labelId: "Dedicated support 24/7", labelEn: "Dedicated support 24/7", included: true },
          ],
        },
      ],
    },
    // ── SaaS: Hairisma ──
    {
      productKey: "hairisma",
      deployment: "saas",
      tiers: [
        {
          name: "Standard", price: 125000, period: "/bulan/user",
          features: [
            { labelId: "Absensi online & geolokasi", labelEn: "Online & geo attendance", included: true },
            { labelId: "Jadwal shift dasar", labelEn: "Basic shift scheduling", included: true },
            { labelId: "Laporan kehadiran", labelEn: "Attendance reports", included: true },
            { labelId: "Hingga 50 karyawan", labelEn: "Up to 50 employees", included: true },
            { labelId: "Manajemen cuti", labelEn: "Leave management", included: false },
            { labelId: "Payroll", labelEn: "Payroll", included: false },
            { labelId: "Multi-cabang", labelEn: "Multi-branch", included: false },
          ],
        },
        {
          name: "Professional", price: 275000, period: "/bulan/user", highlighted: true, badge: "Populer",
          features: [
            { labelId: "Semua fitur Standard", labelEn: "All Standard features", included: true },
            { labelId: "Manajemen cuti & approval", labelEn: "Leave management & approval", included: true },
            { labelId: "Hingga 200 karyawan", labelEn: "Up to 200 employees", included: true },
            { labelId: "Payroll integrasi", labelEn: "Payroll integration", included: true },
            { labelId: "Laporan kinerja", labelEn: "Performance reports", included: true },
            { labelId: "Remote support 12 bulan", labelEn: "12-month remote support", included: true },
            { labelId: "Multi-cabang", labelEn: "Multi-branch", included: false },
          ],
        },
        {
          name: "Premium", price: 500000, period: "/bulan/user",
          features: [
            { labelId: "Semua fitur Professional", labelEn: "All Professional features", included: true },
            { labelId: "Karyawan tanpa batas", labelEn: "Unlimited employees", included: true },
            { labelId: "Multi-cabang lengkap", labelEn: "Full multi-branch", included: true },
            { labelId: "Rekrutmen & onboarding", labelEn: "Recruitment & onboarding", included: true },
            { labelId: "Penggajian lengkap", labelEn: "Full payroll", included: true },
            { labelId: "On-site training", labelEn: "On-site training", included: true },
            { labelId: "Priority support 24 bulan", labelEn: "24-month priority support", included: true },
          ],
        },
      ],
    },
    // ── SaaS: AISO ──
    {
      productKey: "aiso",
      deployment: "saas",
      tiers: [
        {
          name: "Standard", price: 150000, period: "/bulan",
          features: [
            { labelId: "Pembukuan dasar", labelEn: "Basic bookkeeping", included: true },
            { labelId: "Laporan keuangan standar", labelEn: "Standard financial reports", included: true },
            { labelId: "1 entitas bisnis", labelEn: "1 business entity", included: true },
            { labelId: "1 server + 3 user", labelEn: "1 server + 3 users", included: true },
            { labelId: "Multi-mata uang", labelEn: "Multi-currency", included: false },
            { labelId: "Integrasi bank", labelEn: "Bank integration", included: false },
            { labelId: "Pajak otomatis", labelEn: "Automated tax", included: false },
          ],
        },
        {
          name: "Professional", price: 350000, period: "/bulan", highlighted: true, badge: "Populer",
          features: [
            { labelId: "Semua fitur Standard", labelEn: "All Standard features", included: true },
            { labelId: "Multi-mata uang", labelEn: "Multi-currency", included: true },
            { labelId: "Multi entitas bisnis", labelEn: "Multi business entities", included: true },
            { labelId: "Invoice & faktur otomatis", labelEn: "Automated invoicing", included: true },
            { labelId: "Integrasi bank", labelEn: "Bank integration", included: true },
            { labelId: "Remote support 12 bulan", labelEn: "12-month remote support", included: true },
            { labelId: "Pajak otomatis", labelEn: "Automated tax", included: false },
          ],
        },
        {
          name: "Premium", price: 650000, period: "/bulan",
          features: [
            { labelId: "Semua fitur Professional", labelEn: "All Professional features", included: true },
            { labelId: "Pajak otomatis", labelEn: "Automated tax", included: true },
            { labelId: "Audit trail lengkap", labelEn: "Complete audit trail", included: true },
            { labelId: "Budgeting & forecasting", labelEn: "Budgeting & forecasting", included: true },
            { labelId: "On-site training", labelEn: "On-site training", included: true },
            { labelId: "Priority support 24 bulan", labelEn: "24-month priority support", included: true },
            { labelId: "Sumber kode tersedia", labelEn: "Source code available", included: true },
          ],
        },
      ],
    },
    // ── On-Premise: ProChain ──
    {
      productKey: "prochain",
      deployment: "onpremise",
      tiers: [
        {
          name: "Standard", price: 5000000, period: "lisensi lokal",
          features: [
            { labelId: "Instalasi server lokal", labelEn: "Local server installation", included: true },
            { labelId: "Manajemen pesanan & stok", labelEn: "Order & inventory management", included: true },
            { labelId: "Laporan penjualan dasar", labelEn: "Basic sales reports", included: true },
            { labelId: "1 server + 3 user", labelEn: "1 server + 3 users", included: true },
            { labelId: "Multi-cabang", labelEn: "Multi-branch", included: false },
            { labelId: "Pembaruan otomatis", labelEn: "Auto updates", included: false },
            { labelId: "Remote support", labelEn: "Remote support", included: false },
          ],
        },
        {
          name: "Professional", price: 15000000, period: "lisensi lokal", highlighted: true, badge: "Populer",
          features: [
            { labelId: "Semua fitur Standard", labelEn: "All Standard features", included: true },
            { labelId: "Multi-cabang (hingga 10)", labelEn: "Multi-branch (up to 10)", included: true },
            { labelId: "Multi user tanpa batas", labelEn: "Unlimited users", included: true },
            { labelId: "Integrasi akuntansi", labelEn: "Accounting integration", included: true },
            { labelId: "Pembaruan berkala", labelEn: "Periodic updates", included: true },
            { labelId: "Remote support 12 bulan", labelEn: "12-month remote support", included: true },
            { labelId: "Custom report", labelEn: "Custom report", included: false },
          ],
        },
        {
          name: "Premium", price: 35000000, period: "lisensi lokal",
          features: [
            { labelId: "Semua fitur Professional", labelEn: "All Professional features", included: true },
            { labelId: "Multi-cabang tanpa batas", labelEn: "Unlimited branches", included: true },
            { labelId: "Custom module & report", labelEn: "Custom module & report", included: true },
            { labelId: "Pembaruan seumur hidup", labelEn: "Lifetime updates", included: true },
            { labelId: "On-site training", labelEn: "On-site training", included: true },
            { labelId: "Priority support 24 bulan", labelEn: "24-month priority support", included: true },
            { labelId: "Sumber kode tersedia", labelEn: "Source code available", included: true },
          ],
        },
      ],
    },
    // ── On-Premise: Hanoman ──
    {
      productKey: "hanoman",
      deployment: "onpremise",
      tiers: [
        {
          name: "Standard", price: 7500000, period: "lisensi lokal",
          features: [
            { labelId: "POS offline lengkap", labelEn: "Full offline POS", included: true },
            { labelId: "Manajemen meja & kasir", labelEn: "Table & cashier management", included: true },
            { labelId: "Pencetakan struk", labelEn: "Receipt printing", included: true },
            { labelId: "1 server + 3 terminal", labelEn: "1 server + 3 terminals", included: true },
            { labelId: "Reservasi online", labelEn: "Online reservation", included: false },
            { labelId: "CRM & loyalitas", labelEn: "CRM & loyalty", included: false },
            { labelId: "Multi-cabang", labelEn: "Multi-branch", included: false },
          ],
        },
        {
          name: "Professional", price: 20000000, period: "lisensi lokal", highlighted: true, badge: "Populer",
          features: [
            { labelId: "Semua fitur Standard", labelEn: "All Standard features", included: true },
            { labelId: "Reservasi & booking", labelEn: "Reservation & booking", included: true },
            { labelId: "CRM + loyalty dasar", labelEn: "Basic CRM + loyalty", included: true },
            { labelId: "Multi terminal tanpa batas", labelEn: "Unlimited terminals", included: true },
            { labelId: "Multi-cabang (hingga 10)", labelEn: "Multi-branch (up to 10)", included: true },
            { labelId: "Remote support 12 bulan", labelEn: "12-month remote support", included: true },
            { labelId: "Integrasi marketplace", labelEn: "Marketplace integration", included: false },
          ],
        },
        {
          name: "Premium", price: 45000000, period: "lisensi lokal",
          features: [
            { labelId: "Semua fitur Professional", labelEn: "All Professional features", included: true },
            { labelId: "Multi-cabang tanpa batas", labelEn: "Unlimited branches", included: true },
            { labelId: "Integrasi marketplace", labelEn: "Marketplace integration", included: true },
            { labelId: "Loyalty program lengkap", labelEn: "Full loyalty program", included: true },
            { labelId: "On-site training", labelEn: "On-site training", included: true },
            { labelId: "Priority support 24 bulan", labelEn: "24-month priority support", included: true },
            { labelId: "Sumber kode tersedia", labelEn: "Source code available", included: true },
          ],
        },
      ],
    },
    // ── On-Premise: Hairisma ──
    {
      productKey: "hairisma",
      deployment: "onpremise",
      tiers: [
        {
          name: "Standard", price: 4000000, period: "lisensi lokal",
          features: [
            { labelId: "Absensi fingerprint/web", labelEn: "Fingerprint/web attendance", included: true },
            { labelId: "Jadwal shift dasar", labelEn: "Basic shift scheduling", included: true },
            { labelId: "Laporan kehadiran", labelEn: "Attendance reports", included: true },
            { labelId: "Hingga 50 karyawan", labelEn: "Up to 50 employees", included: true },
            { labelId: "Manajemen cuti", labelEn: "Leave management", included: false },
            { labelId: "Payroll", labelEn: "Payroll", included: false },
            { labelId: "Multi-cabang", labelEn: "Multi-branch", included: false },
          ],
        },
        {
          name: "Professional", price: 12000000, period: "lisensi lokal", highlighted: true, badge: "Populer",
          features: [
            { labelId: "Semua fitur Standard", labelEn: "All Standard features", included: true },
            { labelId: "Manajemen cuti & approval", labelEn: "Leave management & approval", included: true },
            { labelId: "Hingga 200 karyawan", labelEn: "Up to 200 employees", included: true },
            { labelId: "Payroll integrasi", labelEn: "Payroll integration", included: true },
            { labelId: "Laporan kinerja", labelEn: "Performance reports", included: true },
            { labelId: "Remote support 12 bulan", labelEn: "12-month remote support", included: true },
            { labelId: "Multi-cabang", labelEn: "Multi-branch", included: false },
          ],
        },
        {
          name: "Premium", price: 25000000, period: "lisensi lokal",
          features: [
            { labelId: "Semua fitur Professional", labelEn: "All Professional features", included: true },
            { labelId: "Karyawan tanpa batas", labelEn: "Unlimited employees", included: true },
            { labelId: "Multi-cabang lengkap", labelEn: "Full multi-branch", included: true },
            { labelId: "Rekrutmen & onboarding", labelEn: "Recruitment & onboarding", included: true },
            { labelId: "Penggajian lengkap", labelEn: "Full payroll", included: true },
            { labelId: "On-site training", labelEn: "On-site training", included: true },
            { labelId: "Priority support 24 bulan", labelEn: "24-month priority support", included: true },
          ],
        },
      ],
    },
    // ── On-Premise: AISO ──
    {
      productKey: "aiso",
      deployment: "onpremise",
      tiers: [
        {
          name: "Standard", price: 5000000, period: "lisensi lokal",
          features: [
            { labelId: "Pembukuan dasar", labelEn: "Basic bookkeeping", included: true },
            { labelId: "Laporan keuangan standar", labelEn: "Standard financial reports", included: true },
            { labelId: "1 entitas bisnis", labelEn: "1 business entity", included: true },
            { labelId: "1 server + 3 user", labelEn: "1 server + 3 users", included: true },
            { labelId: "Multi-mata uang", labelEn: "Multi-currency", included: false },
            { labelId: "Integrasi bank", labelEn: "Bank integration", included: false },
            { labelId: "Pajak otomatis", labelEn: "Automated tax", included: false },
          ],
        },
        {
          name: "Professional", price: 18000000, period: "lisensi lokal", highlighted: true, badge: "Populer",
          features: [
            { labelId: "Semua fitur Standard", labelEn: "All Standard features", included: true },
            { labelId: "Multi-mata uang", labelEn: "Multi-currency", included: true },
            { labelId: "Multi entitas bisnis", labelEn: "Multi business entities", included: true },
            { labelId: "Invoice & faktur otomatis", labelEn: "Automated invoicing", included: true },
            { labelId: "Integrasi bank", labelEn: "Bank integration", included: true },
            { labelId: "Remote support 12 bulan", labelEn: "12-month remote support", included: true },
            { labelId: "Pajak otomatis", labelEn: "Automated tax", included: false },
          ],
        },
        {
          name: "Premium", price: 35000000, period: "lisensi lokal",
          features: [
            { labelId: "Semua fitur Professional", labelEn: "All Professional features", included: true },
            { labelId: "Pajak otomatis", labelEn: "Automated tax", included: true },
            { labelId: "Audit trail lengkap", labelEn: "Complete audit trail", included: true },
            { labelId: "Budgeting & forecasting", labelEn: "Budgeting & forecasting", included: true },
            { labelId: "On-site training", labelEn: "On-site training", included: true },
            { labelId: "Priority support 24 bulan", labelEn: "24-month priority support", included: true },
            { labelId: "Sumber kode tersedia", labelEn: "Source code available", included: true },
          ],
        },
      ],
    },
  ];

  for (const pd of allTiers) {
    const productId = productRecords[pd.productKey];
    for (let ti = 0; ti < pd.tiers.length; ti++) {
      const t = pd.tiers[ti];
      const tier = await prisma.pricingTier.upsert({
        where: {
          productId_deployment_name: { productId, deployment: pd.deployment, name: t.name },
        },
        update: {
          price: t.price,
          period: t.period,
          highlighted: t.highlighted ?? false,
          badge: t.badge ?? null,
          sortOrder: ti,
        },
        create: {
          productId,
          deployment: pd.deployment,
          name: t.name,
          price: t.price,
          period: t.period,
          highlighted: t.highlighted ?? false,
          badge: t.badge ?? null,
          sortOrder: ti,
        },
      });

      // Delete old features then recreate
      await prisma.pricingFeature.deleteMany({ where: { tierId: tier.id } });
      for (let fi = 0; fi < t.features.length; fi++) {
        const f = t.features[fi];
        await prisma.pricingFeature.create({
          data: {
            tierId: tier.id,
            labelId: f.labelId,
            labelEn: f.labelEn,
            included: f.included,
            sortOrder: fi,
          },
        });
      }
      console.log(`  Tier ${pd.productKey}/${pd.deployment}/${t.name}: ${t.features.length} features`);
    }
  }

  // ─── Bundle Features ───────────────────────────────────────

  interface BundleFeatureData {
    productKey: string;
    deployment: string;
    tierName: string;
    features: { labelId: string; labelEn: string }[];
  }

  const allBundleFeatures: BundleFeatureData[] = [
    // SaaS bundle features
    { productKey: "prochain", deployment: "saas", tierName: "Standard", features: [
      { labelId: "Manajemen pesanan pembelian", labelEn: "Purchase order management" },
      { labelId: "Pelacakan stok real-time", labelEn: "Real-time stock tracking" },
      { labelId: "Laporan penjualan dasar", labelEn: "Basic sales reports" },
      { labelId: "1 lokasi / 1 pengguna", labelEn: "1 location / 1 user" },
    ]},
    { productKey: "prochain", deployment: "saas", tierName: "Professional", features: [
      { labelId: "Laporan penjualan lengkap", labelEn: "Comprehensive sales reports" },
      { labelId: "Multi lokasi (hingga 10)", labelEn: "Multi location (up to 10)" },
      { labelId: "Multi pengguna + role", labelEn: "Multi user + role management" },
      { labelId: "Integrasi akuntansi", labelEn: "Accounting integration" },
    ]},
    { productKey: "prochain", deployment: "saas", tierName: "Premium", features: [
      { labelId: "Multi-cabang tanpa batas", labelEn: "Unlimited branches" },
      { labelId: "Integrasi akuntansi lengkap", labelEn: "Full accounting integration" },
      { labelId: "API kustom + Webhook", labelEn: "Custom API + Webhook" },
      { labelId: "Dedicated account manager", labelEn: "Dedicated account manager" },
    ]},
    { productKey: "hanoman", deployment: "saas", tierName: "Standard", features: [
      { labelId: "Sistem POS dasar", labelEn: "Basic POS system" },
      { labelId: "Manajemen profil tamu", labelEn: "Guest profile management" },
      { labelId: "Pencetakan struk", labelEn: "Receipt printing" },
      { labelId: "Pembayaran tunai & non-tunai", labelEn: "Cash & non-cash payments" },
    ]},
    { productKey: "hanoman", deployment: "saas", tierName: "Professional", features: [
      { labelId: "Reservasi & booking online", labelEn: "Reservation & online booking" },
      { labelId: "CRM + deposit pelanggan", labelEn: "CRM + customer deposit" },
      { labelId: "Denah meja interaktif", labelEn: "Interactive table map" },
      { labelId: "Struk digital (WA/SMS)", labelEn: "Digital receipts (WA/SMS)" },
    ]},
    { productKey: "hanoman", deployment: "saas", tierName: "Premium", features: [
      { labelId: "Integrasi marketplace", labelEn: "Marketplace integration" },
      { labelId: "Loyalty program lengkap", labelEn: "Full loyalty program" },
      { labelId: "Order online (GoFood/GrabFood)", labelEn: "Online ordering (GoFood/GrabFood)" },
      { labelId: "Dedicated support 24/7", labelEn: "Dedicated support 24/7" },
    ]},
    { productKey: "hairisma", deployment: "saas", tierName: "Standard", features: [
      { labelId: "Absensi online (foto)", labelEn: "Online attendance (photo)" },
      { labelId: "Jadwal shift dasar", labelEn: "Basic shift scheduling" },
      { labelId: "Laporan kehadiran", labelEn: "Attendance reports" },
      { labelId: "Hingga 25 karyawan", labelEn: "Up to 25 employees" },
    ]},
    { productKey: "hairisma", deployment: "saas", tierName: "Professional", features: [
      { labelId: "Manajemen cuti & approval", labelEn: "Leave management & approval" },
      { labelId: "Absensi geolokasi", labelEn: "Geo-location attendance" },
      { labelId: "Hingga 100 karyawan", labelEn: "Up to 100 employees" },
      { labelId: "Integrasi payroll", labelEn: "Payroll integration" },
    ]},
    { productKey: "hairisma", deployment: "saas", tierName: "Premium", features: [
      { labelId: "Rekrutmen & onboarding", labelEn: "Recruitment & onboarding" },
      { labelId: "Penggajian lengkap", labelEn: "Full payroll system" },
      { labelId: "Struktur organisasi", labelEn: "Organization structure" },
      { labelId: "API + custom workflow", labelEn: "API + custom workflow" },
    ]},
    { productKey: "aiso", deployment: "saas", tierName: "Standard", features: [
      { labelId: "Pembukuan dasar", labelEn: "Basic bookkeeping" },
      { labelId: "Laporan laba rugi", labelEn: "Profit & loss reports" },
      { labelId: "Laporan neraca", labelEn: "Balance sheet" },
      { labelId: "1 bisnis / 1 akun", labelEn: "1 business / 1 account" },
    ]},
    { productKey: "aiso", deployment: "saas", tierName: "Professional", features: [
      { labelId: "Multi-mata uang", labelEn: "Multi-currency support" },
      { labelId: "Invoice & faktur otomatis", labelEn: "Automated invoicing" },
      { labelId: "Multi bisnis", labelEn: "Multi-business entities" },
      { labelId: "Integrasi bank", labelEn: "Bank integration" },
    ]},
    { productKey: "aiso", deployment: "saas", tierName: "Premium", features: [
      { labelId: "Laporan pajak otomatis", labelEn: "Automated tax reports" },
      { labelId: "Audit trail lengkap", labelEn: "Complete audit trail" },
      { labelId: "Budgeting & forecasting", labelEn: "Budgeting & forecasting" },
      { labelId: "Dedicated accountant support", labelEn: "Dedicated accountant support" },
    ]},
    // On-Premise bundle features
    { productKey: "prochain", deployment: "onpremise", tierName: "Standard", features: [
      { labelId: "Instalasi server lokal", labelEn: "Local server installation" },
      { labelId: "Manajemen pesanan & stok", labelEn: "Order & inventory management" },
      { labelId: "Laporan penjualan dasar", labelEn: "Basic sales reports" },
      { labelId: "1 server + 3 user", labelEn: "1 server + 3 users" },
    ]},
    { productKey: "prochain", deployment: "onpremise", tierName: "Professional", features: [
      { labelId: "Multi-cabang (hingga 10)", labelEn: "Multi-branch (up to 10)" },
      { labelId: "Multi user tanpa batas", labelEn: "Unlimited users" },
      { labelId: "Integrasi akuntansi", labelEn: "Accounting integration" },
      { labelId: "Remote support 12 bulan", labelEn: "12-month remote support" },
    ]},
    { productKey: "prochain", deployment: "onpremise", tierName: "Premium", features: [
      { labelId: "Multi-cabang tanpa batas", labelEn: "Unlimited branches" },
      { labelId: "Custom module & report", labelEn: "Custom module & report" },
      { labelId: "Pembaruan seumur hidup", labelEn: "Lifetime updates" },
      { labelId: "Sumber kode tersedia", labelEn: "Source code available" },
    ]},
    { productKey: "hanoman", deployment: "onpremise", tierName: "Standard", features: [
      { labelId: "POS offline lengkap", labelEn: "Full offline POS" },
      { labelId: "Manajemen meja & kasir", labelEn: "Table & cashier management" },
      { labelId: "Pencetakan struk", labelEn: "Receipt printing" },
      { labelId: "1 server + 3 terminal", labelEn: "1 server + 3 terminals" },
    ]},
    { productKey: "hanoman", deployment: "onpremise", tierName: "Professional", features: [
      { labelId: "Reservasi & booking", labelEn: "Reservation & booking" },
      { labelId: "CRM + loyalty dasar", labelEn: "Basic CRM + loyalty" },
      { labelId: "Multi terminal tanpa batas", labelEn: "Unlimited terminals" },
      { labelId: "Remote support 12 bulan", labelEn: "12-month remote support" },
    ]},
    { productKey: "hanoman", deployment: "onpremise", tierName: "Premium", features: [
      { labelId: "Multi-cabang tanpa batas", labelEn: "Unlimited branches" },
      { labelId: "Integrasi marketplace", labelEn: "Marketplace integration" },
      { labelId: "Loyalty program lengkap", labelEn: "Full loyalty program" },
      { labelId: "Sumber kode tersedia", labelEn: "Source code available" },
    ]},
    { productKey: "hairisma", deployment: "onpremise", tierName: "Standard", features: [
      { labelId: "Absensi fingerprint/web", labelEn: "Fingerprint/web attendance" },
      { labelId: "Jadwal shift dasar", labelEn: "Basic shift scheduling" },
      { labelId: "Laporan kehadiran", labelEn: "Attendance reports" },
      { labelId: "Hingga 50 karyawan", labelEn: "Up to 50 employees" },
    ]},
    { productKey: "hairisma", deployment: "onpremise", tierName: "Professional", features: [
      { labelId: "Manajemen cuti & approval", labelEn: "Leave management & approval" },
      { labelId: "Hingga 200 karyawan", labelEn: "Up to 200 employees" },
      { labelId: "Payroll integrasi", labelEn: "Payroll integration" },
      { labelId: "Remote support 12 bulan", labelEn: "12-month remote support" },
    ]},
    { productKey: "hairisma", deployment: "onpremise", tierName: "Premium", features: [
      { labelId: "Karyawan tanpa batas", labelEn: "Unlimited employees" },
      { labelId: "Multi-cabang lengkap", labelEn: "Full multi-branch" },
      { labelId: "Penggajian lengkap", labelEn: "Full payroll" },
      { labelId: "Sumber kode tersedia", labelEn: "Source code available" },
    ]},
    { productKey: "aiso", deployment: "onpremise", tierName: "Standard", features: [
      { labelId: "Pembukuan dasar", labelEn: "Basic bookkeeping" },
      { labelId: "Laporan keuangan standar", labelEn: "Standard financial reports" },
      { labelId: "1 entitas bisnis", labelEn: "1 business entity" },
      { labelId: "1 server + 3 user", labelEn: "1 server + 3 users" },
    ]},
    { productKey: "aiso", deployment: "onpremise", tierName: "Professional", features: [
      { labelId: "Multi-mata uang", labelEn: "Multi-currency" },
      { labelId: "Multi entitas bisnis", labelEn: "Multi business entities" },
      { labelId: "Integrasi bank", labelEn: "Bank integration" },
      { labelId: "Remote support 12 bulan", labelEn: "12-month remote support" },
    ]},
    { productKey: "aiso", deployment: "onpremise", tierName: "Premium", features: [
      { labelId: "Pajak otomatis", labelEn: "Automated tax" },
      { labelId: "Audit trail lengkap", labelEn: "Complete audit trail" },
      { labelId: "Budgeting & forecasting", labelEn: "Budgeting & forecasting" },
      { labelId: "Sumber kode tersedia", labelEn: "Source code available" },
    ]},
  ];

  for (const bf of allBundleFeatures) {
    const productId = productRecords[bf.productKey];
    // Delete old then recreate
    await prisma.pricingBundleFeature.deleteMany({
      where: { productId, deployment: bf.deployment, tierName: bf.tierName },
    });
    for (let i = 0; i < bf.features.length; i++) {
      await prisma.pricingBundleFeature.create({
        data: {
          productId,
          deployment: bf.deployment,
          tierName: bf.tierName,
          labelId: bf.features[i].labelId,
          labelEn: bf.features[i].labelEn,
          sortOrder: i,
        },
      });
    }
    console.log(`  Bundle: ${bf.productKey}/${bf.deployment}/${bf.tierName}: ${bf.features.length} features`);
  }

  // ─── Discounts ─────────────────────────────────────────────

  const discounts = [
    { minApps: 2, discountPercent: 5 },
    { minApps: 3, discountPercent: 10 },
    { minApps: 4, discountPercent: 15 },
  ];

  for (let i = 0; i < discounts.length; i++) {
    await prisma.pricingDiscount.upsert({
      where: { minApps: discounts[i].minApps },
      update: { discountPercent: discounts[i].discountPercent, sortOrder: i },
      create: { ...discounts[i], sortOrder: i },
    });
  }
  console.log("Discounts seeded");

  // ─── Comparison Features ───────────────────────────────────

  const comparisonFeatures = [
    { labelId: "Sinkronisasi cloud", labelEn: "Cloud sync", showStandard: true, showProfessional: true, showPremium: true },
    { labelId: "Multi pengguna", labelEn: "Multi-user", showStandard: true, showProfessional: true, showPremium: true },
    { labelId: "Laporan lanjutan", labelEn: "Advanced reports", showStandard: false, showProfessional: true, showPremium: true },
    { labelId: "Akses API", labelEn: "API access", showStandard: false, showProfessional: false, showPremium: true },
    { labelId: "Dedicated support", labelEn: "Dedicated support", showStandard: false, showProfessional: false, showPremium: true },
    { labelId: "Integrasi kustom", labelEn: "Custom integration", showStandard: false, showProfessional: false, showPremium: true },
    { labelId: "White-label", labelEn: "White-label", showStandard: false, showProfessional: false, showPremium: true },
    { labelId: "Training", labelEn: "Training", showStandard: false, showProfessional: true, showPremium: true },
  ];

  // Delete all existing then recreate
  await prisma.pricingComparison.deleteMany();
  for (let i = 0; i < comparisonFeatures.length; i++) {
    await prisma.pricingComparison.create({
      data: { ...comparisonFeatures[i], sortOrder: i },
    });
  }
  console.log("Comparison features seeded");

  console.log("Pricing seed complete!");
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
