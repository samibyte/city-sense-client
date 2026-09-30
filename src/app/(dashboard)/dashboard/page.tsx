"use client";

import { useGetMe } from "@/hooks";

export default function DashboardPage() {
  const { data } = useGetMe();

  return (
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Signed in as {data?.data?.name} ({data?.data?.role}). UI pending.
      </p>
    </main>
  );
}
