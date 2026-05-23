"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, ShieldCheck, Users } from "lucide-react";
import { env } from "@/lib/config/env";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/use-auth";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="actions-row">
            <ShieldCheck size={18} />
            <span>
              <strong>{user?.name}</strong>
              <span className="muted"> · {user?.role}</span>
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
