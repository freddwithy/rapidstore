import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  return <div className="px-4">{children}</div>;
}
