import { NextResponse } from "next/server";
import { CustomerAccessTokenKind } from "@prisma/client";
import { consumeCustomerAccessToken } from "@/lib/customer-access-token";
import { markCustomerProfileFinalized } from "@/lib/customer-onboarding";
import { prisma } from "@/lib/prisma";
import { writeAudit } from "@/lib/audit";
import { clientIp, userAgent } from "@/lib/http";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.redirect(new URL("/finalisation?email=invalid", url.origin));
  }

  const row = await consumeCustomerAccessToken(token, CustomerAccessTokenKind.EMAIL_VERIFICATION);
  if (!row) {
    return NextResponse.redirect(new URL("/finalisation?email=invalid", url.origin));
  }

  await prisma.user.update({
    where: { id: row.userId },
    data: { emailConfirmedAt: new Date() },
  });
  await markCustomerProfileFinalized(row.userId);
  await writeAudit({
    actorId: row.userId,
    action: "CUSTOMER_EMAIL_CONFIRMED",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return NextResponse.redirect(new URL("/finalisation?email=confirmed", url.origin));
}
