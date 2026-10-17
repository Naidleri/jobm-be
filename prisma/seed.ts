import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();
const seedPassword = process.env.SEED_COMPANY_PASSWORD ?? 'Password123!';

const companies = [
  {
    name: 'PT ABC',
    email: 'abc@company.local',
    description: 'PT ABC',
  },
  {
    name: 'PT XYZ',
    email: 'xyz@company.local',
    description: 'PT XYZ',
  },
  {
    name: 'PT SSS',
    email: 'sss@company.local',
    description: 'PT SSS',
  },
];

const jobs = [
  {
    companyEmail: 'abc@company.local',
    title: 'Backend Engineer',
    description: 'Build and maintain scalable backend services.',
    requirements: ['Node.js', 'TypeScript', 'PostgreSQL'],
    location: 'Jakarta',
    salaryMin: 12000000,
    salaryMax: 18000000,
    currency: 'IDR',
    jobType: 'FULL_TIME',
    status: 'OPEN',
  },
  {
    companyEmail: 'abc@company.local',
    title: 'Frontend Engineer',
    description: 'Develop responsive web applications for our customers.',
    requirements: ['React', 'TypeScript', 'CSS'],
    location: 'Bandung',
    salaryMin: 10000000,
    salaryMax: 16000000,
    currency: 'IDR',
    jobType: 'FULL_TIME',
    status: 'OPEN',
  },
  {
    companyEmail: 'abc@company.local',
    title: 'QA Engineer',
    description: 'Design and execute automated and manual test scenarios.',
    requirements: ['Testing', 'Playwright', 'API Testing'],
    location: 'Jakarta',
    salaryMin: 9000000,
    salaryMax: 14000000,
    currency: 'IDR',
    jobType: 'FULL_TIME',
    status: 'OPEN',
  },
  {
    companyEmail: 'xyz@company.local',
    title: 'Product Designer',
    description: 'Create clear and useful product experiences.',
    requirements: ['Figma', 'UX Research', 'UI Design'],
    location: 'Jakarta',
    salaryMin: 10000000,
    salaryMax: 17000000,
    currency: 'IDR',
    jobType: 'FULL_TIME',
    status: 'OPEN',
  },
  {
    companyEmail: 'xyz@company.local',
    title: 'Data Analyst',
    description: 'Turn business data into actionable insights.',
    requirements: ['SQL', 'Excel', 'Data Visualization'],
    location: 'Surabaya',
    salaryMin: 8000000,
    salaryMax: 13000000,
    currency: 'IDR',
    jobType: 'FULL_TIME',
    status: 'OPEN',
  },
  {
    companyEmail: 'xyz@company.local',
    title: 'Mobile Developer',
    description: 'Build and improve mobile applications for our platform.',
    requirements: ['Flutter', 'Dart', 'REST API'],
    location: 'Remote',
    salaryMin: 11000000,
    salaryMax: 18000000,
    currency: 'IDR',
    jobType: 'CONTRACT',
    status: 'OPEN',
  },
  {
    companyEmail: 'sss@company.local',
    title: 'DevOps Engineer',
    description: 'Improve deployment automation and platform reliability.',
    requirements: ['Docker', 'CI/CD', 'Cloud'],
    location: 'Jakarta',
    salaryMin: 13000000,
    salaryMax: 20000000,
    currency: 'IDR',
    jobType: 'FULL_TIME',
    status: 'OPEN',
  },
  {
    companyEmail: 'sss@company.local',
    title: 'Marketing Specialist',
    description: 'Plan and execute campaigns to grow our business.',
    requirements: ['Digital Marketing', 'SEO', 'Content'],
    location: 'Yogyakarta',
    salaryMin: 7000000,
    salaryMax: 11000000,
    currency: 'IDR',
    jobType: 'FULL_TIME',
    status: 'OPEN',
  },
  {
    companyEmail: 'sss@company.local',
    title: 'Customer Success Specialist',
    description: 'Help customers achieve their goals with our products.',
    requirements: ['Communication', 'Customer Support', 'CRM'],
    location: 'Remote',
    salaryMin: 6500000,
    salaryMax: 10000000,
    currency: 'IDR',
    jobType: 'FULL_TIME',
    status: 'OPEN',
  },
  {
    companyEmail: 'sss@company.local',
    title: 'Human Resources Specialist',
    description: 'Support hiring and people operations initiatives.',
    requirements: ['Recruitment', 'HR Operations', 'Communication'],
    location: 'Jakarta',
    salaryMin: 8000000,
    salaryMax: 13000000,
    currency: 'IDR',
    jobType: 'PART_TIME',
    status: 'OPEN',
  },
];

async function main(): Promise<void> {
  const password = await hash(seedPassword, 12);
  const companyIds = new Map<string, string>();

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

    companyIds.set(company.email, user.id);
  }

  for (const job of jobs) {
    const userId = companyIds.get(job.companyEmail);
    if (!userId) {
      throw new Error(`Company not found for job seed: ${job.companyEmail}`);
    }

    const company = await prisma.company.findUniqueOrThrow({
      where: { userId },
      select: { id: true },
    });

    await prisma.job.upsert({
      where: {
        companyId_title: {
          companyId: company.id,
          title: job.title,
        },
      },
      update: {
        description: job.description,
        requirements: job.requirements,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: job.currency,
        jobType: job.jobType,
        status: job.status,
      },
      create: {
        companyId: company.id,
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: job.currency,
        jobType: job.jobType,
        status: job.status,
      },
    });
  }

  console.log(`Seeded ${companies.length} companies and ${jobs.length} jobs.`);
}

main()
  .catch((error: unknown) => {
    console.error('Company seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
