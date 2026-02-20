'use client';

import * as React from 'react';
import { IconChartBar, IconDashboard, IconReceipt } from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';

const data = {
  navMain: [
    // {
    //   title: 'Dashboard',
    //   url: '/dashboard',
    //   icon: IconDashboard,
    // },
    {
      title: 'Record',
      url: '/dashboard/record',
      icon: IconReceipt,
    },
    // {
    //   title: 'Analytics',
    //   url: '/dashboard/analytics',
    //   icon: IconChartBar,
    // },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    username: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Image
                    src="/logo.svg"
                    alt="Oink Wallet"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Oink Wallet</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Snout where your money goes
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
