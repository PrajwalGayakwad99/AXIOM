"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import {
  Bell,
  Search,
  Command,
  Flame,
  LogOut,
  Settings,
  User,
} from "lucide-react";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-white/5 bg-surface-primary/80 backdrop-blur-xl px-6">
      {/* Search Bar */}
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-muted-foreground text-sm w-72">
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono flex items-center gap-0.5">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
          <Flame className="w-4 h-4" />
          <span>5</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors">
              <Avatar className="h-7 w-7 border border-white/10">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="bg-gradient-to-br from-brand-blue to-brand-purple text-white text-xs">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-xs font-medium text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{user.role}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 bg-surface-elevated border-white/10" align="end">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="text-sm cursor-pointer hover:bg-white/5 focus:bg-white/5">
              <User className="w-4 h-4 mr-2" />Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm cursor-pointer hover:bg-white/5 focus:bg-white/5">
              <Settings className="w-4 h-4 mr-2" />Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem onClick={() => signOut()} className="text-sm cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-2" />Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
