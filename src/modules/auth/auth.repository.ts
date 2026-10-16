import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });
  }

  createJobSeeker(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({
      data: { ...data, role: 'JOB_SEEKER' },
    });
  }

  createCompany(data: {
    name: string;
    email: string;
    password: string;
    description: string;
  }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'COMPANY',
        company: { create: { description: data.description } },
      },
      include: { company: true },
    });
  }
}
