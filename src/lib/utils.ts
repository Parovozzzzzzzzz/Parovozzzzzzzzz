import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeImageSrc(src?: string | null): string {
  if (typeof src !== "string") return "/next.svg";

  const trimmed = src.trim();
  if (!trimmed) return "/next.svg";

  const normalizedSlashes = trimmed.replace(/\\/g, "/");

  if (
    normalizedSlashes.startsWith("http://")
    || normalizedSlashes.startsWith("https://")
    || normalizedSlashes.startsWith("blob:")
    || normalizedSlashes.startsWith("data:")
  ) {
    return normalizedSlashes;
  }

  const withoutDotPrefix = normalizedSlashes.replace(/^\.\//, "");
  const withoutPublicPrefix = withoutDotPrefix.replace(/^public\//, "");
  const withLeadingSlash = withoutPublicPrefix.startsWith("/")
    ? withoutPublicPrefix
    : `/${withoutPublicPrefix}`;

  return withLeadingSlash.replace(/^\/+/, "/");
}
