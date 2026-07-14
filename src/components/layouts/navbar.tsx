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
 */

import { useEffect, startTransition, useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@heroui/react";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  /** Nama brand yang tampil di sebelah logo mark */
  brandName?: string;
  /** Path gambar logo (opsional). Jika tidak diisi, dipakai monogram teks. */
  logoSrc?: string;
  /** Daftar menu navigasi */
  items?: NavItem[];
  /** Item yang ditampilkan sebagai CTA (tombol) di ujung kanan */
  ctaItem?: NavItem;
}

const DEFAULT_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Produk & Layanan", href: "/products" },
  { label: "Solution", href: "/solutions" },
  { label: "Vision & Mission", href: "/vision-mission" },
];

const DEFAULT_CTA: NavItem = { label: "Contact", href: "/contact" };

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Kunci scroll body saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Tutup menu mobile otomatis saat route berubah
  useEffect(() => {
    startTransition(() => {
      setIsMenuOpen(false);
    });
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-separator bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-medium"
        >
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt={brandName} className="h-8 w-auto" />
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
        <ul className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative inline-flex items-center px-3 py-2 text-[14px] font-medium text-foreground/70 transition-colors hover:text-primary data-[active=true]:text-foreground"
                  data-active={active}
                >
                  {item.label}
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

        {/* CTA + toggle */}
        <div className="flex items-center gap-2">
          <Link
            href={ctaItem.href}
            className={`hidden md:inline-flex ${ctaLinkClass}`}
          >
            {ctaItem.label}
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          {mounted && (
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
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="block rounded-medium px-3 py-2.5 text-[15px] font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    data-active={active}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link href={ctaItem.href} className={`w-full ${ctaLinkClass}`}>
                {ctaItem.label}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </li>
            {mounted && (
              <li className="pt-2">
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  aria-label="Toggle theme"
                  onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
