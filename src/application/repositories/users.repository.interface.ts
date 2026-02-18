import type {
  User,
  CreateUser,
  CreateOAuthUser,
} from '@/src/entities/models/user';
import type { ITransaction } from '@/src/entities/models/transaction.interface';

export interface IUsersRepository {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(input: CreateUser, tx?: ITransaction): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  updateUser(
    userId: string,
    data: Partial<User>,
    tx?: ITransaction
  ): Promise<User>;
  createOAuthUser(input: CreateOAuthUser, tx?: ITransaction): Promise<User>; // optional helper
}
