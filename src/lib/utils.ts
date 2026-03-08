import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeImageSrc(src: string): string {
  const trimmed = src.trim();

  if (!trimmed) return "/next.svg";

  const normalizedSlashes = trimmed.replace(/\\/g, "/");

  if (normalizedSlashes.startsWith("blob:") || normalizedSlashes.startsWith("data:")) {
    return normalizedSlashes;
  }

  if (normalizedSlashes.startsWith("http://") || normalizedSlashes.startsWith("https://")) {
    try {
      const parsedUrl = new URL(normalizedSlashes);
      const uploadPathMatch = parsedUrl.pathname.match(/(?:^|\/)uploads\/.+/);
      if (!uploadPathMatch) return normalizedSlashes;

      return `/${uploadPathMatch[0].replace(/^\/+/, "")}${parsedUrl.search}${parsedUrl.hash}`;
    } catch {
      return normalizedSlashes;
    }
  }

  const withoutDotPrefix = normalizedSlashes.replace(/^\.\//, "");
  const uploadPathMatch = withoutDotPrefix.match(/(?:^|\/)uploads\/.+/);

  if (uploadPathMatch) {
    return `/${uploadPathMatch[0].replace(/^\/+/, "")}`;
  }

  const withoutPublicPrefix = withoutDotPrefix.replace(/^public\//, "");
  const withSingleLeadingSlash = withoutPublicPrefix.startsWith("/")
    ? withoutPublicPrefix
    : `/${withoutPublicPrefix}`;

  return withSingleLeadingSlash.replace(/^\/+/, "/");
}
