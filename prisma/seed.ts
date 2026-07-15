import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "BaliDewata",
  database: "dimata_cms",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.CMS_ADMIN_EMAIL || "admin@dimata.com";
  const password = process.env.CMS_ADMIN_PASSWORD || "dimata123";

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: "Admin",
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
