# Development Notes

Catatan perkembangan dan known limitations yang perlu diperhatikan developer.

## Pricing — Hardcoded Product List

### Status: Known Limitation (2026-07-22)

Saat ini product list di pricing page masih **hardcoded** di 2 tempat:

1. **API** (`src/app/api/pricing/route.ts:31`) — `productKeys` array berisi 4 key produk
2. **Frontend** (`src/components/pages/pricing-page.tsx:34-39`) — `PRODUCTS` array berisi 4 produk dengan icon & nameKey

Artinya: **Produk baru yang ditambahkan via CMS atau seed tidak akan muncul di halaman pricing public** sampai key-nya ditambahkan di kedua tempat tersebut.

### Workaround (Sementara)

Untuk menambah produk baru yang tampil di halaman pricing:

1. Jalankan seed / create via CMS
2. Tambah key di `src/app/api/pricing/route.ts` → `productKeys` array
3. Tambah metadata (icon, nameKey) di `src/components/pages/pricing-page.tsx` → `PRODUCTS` array
4. Tambah translation key `pricing.products.<key>` di `src/locales/id.json` dan `en.json`

### Future Plan

- Product tabs akan di-render dari data API (`apiData.products`) secara dinamis
- `PRODUCTS` array statis akan dijadikan lookup table saja (untuk icon dark mode, nameKey fallback)
- Setelah selesai, tambah produk baru cukup lewat CMS atau seed — tidak perlu edit code

---

## Pricing — Seed Separation

### Status: By Design

Seed pricing (`prisma/seed-pricing.ts`) dipisah dari seed utama (`prisma/seed.ts`) karena:
- Seed utama dijalankan otomatis oleh `npx prisma db seed`
- Seed pricing dijalankan manual: `npx tsx prisma/seed-pricing.ts`
- **Jalankan sekali di awal saja** — jangan berulang karena data pricing sudah bisa dikelola dari CMS

### Jalur Aman

- `npx prisma db seed` → aman dijalankan berulang (upsert admin user)
- `npx tsx prisma/seed-pricing.ts` → **sekali saja** di awal, atau setelah DB fresh

---

## Pricing — API Route Structure

### Status: Complete

| Endpoint | Method | Fungsi |
|---|---|---|
| `/api/pricing` | GET | Public (lang-aware) |
| `/api/pricing/admin` | GET | Admin (auth) |
| `/api/pricing/product` | POST | Create produk + auto 6 tiers |
| `/api/pricing/product/[id]` | PUT | Update produk |
| `/api/pricing/product/[id]` | DELETE | Delete produk (cascade) |
| `/api/pricing/tier/[id]` | PUT | Update tier |
| `/api/pricing/feature` | POST | Create feature |
| `/api/pricing/feature/[id]` | PUT/DELETE | Update/delete feature |
| `/api/pricing/bundle-feature` | POST | Create bundle feature |
| `/api/pricing/bundle-feature/[id]` | PUT/DELETE | Update/delete bundle feature |
| `/api/pricing/discount/[id]` | PUT | Update diskon |
| `/api/pricing/comparison` | POST | Create comparison row |
| `/api/pricing/comparison/[id]` | PUT/DELETE | Update/delete comparison |

---

## Terakhir Diperbarui

- 2026-07-22: Pricing CMS backend, product CRUD, deployment docs
