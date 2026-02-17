import { z } from 'zod';

export function extractFormData(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};

  // The numeric prefix is internal Next.js behavior; we ignore it by taking the part after '_'
  for (const key of formData.keys()) {
    const actualKey = key.includes('_')
      ? key.substring(key.indexOf('_') + 1)
      : key;
    // Avoid overwriting if the same unprefixed key appears multiple times (unlikely)
    if (!(actualKey in raw)) {
      raw[actualKey] = formData.get(key);
    }
  }

  return raw;
}
