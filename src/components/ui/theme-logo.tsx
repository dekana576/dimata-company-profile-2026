"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export interface ThemeLogoProps {
  lightSrc?: string;
  darkSrc?: string;
  alt?: string;
  className?: string;
}

export function ThemeLogo({
  lightSrc = "/img/logo/logo-dimata-light.png",
  darkSrc = "/img/logo/logo-dimata-dark.png",
  alt = "DIMATA IT Solutions",
  className = "h-8 w-auto",
}: ThemeLogoProps) {
  const { theme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const src = mounted && theme === "dark" ? darkSrc : lightSrc;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />;
}

export default ThemeLogo;
