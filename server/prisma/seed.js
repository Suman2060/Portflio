import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { DEFAULTS } from "../src/module/site/defaults.js";

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL || 'sumandangol2060@gmail.com';
    const plainPassword = process.env.ADMIN_PASSWORD || 'suman@123';

    const passwordHash = await bcrypt.hash(plainPassword, 12);

    const admin = await prisma.adminUser.upsert({
        where: { email },
        update: {},
        create: { email, passwordHash },
    });
    console.log('Admin user ready:', admin.email);

    for (const [key, value] of Object.entries(DEFAULTS)) {
        await prisma.siteSetting.upsert({
            where: { key },
            update: {},
            create: { key, value: JSON.stringify(value) },
        });
    }
    console.log('Site settings seeded:', Object.keys(DEFAULTS).join(', '));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });