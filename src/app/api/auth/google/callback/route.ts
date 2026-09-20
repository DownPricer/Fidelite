import { NextResponse } from "next/server";
import { consumeGoogleCallback } from "@/lib/google-auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const result = await consumeGoogleCallback(req, url.origin);
  return NextResponse.redirect(new URL(result.redirectTo, url.origin));
}
