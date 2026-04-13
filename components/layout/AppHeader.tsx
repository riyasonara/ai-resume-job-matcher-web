"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppHeader() {
  return (
    <header className="h-16 border-b flex items-center justify-between px-8 bg-background">
      <h2 className="text-lg font-medium">
        Upload Resume
      </h2>

      <Avatar>
        <AvatarFallback>RS</AvatarFallback>
      </Avatar>
    </header>
  );
}