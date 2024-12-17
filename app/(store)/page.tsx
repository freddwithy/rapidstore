import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const Page = async () => {
  const user = await currentUser();
  const store = await prismadb.store.findFirst({
    where: {
      owner: {
        clerk_id: user?.id,
      },
    },
  });
  return (
    <div className="h-dvh w-full">
      <UserButton />
      Hola
      <Link
        className="py-2 px-4 bg-zinc-900 rounded-md text-white"
        href={`/${store?.id}/dashboard`}
      >
        Ir a la tienda
      </Link>
    </div>
  );
};

export default Page;
