import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (userId) redirect("/dashboard");
  return <div>{children}</div>;
}
