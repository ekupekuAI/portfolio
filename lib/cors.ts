import { NextResponse } from "next/server";

/**
 * The static portfolio at ekupekuai.github.io calls these API routes from the
 * browser, so they need CORS. Only the site's own origins are allowed; secrets
 * never leave the server either way.
 */
const ALLOWED_ORIGINS = new Set([
  "https://ekupekuai.github.io",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
]);

export function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** Adds CORS headers for the request's origin to a JSON response. */
export function withCors(response: NextResponse, request: Request): NextResponse {
  const headers = corsHeaders(request.headers.get("origin"));
  for (const [k, v] of Object.entries(headers)) response.headers.set(k, v);
  return response;
}

/** Preflight handler shared by every route. */
export function preflight(request: Request): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}
