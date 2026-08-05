import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

async function main(){
    const email = 'sumandangol2060@gmail.com';
    const plainPassword = 'suman@123';

    const passwordHash =  await bcrypt.hash(plainPassword,12);

    const admin =  await prisma.adminUser.upsert({
        where: {email},
        update:{},
        create:{
            email,
            passwordHash,
        },
    })
    console.log('Admin user ready:',admin.email)
}


main().catch((e)=>{
    console.error(e);
    process.exit(1);
})
.finally(async () =>{
    await prisma.$disconnect})
