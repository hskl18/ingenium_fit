// Utility helpers for robust image rendering
// Normalizes URLs and provides a fallback placeholder

// Reuse app logo as a guaranteed-present placeholder
import DefaultPlaceholder from "@/assets/logo/logo.png";

export function normalizeImageUrl(url?: string | null): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  // If already data uri or local file or require() numeric id
  if (/^(data:|file:)/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // If it looks like protocol-less URL, add https
  if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
  // If it's missing protocol, try https
  return `https://${trimmed}`;
}
export const DEFAULT_PLACEHOLDER = DefaultPlaceholder;
