import { NextResponse } from "next/server";
import {
  findPublisherByOrg,
  findApprovedUser,
  createMagicToken,
} from "@/lib/auth-store";
import { sendMagicLink } from "@/lib/auth-mail";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";
const PUBLIC_DEV_LINK = process.env.NODE_ENV !== "production";

function originFromRequest(req: Request): string {
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host");
  if (host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  let body: { org_number?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const orgNumber = (body.org_number || "").trim();
  const email = (body.email || "").trim();

  if (!orgNumber) {
    return NextResponse.json({ error: "Ange organisationsnummer." }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Ange en giltig e-postadress." }, { status: 400 });
  }

  const publisher = findPublisherByOrg(orgNumber);
  if (!publisher) {
    return NextResponse.json(
      { error: "Organisationsnumret är inte registrerat. Begär åtkomst först." },
      { status: 404 },
    );
  }

  const approved = findApprovedUser(publisher.publisher_id, email);
  if (!approved) {
    return NextResponse.json(
      { error: "E-postadressen är inte godkänd för detta företag." },
      { status: 403 },
    );
  }

  const token = createMagicToken(publisher.publisher_id, email);
  const origin = originFromRequest(req);
  const url = `${origin}${APP_BASE_PATH}/api/auth/email/verify?token=${token}`;

  const sent = await sendMagicLink({ to: email, url });

  const response: Record<string, unknown> = {
    ok: true,
    delivered: sent.delivered,
    provider: sent.provider,
  };
  if (PUBLIC_DEV_LINK || !sent.delivered) {
    response.dev_link = url;
  }
  return NextResponse.json(response);
}
