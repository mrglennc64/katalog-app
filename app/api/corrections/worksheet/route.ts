import { NextResponse } from "next/server";
import type { WorksheetRow } from "@/lib/types";

/**
 * POST /api/corrections/worksheet
 * Accept the publisher's filled-in worksheet (publisher confirms each
 * suggested correction). Mock: echoes back what was received.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("catalogId" in body) ||
    !("worksheet" in body) ||
    !Array.isArray((body as { worksheet: unknown }).worksheet)
  ) {
    return NextResponse.json(
      { error: "expected { catalogId: string, worksheet: WorksheetRow[] }" },
      { status: 400 },
    );
  }

  const { catalogId, worksheet } = body as {
    catalogId: string;
    worksheet: WorksheetRow[];
  };

  // Real implementation: validate against schema, persist decisions,
  // notify HeyRoya correction queue, return 202.
  const accepted = worksheet.filter((r) => r.decision === "accept").length;
  const rejected = worksheet.filter((r) => r.decision === "reject").length;
  const edited = worksheet.filter((r) => r.decision === "edit").length;
  const unresolved = worksheet.filter((r) => r.decision == null).length;

  return NextResponse.json({
    catalogId,
    received: worksheet.length,
    accepted,
    rejected,
    edited,
    unresolved,
  });
}
