"use client";

import { useState } from "react";
import { useGetAllUsers, useUpdateUserStatus } from "@/hooks";
import { PageHeader, StatusBadge, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Shield, UserCheck, UserX, Mail, Calendar } from "lucide-react";
import type { UserRole } from "@/types";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useGetAllUsers({
    searchTerm: searchTerm || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    limit: 50,
  });

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();

  const users = data?.data || [];

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    if (confirm(`Change this user's account status to ${nextStatus}?`)) {
      updateStatus({ id, status: nextStatus });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="User & Account Directory"
        description="Oversee citizen and field staff accounts, manage roles and access permissions."
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card/40 backdrop-blur-xs border-border/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-xs"
          >
            <option value="">All Roles</option>
            <option value="CITIZEN">Citizen</option>
            <option value="RESOLVER">Resolver</option>
            <option value="ADMIN">Administrator</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-xs"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned / Suspended</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/40 p-12 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
          Loading accounts directory...
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try clearing search keywords or changing role filters."
        />
      ) : (
        <div className="divide-y divide-border/30 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
          {users.map((user) => {
            const initials = user.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : "U";

            return (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-10 border border-border/60 shrink-0">
                    <AvatarImage src={user.profileUrl || undefined} />
                    <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground text-sm truncate">
                        {user.name}
                      </h4>
                      <StatusBadge status={user.status} size="sm" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="size-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="size-3 text-primary" />
                        {user.role}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    onClick={() => handleToggleStatus(user.id, user.status)}
                    disabled={isUpdating}
                    variant={user.status === "ACTIVE" ? "ghost" : "outline"}
                    size="sm"
                    className={`h-8 text-xs ${
                      user.status === "ACTIVE"
                        ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                        : "text-emerald-600 hover:bg-emerald-500/10"
                    }`}
                  >
                    {user.status === "ACTIVE" ? (
                      <>
                        <UserX className="size-3.5 mr-1" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <UserCheck className="size-3.5 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
