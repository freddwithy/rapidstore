import { ModeToggle } from "@/components/mode-toggle";
import StoreCard from "@/components/stores-card";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import UserMenu from "@/components/user-menu";
import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const user = await currentUser();

  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: userId,
    },
  });

  const stores = await prismadb.store.findMany({
    where: {
      owner: {
        clerk_id: userId,
      },
    },
    include: {
      categories: true,
      products: true,
      orders: true,
    },
  });

  return (
    <div className=" gap-4 flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Configura tu tienda</CardTitle>
          <CardDescription>
            Desde aquí podrás gestionar tu cuenta.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ProfilePage;
