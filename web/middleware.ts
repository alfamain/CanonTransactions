import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The canon desk answers on exactly one hostname.
// Vercel additionally exposes preview and account-scoped hosts that serve the
// same document; a reader who cites one of those is citing an address the
// ledger does not reference. Everything outside the allow list is redirected.
const DESK_HOST = "canon-transactions.vercel.app";
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"];

function isAllowed(host: string | null): boolean {
  if (!host) return true;
  const name = host.split(":")[0];
  return name === DESK_HOST || LOCAL_HOSTS.includes(name);
}

export function middleware(request: NextRequest) {
  if (isAllowed(request.headers.get("host"))) {
    return NextResponse.next();
  }
  const desk = new URL(request.nextUrl.toString());
  desk.protocol = "https:";
  desk.host = DESK_HOST;
  desk.port = "";
  return NextResponse.redirect(desk, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
