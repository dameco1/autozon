const MAX_BYTES = 10 * 1024 * 1024
const ACCEPT = ["image/jpeg", "image/png", "image/heic", "image/heif", "application/pdf"]

export function validateFiles(files: File[]): { ok: true } | { ok: false; error: string } {
  if (!files.length) return { ok: false, error: "Please upload at least one photo." }
  for (const f of files) {
    if (f.size > MAX_BYTES) return { ok: false, error: `File too large (max 10MB): ${f.name}` }
    if (f.type && !ACCEPT.includes(f.type) && !/\.(jpe?g|png|heic|pdf)$/i.test(f.name)) {
      return { ok: false, error: `Unsupported type: ${f.name}` }
    }
  }
  return { ok: true }
}

export const ACCEPTED_FILE_TYPES = ACCEPT
