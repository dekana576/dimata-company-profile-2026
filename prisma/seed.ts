import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { parseDatabaseUrl } from "../src/lib/db-config";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(parseDatabaseUrl());
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.CMS_ADMIN_EMAIL;
  const password = process.env.CMS_ADMIN_PASSWORD;
  const name = process.env.CMS_ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error(
      "CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD must be set in .env"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log(`Admin user created/updated: ${admin.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
