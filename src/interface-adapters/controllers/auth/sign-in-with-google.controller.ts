import { z } from 'zod';
import { ISignInWithGoogleUseCase } from '@/src/application/use-cases/auth/sign-in-with-google.use-case';
import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

const inputSchema = z.object({
  googleId: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(1),
});

export type ISignInWithGoogleController = ReturnType<
  typeof signInWithGoogleController
>;

export const signInWithGoogleController =
  (
    instrumentationService: IInstrumentationService,
    signInWithGoogleUseCase: ISignInWithGoogleUseCase
  ) =>
  async (input: Partial<z.infer<typeof inputSchema>>): Promise<Cookie> => {
    return await instrumentationService.startSpan(
      { name: 'signInWithGoogle Controller' },
      async () => {
        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid OAuth data', {
            cause: inputParseError,
          });
        }

        const { cookie } = await signInWithGoogleUseCase(data);
        return cookie;
      }
    );
  };
