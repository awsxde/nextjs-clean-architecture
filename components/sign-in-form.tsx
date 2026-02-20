import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Loader, Github, Mail } from 'lucide-react';

export function SignInForm({
  className,
  onSubmit,
  error,
  loading,
  onGithubClick,
  onGoogleClick,
  ...props
}: Omit<React.ComponentProps<'div'>, 'onSubmit'> & {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  loading?: boolean;
  onGithubClick?: () => void;
  onGoogleClick?: () => void;
}) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onGithubClick}
                  disabled={loading}
                >
                  <Github />
                  Sign in with GitHub
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onGoogleClick}
                  disabled={loading}
                >
                  <Mail />
                  Sign in with Google
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* Error message */}
              {error && <p className="text-sm text-destructive">{error}</p>}

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader className="animate-spin" /> : 'Sign in'}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{' '}
                  <Link href="/sign-up" className="underline">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
