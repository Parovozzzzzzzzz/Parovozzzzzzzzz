import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeImageSrc(src?: string | null): string {
  if (typeof src !== "string") return "/next.svg";

  const trimmed = src.trim();
  if (!trimmed) return "/next.svg";

  // Normalize backslashes to forward slashes
  const normalized = trimmed.replace(/\\/g, "/");

  // Return as-is for absolute URLs and data URIs
  if (
    normalized.startsWith("http://")
    || normalized.startsWith("https://")
    || normalized.startsWith("blob:")
    || normalized.startsWith("data:")
  ) {
    return normalized;
  }

  // Remove ./ and public/ prefixes
  const withoutDotPrefix = normalized.replace(/^\.\//, "");
  const withoutPublicPrefix = withoutDotPrefix.replace(/^public\//, "");

  // Ensure leading slash and normalize multiple slashes
  const path = withoutPublicPrefix.startsWith("/")
    ? withoutPublicPrefix
    : `/${withoutPublicPrefix}`;

  return path.replace(/^\/+/, "/");
}
