import { NextRequest } from "next/server";

export function isAdminRequest(request: NextRequest): boolean {
  return request.cookies.get("admin_auth")?.value === "true";
}
