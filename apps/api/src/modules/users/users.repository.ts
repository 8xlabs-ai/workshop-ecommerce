import { pool } from '../../db/pool.js';
import type { UserRole } from '@shopstream/shared-types';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: Date;
}

export const usersRepository = {
  async findByEmail(email: string): Promise<UserRow | null> {
    const res = await pool.query<UserRow>(
      `SELECT id, email, password_hash, first_name, last_name, role, created_at
         FROM users
        WHERE email = $1
        LIMIT 1`,
      [email],
    );
    return res.rows[0] ?? null;
  },

  async findById(id: string): Promise<UserRow | null> {
    const res = await pool.query<UserRow>(
      `SELECT id, email, password_hash, first_name, last_name, role, created_at
         FROM users
        WHERE id = $1
        LIMIT 1`,
      [id],
    );
    return res.rows[0] ?? null;
  },

  async insert(input: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }): Promise<UserRow> {
    const res = await pool.query<UserRow>(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, 'shopper')
       RETURNING id, email, password_hash, first_name, last_name, role, created_at`,
      [input.email, input.passwordHash, input.firstName, input.lastName],
    );
    if (!res.rows[0]) throw new Error('insert returned no rows');
    return res.rows[0];
  },
};
