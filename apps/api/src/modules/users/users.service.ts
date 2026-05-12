import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loadEnv } from '../../config/env.js';
import { ConflictError, UnauthorizedError } from '../../lib/errors.js';
import { usersRepository, type UserRow } from './users.repository.js';
import type { LoginInput, RegisterInput } from './users.schemas.js';

const env = loadEnv();

const issueToken = (user: UserRow): string =>
  jwt.sign({ email: user.email, role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    issuer: env.JWT_ISSUER,
    expiresIn: '7d',
  });

export const usersService = {
  async login(input: LoginInput): Promise<{ token: string; user: PublicUser }> {
    const row = await usersRepository.findByEmail(input.email);
    if (!row) throw new UnauthorizedError('Invalid email or password');
    const ok = await bcrypt.compare(input.password, row.password_hash);
    if (!ok) throw new UnauthorizedError('Invalid email or password');
    return { token: issueToken(row), user: toPublic(row) };
  },

  async register(input: RegisterInput): Promise<{ token: string; user: PublicUser }> {
    const existing = await usersRepository.findByEmail(input.email);
    if (existing) throw new ConflictError('Email already registered');
    const passwordHash = await bcrypt.hash(input.password, 12);
    const row = await usersRepository.insert({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    });
    return { token: issueToken(row), user: toPublic(row) };
  },
};

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'shopper' | 'admin';
}

const toPublic = (row: UserRow): PublicUser => ({
  id: row.id,
  email: row.email,
  firstName: row.first_name,
  lastName: row.last_name,
  role: row.role,
});
