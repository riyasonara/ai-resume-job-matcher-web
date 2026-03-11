"use client";

import Link from "next/link";
import { LayoutDashboard, Upload, Briefcase, Search } from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Upload Resume", icon: Upload, href: "/upload" },
  { name: "Recommendations", icon: Briefcase, href: "/recommendations" },
  { name: "Compare Job", icon: Search, href: "/compare" },
];

export function AppSidebar() {
  return (
    <aside className="w-64 h-screen bg-background border-r flex flex-col">
      <div className="p-6 text-xl font-semibold">
        AI Matcher
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}