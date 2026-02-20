import { eq } from 'drizzle-orm';
import { hash } from 'bcrypt-ts';

import { db } from '@/drizzle';
import { users } from '@/drizzle/schema';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import type {
  CreateUser,
  CreateOAuthUser,
  User,
} from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { PASSWORD_SALT_ROUNDS } from '@/config';

export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}

  async getUser(id: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUser' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.id, id),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return user;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUserByUsername' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.username, username),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return user;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err;
        }
      }
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUserByEmail' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.email, email),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return user;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err;
        }
      }
    );
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUserByGithubId' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.github_id, githubId),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return user;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err;
        }
      }
    );
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUserByGoogleId' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.google_id, googleId),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return user;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err;
        }
      }
    );
  }

  async createUser(input: CreateUser): Promise<User> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > createUser' },
      async () => {
        try {
          const password_hash = await this.instrumentationService.startSpan(
            { name: 'hash password', op: 'function' },
            () => hash(input.password, PASSWORD_SALT_ROUNDS)
          );

          const newUser: User = {
            id: input.id,
            username: input.username,
            email: input.email,
            password_hash,
            github_id: null,
            google_id: null,
          };

          const query = db.insert(users).values(newUser).returning();

          const [created] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          if (!created) {
            throw new DatabaseOperationError('Cannot create user.');
          }

          return created;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err;
        }
      }
    );
  }

  async createOAuthUser(input: CreateOAuthUser): Promise<User> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > createOAuthUser' },
      async () => {
        try {
          const newUser = {
            id: input.id,
            username: input.username,
            email: input.email,
            password_hash: null,
            github_id: input.github_id ?? null,
            google_id: input.google_id ?? null,
          };

          const query = db.insert(users).values(newUser).returning();

          const [created] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          if (!created) {
            throw new DatabaseOperationError('Cannot create OAuth user.');
          }

          return created;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err;
        }
      }
    );
  }

  async updateUser(userId: string, input: Partial<User>): Promise<User> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > updateUser' },
      async () => {
        try {
          const query = db
            .update(users)
            .set(input)
            .where(eq(users.id, userId))
            .returning();

          const [updated] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          if (!updated) {
            throw new DatabaseOperationError(
              'User not found or update failed.'
            );
          }

          return updated;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err;
        }
      }
    );
  }
}
