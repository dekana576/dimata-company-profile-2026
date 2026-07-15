"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import type { SVGProps } from "react";
import { ThemeLogo } from "@/components/ui/theme-logo";
import { useLanguage } from "@/contexts/language-context";

/**
 * lucide-react sudah menghapus ikon brand/logo (Facebook, Instagram,
 * LinkedIn, dll.) di versi-versi terbaru karena alasan trademark, jadi
 * ikon-ikon ini dibuat manual sebagai SVG lokal.
 */
function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.87.24-1.46 1.49-1.46H16.5V4.36C16.24 4.32 15.36 4.25 14.33 4.25c-2.15 0-3.62 1.31-3.62 3.72V10.5H8.2v3h2.51V21h2.79z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.4 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.36 7.5 7.25 6.6 7.25 5.5C7.25 4.4 6.36 3.5 5.25 3.5ZM20.75 20.5V13.7C20.75 10.2 19.42 8.5 16.9 8.5C15.13 8.5 14.06 9.39 13.5 10.29V8.5H10.13C10.17 9.35 10.13 20.5 10.13 20.5H13.5V14C13.5 13.63 13.52 13.27 13.63 13C13.93 12.26 14.6 11.5 15.72 11.5C17.19 11.5 17.38 12.7 17.38 14.13V20.5H20.75Z" />
    </svg>
  );
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "facebook" | "instagram" | "linkedin";
}

export interface FooterProps {
  brandName?: string;
  tagline?: string;
  quickLinks?: FooterLink[];
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: SocialLink[];
  companyName?: string;
}

const DEFAULT_QUICK_LINKS: FooterLink[] = [
  { label: "nav.home", href: "/" },
  { label: "nav.about", href: "/about" },
  { label: "nav.products", href: "/products" },
  { label: "nav.solutions", href: "/solutions" },
  { label: "nav.visionMission", href: "/vision-mission" },
  { label: "nav.contact", href: "/contact" },
];

const DEFAULT_SOCIALS: SocialLink[] = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
];

const SOCIAL_ICON_MAP = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
};

export function Footer({
  brandName = "DIMATA",
  tagline = "IT Solutions",
  quickLinks = DEFAULT_QUICK_LINKS,
  email = "marketing@dimata.com",
  phone = "+62 81125031177",
  address = "Jl. Danau Tempe 21A, Sidakarya, Denpasar, Bali 80224",
  socialLinks = DEFAULT_SOCIALS,
  companyName = "DIMATA IT Solutions",
}: FooterProps) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-muted">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 md:grid-cols-12 lg:px-8">
        {/* Brand */}
        <div className="md:col-span-5 lg:col-span-4">
          <Link href="/" className="flex items-center">
            <ThemeLogo
              alt={`${brandName} ${tagline}`}
              className="h-9 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-foreground/60">
            {t("footer.description")}
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 lg:col-span-3">
          <h3 className="text-[15px] font-semibold text-foreground">
            {t("footer.quickLinks")}
          </h3>
          <ul className="mt-5 flex flex-col gap-3.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[15px] text-foreground/60 transition-colors hover:text-blue-400"
                >
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div className="md:col-span-4 lg:col-span-5">
          <h3 className="text-[15px] font-semibold text-foreground">
            {t("footer.contactInfo")}
          </h3>
          <ul className="mt-5 flex flex-col gap-3.5">
            <li>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-[15px] text-foreground/60 transition-colors hover:text-blue-400"
              >
                <Mail className="h-4.5 w-4.5 shrink-0" />
                {email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 text-[15px] text-foreground/60 transition-colors hover:text-blue-400"
              >
                <Phone className="h-4.5 w-4.5 shrink-0" />
                {phone}
              </a>
            </li>
            <li className="flex items-start gap-3 text-[15px] text-foreground/60">
              <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0" />
              <span>{address}</span>
            </li>
          </ul>

          {/* Social icons */}
          <div className="mt-5 flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = SOCIAL_ICON_MAP[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-medium text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-accent"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-separator">
        <div className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p className="text-[14px] text-foreground/60">
            &copy; {year} {companyName}. {t("footer.allRights")}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-[14px] text-foreground/60 transition-colors hover:text-accent"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/terms-of-service"
              className="text-[14px] text-foreground/60 transition-colors hover:text-accent"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
