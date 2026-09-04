"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderGit2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
} from "lucide-react";

import { RepoLensIcon } from "@/components/icons/repolens-icon";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  title,
  description,
  actions,
  hideHeader = false,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  hideHeader?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: user } = useCurrentUser();
  const logout = useLogout();

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={<Link href="/dashboard" />}
                tooltip="RepoLens"
              >
                <RepoLensIcon className="size-8 rounded-[10px]" />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    RepoLens
                  </span>

                  <span className="truncate text-xs text-muted-foreground">
                    Explore your repositories
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Workspace
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/dashboard" />}
                    isActive={pathname === "/dashboard"}
                    tooltip="Dashboard"
                  >
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/repositories" />}
                    isActive={pathname.startsWith("/repositories")}
                    tooltip="Repositories"
                  >
                    <FolderGit2 />
                    <span>Repositories</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/chat" />}
                    isActive={pathname.startsWith("/chat")}
                    tooltip="Chat"
                  >
                    <MessageSquare />
                    <span>Chat with your code</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              Account
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/settings" />}
                    isActive={pathname.startsWith("/settings")}
                    tooltip="Settings"
                  >
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            {user && (
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <SidebarMenuButton
                        size="lg"
                        tooltip="Account"
                      />
                    }
                  >
                    <Avatar className="size-8">
                      <AvatarImage
                        src={user.avatarUrl ?? undefined}
                        alt={
                          user.displayName ||
                          user.gitUsername
                        }
                      />

                      <AvatarFallback>
                        {(
                          user.displayName ||
                          user.gitUsername ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.displayName ||
                          user.gitUsername}
                      </span>

                      <span className="truncate text-xs text-muted-foreground">
                        @{user.gitUsername}
                      </span>
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    side="right"
                    className="w-56"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>
                        My Account
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() =>
                          router.push("/settings")
                        }
                      >
                        <Settings />
                        Settings
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => logout.mutate()}
                        disabled={logout.isPending}
                      >
                        <LogOut />
                        {logout.isPending
                          ? "Logging out..."
                          : "Log out"}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {!hideHeader && (
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur">
            <SidebarTrigger className="-ml-1" />

            <Separator
              orientation="vertical"
              className="mr-2 h-4"
            />

            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <div className="min-w-0">
                {title && (
                  <h1 className="truncate font-heading text-sm font-medium">
                    {title}
                  </h1>
                )}

                {description && (
                  <p className="truncate text-xs text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {actions}
                <ModeToggle />
              </div>
            </div>
          </header>
        )}

        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function BrandMark({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-semibold tracking-tight",
        className
      )}
    >
      <RepoLensIcon className="size-8 rounded-[10px]" />

      <span className="font-heading text-[1.05rem] leading-none">
        RepoLens
      </span>
    </div>
  );
}

export function GhostButtonLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      render={<Link href={href} />}
    >
      {children}
    </Button>
  );
}