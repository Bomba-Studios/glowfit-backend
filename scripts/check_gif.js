import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const exercise = await prisma.exercise.findFirst({
    orderBy: { created_at: "desc" },
  });
  console.log("Latest Exercise:", exercise);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
