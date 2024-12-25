import { auth } from "@clerk/nextjs/server";

import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) return;

  return <div className="gap-4 flex flex-col">{children}</div>;
}
