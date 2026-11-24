/**
 * A link to a file in public/ (photos, the calendar feed) that works wherever the site is served:
 * at the root of a domain, or in a folder such as GitHub Pages' /tise-website/. The build is
 * relative (base './' in vite.config.ts), so links resolve against the page itself.
 */
export function publicUrl(path: string, base: string = import.meta.env.BASE_URL): string {
  return `${base}${path.replace(/^\//, '')}`;
}
