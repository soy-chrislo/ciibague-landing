export const prerender = false;

const BACKEND = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3001';
const SITE = 'https://main.contactoinmobiliarioibague.com';

type SitemapItem = { slug: string; updatedAt: string };

export async function GET() {
  let items: SitemapItem[] = [];
  try {
    const res = await fetch(`${BACKEND}/properties/sitemap`);
    if (res.ok) {
      const json = await res.json();
      items = json.data || json;
    }
  } catch {}

  const staticUrls = ['/', '/remodelaciones', '/mapa/rent', '/mapa/sale'];
  const staticXml = staticUrls
    .map((p) => `  <url><loc>${SITE}${p}</loc><changefreq>weekly</changefreq></url>`)
    .join('\n');

  const propertyXml = items
    .map(
      (i) =>
        `  <url><loc>${SITE}/property/${i.slug}</loc><lastmod>${new Date(i.updatedAt).toISOString()}</lastmod><changefreq>daily</changefreq></url>`
    )
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${propertyXml}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
