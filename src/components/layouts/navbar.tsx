"use client";

/**
 * Navbar — Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + HeroUI v3
 *
 * Catatan penting soal HeroUI v3:
 * 1. Komponen <Navbar> bawaan sudah DIHAPUS di v3 (lihat migration guide resmi:
 *    heroui.com/docs/react/migration/navbar). Navbar di file ini disusun manual
 *    dari elemen HTML native (<nav>, <ul>, <li>) + Tailwind.
 * 2. `Button` HeroUI v3 (ButtonRootProps) TIDAK polymorphic — tidak ada prop
 *    `as` atau `endContent`. Karena itu, `Button` di sini hanya dipakai untuk
 *    elemen yang benar-benar <button> (toggle menu mobile), sedangkan CTA yang
 *    sifatnya navigasi (Contact) pakai <Link> biasa yang di-styling manual
 *    lewat `ctaLinkClass` supaya tampilannya tetap konsisten seperti tombol.
 *
 * Struktur menu:
 *   Home
 *   About Us         -> Company Profile, Visi Misi
 *   Produk & Solusi   -> Hairisma, Prochain, Hanoman, Aiso, Solutions
 *   Project
 *   Harga
 *   Acara
 *
 * Dropdown desktop berbentuk "mega menu" bergaya Mekari: setiap child punya
 * icon + judul + deskripsi singkat, dan panel ditutup dengan footer note +
 * link "lihat semua". Panel dibuat lebih lebar dan teksnya sedikit lebih
 * besar supaya lebih mudah dibaca.
 *
 * ICON PRODUK PAKAI GAMBAR:
 * Item produk (Hairisma, Prochain, Hanoman, Aiso) memakai `iconSrc` yang
 * menunjuk ke file di /public/img/products/<nama_product>-logo-no-text.png.
 * Khusus Hairisma disediakan 2 varian logo (mengikuti tema aplikasi):
 *   - light: /img/products/hairisma-logo-no-text.png
 *   - dark : /img/products/hairisma-logo-no-text-darkmode.png
 * Item non-produk (Company Profile, Visi Misi, Solutions) masih memakai
 * icon lucide-react biasa lewat field `icon`.
 *
 * PENTING: tambahkan key terjemahan baru ke id.json & en.json sesuai label
 * & description yang dipakai di DEFAULT_ITEMS di bawah ini.
 */

