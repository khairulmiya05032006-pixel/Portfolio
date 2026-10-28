export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

export function getAbsoluteUrl(path: string): string {
  const base = getSiteUrl()
  return new URL(path, base).toString()
}
