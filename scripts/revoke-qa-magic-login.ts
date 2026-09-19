import { prisma } from "../src/lib/prisma";

async function main() {
  const now = new Date();
  const [tokens, sessions] = await prisma.$transaction([
    prisma.qaMagicLoginToken.updateMany({
      where: { usedAt: null },
      data: { usedAt: now },
    }),
    prisma.session.deleteMany({
      where: { isQaMagicLogin: true },
    }),
  ]);

  console.log(`QA magic login tokens revoked: ${tokens.count}`);
  console.log(`QA magic login sessions revoked: ${sessions.count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
