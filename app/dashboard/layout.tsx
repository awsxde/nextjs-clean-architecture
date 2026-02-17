import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    redirect('/sign-in');
  }

  try {
    const authService = getInjection('IAuthenticationService');
    const { user } = await authService.validateSession(sessionId);

    const safeUser = {
      name: user.username.split('@')[0] || 'User',
      email: user.username,
      avatar: '',
    };

    return (
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" user={safeUser} />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    );
  } catch (error) {
    redirect('/sign-in');
  }
}
