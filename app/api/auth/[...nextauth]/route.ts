import { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";

function withBasePath(req: NextRequest): NextRequest {
  if (!APP_BASE_PATH) return req;
  const url = new URL(req.url);
  if (!url.pathname.startsWith(APP_BASE_PATH + "/")) {
    url.pathname = APP_BASE_PATH + url.pathname;
    return new NextRequest(url.toString(), req);
  }
  return req;
}

export async function GET(req: NextRequest) {
  return handlers.GET(withBasePath(req));
}

export async function POST(req: NextRequest) {
  return handlers.POST(withBasePath(req));
}
