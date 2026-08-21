import type { APIRoute } from "astro";
import { site } from "../data/site.ts";

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.url}/</loc></url>
  <url><loc>${site.url}/privacy</loc></url>
</urlset>
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
