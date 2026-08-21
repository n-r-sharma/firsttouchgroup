const PLACEHOLDER_PATTERN =
  /placeholder|example\.invalid|xxxxx|your_|changeme|todo|g-xxxxxxxxxx|07900\s*123|7900123/i;

export function isPlaceholderValue(value: string | undefined | null): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  return PLACEHOLDER_PATTERN.test(trimmed);
}

export function isUsableFormId(value: string | undefined | null): boolean {
  if (!value || isPlaceholderValue(value)) return false;
  return /^[A-Za-z0-9]{6,}$/.test(value.trim());
}

export function isUsableGaId(value: string | undefined | null): boolean {
  if (!value || isPlaceholderValue(value)) return false;
  return /^G-[A-Z0-9]+$/i.test(value.trim());
}

export function isUsableCookiebotId(value: string | undefined | null): boolean {
  if (!value || isPlaceholderValue(value)) return false;
  return /^[0-9a-f-]{8,}$/i.test(value.trim());
}
