import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("seed-started");

  const password = "senha123";
  const passwordHash =
    process.env.NODE_ENV === "test"
      ? password
      : await hash(password, process.env.NODE_ENV === "production" ? 10 : 1);

  if (process.env.NODE_ENV !== "test") {
    await prisma.user.createMany({
      data: [
        {
          name: "avaliador",
          email: "avaliador@fitscore.com",
          password: passwordHash,
          position: "avaliador",
        },
      ],
      skipDuplicates: true,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
