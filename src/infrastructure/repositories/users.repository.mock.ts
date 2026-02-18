import { hashSync } from 'bcrypt-ts';

import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type {
  CreateUser,
  CreateOAuthUser,
  User,
} from '@/src/entities/models/user';
import { PASSWORD_SALT_ROUNDS } from '@/config';

export class MockUsersRepository implements IUsersRepository {
  private _users: User[];

  constructor() {
    this._users = [
      {
        id: '1',
        username: 'one',
        email: 'one@example.com',
        password_hash: hashSync('password-one', PASSWORD_SALT_ROUNDS),
        github_id: null,
        google_id: null,
      },
      {
        id: '2',
        username: 'two',
        email: 'two@example.com',
        password_hash: hashSync('password-two', PASSWORD_SALT_ROUNDS),
        github_id: null,
        google_id: null,
      },
      {
        id: '3',
        username: 'three',
        email: 'three@example.com',
        password_hash: hashSync('password-three', PASSWORD_SALT_ROUNDS),
        github_id: null,
        google_id: null,
      },
      // Example OAuth user with github_id
      {
        id: '4',
        username: 'githubuser',
        email: 'githubuser@example.com',
        password_hash: null,
        github_id: '12345',
        google_id: null,
      },
      // Example OAuth user with google_id
      {
        id: '5',
        username: 'googleuser',
        email: 'googleuser@example.com',
        password_hash: null,
        github_id: null,
        google_id: '67890',
      },
    ];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this._users.find((u) => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this._users.find((u) => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this._users.find((u) => u.email === email);
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    return this._users.find((u) => u.github_id === githubId);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return this._users.find((u) => u.google_id === googleId);
  }

  async createUser(input: CreateUser): Promise<User> {
    const newId = (this._users.length + 1).toString();
    const newUser: User = {
      id: newId,
      username: input.username,
      email: input.email,
      password_hash: hashSync(input.password, PASSWORD_SALT_ROUNDS),
      github_id: null,
      google_id: null,
    };
    this._users.push(newUser);
    return newUser;
  }

  async createOAuthUser(input: CreateOAuthUser): Promise<User> {
    const newId = (this._users.length + 1).toString();
    const newUser: User = {
      id: newId,
      username: input.username,
      email: input.email,
      password_hash: null,
      github_id: input.github_id ?? null,
      google_id: input.google_id ?? null,
    };
    this._users.push(newUser);
    return newUser;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const userIndex = this._users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    const updatedUser = { ...this._users[userIndex], ...data };
    this._users[userIndex] = updatedUser;
    return updatedUser;
  }
}
