import { NextResponse } from "next/server";

/**
 * POST /api/catalogs/upload
 * Accept multipart/form-data with a "file" field containing CSV.
 * Mock: returns a fake catalog id; doesn't actually persist anything.
 */
export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "expected multipart/form-data" },
      { status: 400 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "missing 'file' field" },
      { status: 400 },
    );
  }

  // Real implementation: stream to MinIO, store row, kick off scan job.
  const catalogId = `cat_${Math.random().toString(36).slice(2, 10)}`;
  return NextResponse.json({
    catalogId,
    filename: file.name,
    size: file.size,
    status: "uploaded",
  });
}