import {
  useEffect,
  startTransition,
  useSyncExternalStore,
  useState,
  useRef,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@heroui/react";
import {
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Building2,
  Target,
  Layers3,
  type LucideIcon,
  Briefcase,
} from "lucide-react";
import { ThemeLogo } from "@/components/ui/theme-logo";
import { useLanguage } from "@/contexts/language-context";

export interface NavItem {
  label: string;
  href: string;
  /** Translation key untuk deskripsi singkat (dipakai di mega menu). */
  description?: string;
  /** Icon lucide-react (dipakai kalau item TIDAK punya iconSrc gambar). */
  icon?: LucideIcon;
  /** Kelas warna background + text untuk bulatan icon lucide, mis. "bg-pink-500/10 text-pink-500". */
  iconClassName?: string;
  /** Path gambar logo/icon produk, mis. "/img/products/hairisma-logo-no-text.png". Jika diisi, ini dipakai alih-alih `icon`. */
  iconSrc?: string;
  /** Path gambar versi dark mode (opsional). Dipakai saat theme === "dark" jika tersedia. */
  iconSrcDark?: string;
  children?: NavItem[];
  /** Label kecil di atas grid dropdown, mis. "PRODUK & LAYANAN". */
  eyebrow?: string;
  /** Kelas grid untuk mega menu (jumlah kolom + lebar panel). */
  panelClassName?: string;
  /** Teks kecil di footer panel dropdown. */
  footerNote?: string;
  /** Label link di footer panel dropdown, mis. "Lihat semua produk". */
  footerCta?: string;
  /** Href untuk link footer. */
  footerHref?: string;
}

export interface NavbarProps {
  brandName?: string;
  logoSrc?: string;
  items?: NavItem[];
  ctaItem?: NavItem;
}

const DEFAULT_ITEMS: NavItem[] = [
  { label: "nav.home", href: "/" },
  {
    label: "nav.about",
    href: "#",
    eyebrow: "nav.about",
    panelClassName: "w-96 grid-cols-1",
    footerNote: "nav.about.footerNote",
    footerCta: "nav.about.footerCta",
    footerHref: "/about",
    children: [
      {
        label: "nav.about.companyProfile",
        href: "/about",
        description: "nav.about.companyProfile.desc",
        icon: Building2,
        iconClassName: "bg-blue-500/10 text-blue-500",
      },
      {
        label: "nav.visionMission",
        href: "/vision-mission",
        description: "nav.visionMission.desc",
        icon: Target,
        iconClassName: "bg-red-500/10 text-red-500",
      },
      {
        label: "nav.career",
        href: "/career",
        description: "nav.career.desc",
        icon: Briefcase,
        iconClassName: "bg-green-500/10 text-green-500",
      },
    ],
  },
  {
    label: "nav.productsandsolutions",
    href: "#",
    eyebrow: "nav.productsandsolutions",
    panelClassName: "w-[720px] grid-cols-1 sm:grid-cols-2",
    footerNote: "nav.productsandsolutions.footerNote",
    footerCta: "nav.productsandsolutions.footerCta",
    footerHref: "/products",
    children: [
      {
        label: "nav.products.hairisma",
        href: "/products/hairisma",
        description: "nav.products.hairisma.desc",
        iconSrc: "/img/products/hairisma-logo-no-text.png",
        iconSrcDark: "/img/products/hairisma-logo-no-text-darkmode.png",
      },
      {
        label: "nav.products.prochain",
        href: "/products/prochain",
        description: "nav.products.prochain.desc",
        iconSrc: "/img/products/prochain-logo-no-text.png",
      },
      {
        label: "nav.products.hanoman",
        href: "/products/hanoman",
        description: "nav.products.hanoman.desc",
        iconSrc: "/img/products/hanoman-logo-no-text.png",
      },
      {
        label: "nav.products.aiso",
        href: "/products/aiso",
        description: "nav.products.aiso.desc",
        iconSrc: "/img/products/aiso-logo-no-text.png",
      },
      {
        label: "nav.solutions",
        href: "/solutions",
        description: "nav.solutions.desc",
        icon: Layers3,
        iconClassName: "bg-orange-500/10 text-orange-500",
      },
    ],
  },
  { label: "nav.project", href: "/project" },
  { label: "nav.pricing", href: "/pricing" },
  { label: "nav.events", href: "/events" },
];

const DEFAULT_CTA: NavItem = { label: "nav.contact", href: "/contact" };

const ctaLinkClass =
  "inline-flex items-center justify-center gap-1.5 rounded-medium bg-primary px-4 py-2 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export function Navbar({
  brandName = "",
  logoSrc = "img/logo/logo-dimata-light.png",
  items = DEFAULT_ITEMS,
  ctaItem = DEFAULT_CTA,
}: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();

  // State menu utama & dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [mobileDropdownIndex, setMobileDropdownIndex] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLUListElement | null>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Pilih src gambar icon sesuai tema aktif (fallback ke versi light kalau
  // versi dark tidak disediakan, dan tidak error saat belum mounted).
  const resolveIconSrc = (child: NavItem) => {
    if (!child.iconSrc) return undefined;
    if (mounted && theme === "dark" && child.iconSrcDark) {
      return child.iconSrcDark;
    }
    return child.iconSrc;
  };

  // Mencegah scroll body saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Tutup semua menu (mobile dan dropdown) saat path berubah
  useEffect(() => {
    startTransition(() => {
      setIsMenuOpen(false);
      setOpenDropdownIndex(null);
      setMobileDropdownIndex(null);
    });
  }, [pathname]);

  // Tutup dropdown desktop saat klik di luar elemen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  // Mengecek apakah sub-menu aktif agar induknya mendapat styling active
  const isChildActive = (children?: NavItem[]) =>
    children?.some((child) => isActive(child.href)) ?? false;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-separator bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-medium"
        >
          {logoSrc ? (
            <ThemeLogo alt={brandName} className="h-8 w-auto" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-medium bg-foreground text-sm font-bold text-background">
              {brandName.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            {brandName}
          </span>
        </Link>

        {/* Menu desktop */}
        <ul ref={dropdownRef} className="hidden items-center gap-1 md:flex">
          {items.map((item, idx) => {
            const hasChildren = item.children && item.children.length > 0;
            const active = isActive(item.href) || isChildActive(item.children);

            if (hasChildren) {
              const isOpen = openDropdownIndex === idx;
              return (
                <li
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdownIndex(idx)}
                  onMouseLeave={() => setOpenDropdownIndex(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdownIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="group relative inline-flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-foreground/70 transition-colors hover:text-primary data-[active=true]:text-foreground focus-visible:outline-none"
                    data-active={active}
                  >
                    {t(item.label)}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                    <span
                      className={`pointer-events-none absolute inset-x-3 -bottom-px h-0.5 origin-center scale-x-0 bg-primary transition-transform duration-200 ease-out group-hover:scale-x-100 ${
                        active ? "scale-x-100" : ""
                      }`}
                    />
                  </button>

                  {/* Desktop Mega Menu Panel */}
                  <div
                    className={`absolute left-0 top-full pt-2 transition-all duration-200 ease-out ${
                      isOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-2 opacity-0"
                    }`}
                  >
                    <div
                      className={`rounded-large border border-separator bg-background/95 p-5 shadow-xl backdrop-blur-lg ${
                        item.panelClassName ?? "w-96 grid-cols-1"
                      }`}
                    >
                      {item.eyebrow && (
                        <p className="mb-3 px-2 text-[12px] font-semibold uppercase tracking-wider text-foreground/40">
                          {t(item.eyebrow)}
                        </p>
                      )}

                      <div
                        className={`grid gap-1.5 ${
                          item.panelClassName?.match(/grid-cols-\S+/g)?.join(" ") ??
                          "grid-cols-1"
                        }`}
                      >
                        {item.children?.map((child) => {
                          const childActive = isActive(child.href);
                          const ChildIcon = child.icon;
                          const imgSrc = resolveIconSrc(child);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              aria-current={childActive ? "page" : undefined}
                              className="group/item flex items-start gap-3.5 rounded-medium p-3 transition-colors hover:bg-primary/5 data-[active=true]:bg-primary/5"
                              data-active={childActive}
                            >
                              {imgSrc ? (
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                                  <img
                                    src={imgSrc}
                                    alt={t(child.label)}
                                    className="h-10 w-10 object-contain"
                                  />
                                </span>
                              ) : (
                                ChildIcon && (
                                  <span
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-medium ${
                                      child.iconClassName ??
                                      "bg-primary/10 text-primary"
                                    }`}
                                  >
                                    <ChildIcon className="h-5 w-5" />
                                  </span>
                                )
                              )}
                              <span className="flex min-w-0 flex-col">
                                <span className="text-[15px] font-semibold leading-tight text-foreground group-hover/item:text-primary">
                                  {t(child.label)}
                                </span>
                                {child.description && (
                                  <span className="mt-1 text-[13.5px] leading-snug text-foreground/50">
                                    {t(child.description)}
                                  </span>
                                )}
                              </span>
                            </Link>
                          );
                        })}
                      </div>

                      {(item.footerNote || item.footerCta) && (
                        <div className="mt-4 flex items-center justify-between gap-4 border-t border-separator px-2 pt-4">
                          {item.footerNote && (
                            <span className="text-[13px] text-foreground/50">
                              {t(item.footerNote)}
                            </span>
                          )}
                          {item.footerCta && item.footerHref && (
                            <Link
                              href={item.footerHref}
                              className="inline-flex shrink-0 items-center gap-1 text-[14px] font-medium text-primary hover:underline"
                            >
                              {t(item.footerCta)}
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative inline-flex items-center px-3 py-2 text-[14px] font-medium text-foreground/70 transition-colors hover:text-primary data-[active=true]:text-foreground"
                  data-active={active}
                >
                  {t(item.label)}
                  <span
                    className={`pointer-events-none absolute inset-x-3 -bottom-px h-0.5 origin-center scale-x-0 bg-primary transition-transform duration-200 ease-out group-hover:scale-x-100 ${
                      active ? "scale-x-100" : ""
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA + toggles */}
        <div className="flex items-center gap-2">
          <Link
            href={ctaItem.href}
            className={`hidden md:inline-flex ${ctaLinkClass}`}
          >
            {t(ctaItem.label)}
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          {mounted && (
            <>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                aria-label="Toggle theme"
                onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:inline-flex"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                aria-label="Toggle language"
                onPress={() => setLocale(locale === "id" ? "en" : "id")}
                className="hidden md:inline-flex"
              >
                <Globe className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase">
                  {locale === "id" ? "EN" : "ID"}
                </span>
              </Button>
            </>
          )}

          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMenuOpen}
            className="md:hidden"
            onPress={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Panel menu mobile */}
      <div
        className={`grid overflow-hidden border-t border-separator bg-background transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          isMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <ul className="flex flex-col gap-1 px-4 py-4">
            {items.map((item, idx) => {
              const hasChildren = item.children && item.children.length > 0;
              const active = isActive(item.href) || isChildActive(item.children);

              if (hasChildren) {
                const isMobileOpen = mobileDropdownIndex === idx;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileDropdownIndex(isMobileOpen ? null : idx)
                      }
                      className="flex w-full items-center justify-between rounded-medium px-3 py-2.5 text-[15px] font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary data-[active=true]:text-primary"
                      data-active={active}
                    >
                      <span>{t(item.label)}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isMobileOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile Accordion Dropdown (dengan icon) */}
                    <div
                      className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out ${
                        isMobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0">
                        <ul className="mt-1 flex flex-col gap-1 pl-4 border-l border-separator ml-3">
                          {item.children?.map((child) => {
                            const childActive = isActive(child.href);
                            const ChildIcon = child.icon;
                            const imgSrc = resolveIconSrc(child);
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  aria-current={
                                    childActive ? "page" : undefined
                                  }
                                  className="flex items-center gap-2.5 rounded-medium px-3 py-2 text-[14px] font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                                  data-active={childActive}
                                >
                                  {imgSrc ? (
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                                      <img
                                        src={imgSrc}
                                        alt={t(child.label)}
                                        className="h-7 w-7 object-contain"
                                      />
                                    </span>
                                  ) : (
                                    ChildIcon && (
                                      <span
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-small ${
                                          child.iconClassName ??
                                          "bg-primary/10 text-primary"
                                        }`}
                                      >
                                        <ChildIcon className="h-4 w-4" />
                                      </span>
                                    )
                                  )}
                                  {t(child.label)}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="block rounded-medium px-3 py-2.5 text-[15px] font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    data-active={active}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              );
            })}

            <li className="pt-2">
              <Link href={ctaItem.href} className={`w-full ${ctaLinkClass}`}>
                {t(ctaItem.label)}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </li>

            {mounted && (
              <>
                <li className="pt-2">
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    aria-label="Toggle theme"
                    onPress={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="w-full justify-start px-3 gap-2"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4" />
                        <span>{t("nav.lightMode")}</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        <span>{t("nav.darkMode")}</span>
                      </>
                    )}
                  </Button>
                </li>
                <li className="pt-1">
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    aria-label="Toggle language"
                    onPress={() => setLocale(locale === "id" ? "en" : "id")}
                    className="w-full justify-start px-3 gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span>
                      {locale === "id" ? "English" : "Bahasa Indonesia"}
                    </span>
                  </Button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
