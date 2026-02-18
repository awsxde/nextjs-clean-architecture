import { z } from 'zod';
import { ISignInWithGithubUseCase } from '@/src/application/use-cases/auth/sign-in-with-github.use-case';
import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

const inputSchema = z.object({
  githubId: z.string(),
  email: z.string().email(),
  username: z.string().min(1),
});

export type ISignInWithGithubController = ReturnType<
  typeof signInWithGithubController
>;

export const signInWithGithubController =
  (
    instrumentationService: IInstrumentationService,
    signInWithGithubUseCase: ISignInWithGithubUseCase
  ) =>
  async (input: Partial<z.infer<typeof inputSchema>>): Promise<Cookie> => {
    return await instrumentationService.startSpan(
      { name: 'signInWithGithub Controller' },
      async () => {
        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid OAuth data', {
            cause: inputParseError,
          });
        }

        const { cookie } = await signInWithGithubUseCase(data);
        return cookie;
      }
    );
  };
