import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import React from "react";
import DashboardHeader from "./components/header";
import prismadb from "@/lib/prismadb";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: userId,
    },
  });

  return (
    <div className="px-4">
      <DashboardHeader userDb={userDb} user={user} />
      {children}
    </div>
  );
}
