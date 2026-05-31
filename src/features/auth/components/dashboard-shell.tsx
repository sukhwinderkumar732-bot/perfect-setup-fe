"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, LogOut, ShieldCheck, UserCircle, Users } from "lucide-react";
import { env } from "@/lib/config/env";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/use-auth";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users, permission: "users:read" as const },
  { href: "/account", label: "Account", icon: UserCircle },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, can, logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Link href="/dashboard" className="auth-brand" aria-label={`${env.appName} dashboard`}>
          <span className="brand-mark">PA</span>
          <div>
            <strong>{env.appName}</strong>
            <p style={{ margin: "4px 0 0" }}>Admin template</p>
          </div>
        </Link>
        <nav className="sidebar-nav" aria-label="Admin navigation">
          {navigation.map((item) => {
            if (item.permission && !can(item.permission)) {
              return null;
            }

            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={active ? "nav-item nav-item-active" : "nav-item"}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <a className="nav-item sidebar-link" href={`${env.apiUrl}/api/docs`} target="_blank" rel="noreferrer">
          <BookOpen size={18} />
          API docs
        </a>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="actions-row">
            <ShieldCheck size={18} />
            <span>
              <strong>{user?.name}</strong>
              <span className="muted"> - {user?.role}</span>
            </span>
          </div>
          <Button type="button" variant="secondary" onClick={() => void logout()}>
            <LogOut size={16} /> Logout
          </Button>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
