import { NextResponse } from "next/server";

/**
 * POST /api/kataloghub/scan
 *
 * Accepts a multipart/form-data upload with a "file" field. In production
 * this proxies to the FastAPI backend's catalog scan endpoint:
 *   POST {FASTAPI_URL}/api/catalogs/scan
 *
 * If the backend is unreachable (likely during local dev when only
 * Next.js is running) we fall back to a mocked scan_id so the UI flow
 * is exerciseable end-to-end. The fallback is opt-out via
 * KATALOGHUB_REQUIRE_BACKEND=true.
 */
const BACKEND_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REQUIRE_BACKEND = process.env.KATALOGHUB_REQUIRE_BACKEND === "true";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "missing 'file' field" },
      { status: 400 },
    );
  }

  // Try real backend first
  try {
    const backendForm = new FormData();
    backendForm.append("file", file);
    const backendRes = await fetch(`${BACKEND_URL}/api/catalogs/scan`, {
      method: "POST",
      body: backendForm,
      // 30 s budget; FastAPI scan should be quick for typical catalogs
      signal: AbortSignal.timeout(30_000),
    });
    if (!backendRes.ok) {
      if (REQUIRE_BACKEND) {
        return NextResponse.json(
          { error: `backend HTTP ${backendRes.status}` },
          { status: backendRes.status },
        );
      }
      // fall through to mock
    } else {
      const json = await backendRes.json();
      return NextResponse.json(json);
    }
  } catch (err) {
    if (REQUIRE_BACKEND) {
      return NextResponse.json(
        { error: `backend unreachable: ${String(err)}` },
        { status: 502 },
      );
    }
    // fall through to mock
  }

  // Mock fallback — fabricate a scan_id so the UI can navigate forward.
  const scanId = `HR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  return NextResponse.json({
    scan_id: scanId,
    catalog_id: scanId,
    filename: file.name,
    size: file.size,
    backend: "mock",
  });
}
