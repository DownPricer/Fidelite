import { createDemoEnterResponse } from "@/lib/demo-session";

export async function GET(request: Request) {
  return createDemoEnterResponse(request, "merchant");
}
