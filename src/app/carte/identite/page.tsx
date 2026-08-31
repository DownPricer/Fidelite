import { redirect } from "next/navigation";
import { UniversalDetail } from "@/components/fife-life/universal-detail";
import { PREVIEW_HISTORY } from "@/components/fife-life/preview-data";
import { demoUniversalDetailProps, isDevVisualDemo } from "@/lib/demo-visual";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export default async function CarteIdentitePage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();

  if (!user) {
    if (isDevVisualDemo(params)) {
      const demo = demoUniversalDetailProps();
      return <UniversalDetail fifeLifePoints={demo.fifeLifePoints} history={demo.history} preview={demo.preview} />;
    }
    redirect("/connexion");
  }

  const history = await prisma.fifeLifePointsLedger.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <UniversalDetail
      fifeLifePoints={user.fifeLifePoints}
      preview={false}
      history={history.map((row) => ({
        id: row.id,
        type: "EARN_VISIT",
        pointsDelta: row.delta,
        reason: row.reason,
        createdAt: row.createdAt.toISOString(),
      }))}
    />
  );
}
