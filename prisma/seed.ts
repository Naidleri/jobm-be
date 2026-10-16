import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();
const seedPassword = process.env.SEED_COMPANY_PASSWORD ?? 'Password123!';

const companies = [
  {
    name: 'abc',
    email: 'abc@company.local',
    description: 'ABC company',
  },
  {
    name: 'xyz',
    email: 'xyz@company.local',
    description: 'XYZ company',
  },
  {
    name: 'sss',
    email: 'sss@company.local',
    description: 'SSS company',
  },
];

async function main(): Promise<void> {
  const password = await hash(seedPassword, 12);

  for (const company of companies) {
    const user = await prisma.user.upsert({
      where: { email: company.email },
      update: {
        name: company.name,
        password,
        role: 'COMPANY',
      },
      create: {
        name: company.name,
        email: company.email,
        password,
        role: 'COMPANY',
      },
    });

    await prisma.company.upsert({
      where: { userId: user.id },
      update: { description: company.description },
      create: {
        userId: user.id,
        description: company.description,
      },
    });
  }

  console.log(`Seeded ${companies.length} companies.`);
}

main()
  .catch((error: unknown) => {
    console.error('Company seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
