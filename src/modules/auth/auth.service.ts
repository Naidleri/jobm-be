import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { AuthRepository } from './auth.repository.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterCompanyDto } from './dto/register-company.dto.js';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerJobSeeker(dto: RegisterJobSeekerDto) {
    const password = await hash(dto.password, 12);

    try {
      const user = await this.authRepository.createJobSeeker({
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        password,
      });

      return {
        message: 'Job seeker registered successfully',
        user: this.toPublicUser(user),
      };
    } catch (error) {
      this.throwIfDuplicateEmail(error);
      throw error;
    }
  }

  async registerCompany(dto: RegisterCompanyDto) {
    const password = await hash(dto.password, 12);

    try {
      const user = await this.authRepository.createCompany({
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        password,
        description: dto.description.trim(),
      });

      return {
        message: 'Company registered successfully',
        user: this.toPublicUser(user),
      };
    } catch (error) {
      this.throwIfDuplicateEmail(error);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findUserByEmail(
      dto.email.trim().toLowerCase(),
    );

    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const jwtSecret = this.configService.get<string>('app.jwtSecret');
    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT_SECRET is not configured');
    }

    const token = await this.jwtService.signAsync(
      { sub: user.id, role: user.role },
      { secret: jwtSecret, expiresIn: '1d' },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  private toPublicUser(user: { id: string; name: string; email: string; role: string }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  private throwIfDuplicateEmail(error: unknown): void {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Email is already registered');
    }
  }
}
