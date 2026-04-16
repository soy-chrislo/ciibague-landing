import { defineMiddleware } from 'astro:middleware';

const UUID_RE = /^\/property\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/i;
const BACKEND = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const onRequest = defineMiddleware(async (context, next) => {
  const match = context.url.pathname.match(UUID_RE);
  if (!match) return next();

  const uuid = match[1];
  try {
    const res = await fetch(`${BACKEND}/properties/${uuid}`);
    if (!res.ok) return next();
    const json = await res.json();
    const property = json.data || json;
    if (property?.slug) {
      return context.redirect(`/property/${property.slug}`, 301);
    }
  } catch {}
  return next();
});
