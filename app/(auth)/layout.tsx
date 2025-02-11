import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (userId) redirect("/admin");
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 ">
      <div className="bg-muted w-full h-full hidden lg:block p-14 space-y-4 overflow-hidden relative">
        <Image
          src="/sign-in.webp"
          alt="Sign in"
          width={1000}
          height={1000}
          className="absolute inset-0 object-cover w-full h-full"
        />
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}
