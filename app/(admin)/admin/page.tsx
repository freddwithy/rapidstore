import StoreCard from "@/components/stores-card";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const AdminPage = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const userDb = await prismadb.user.findUnique({
    where: {
      clerk_id: userId,
    },
    include: {
      store: true,
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
    <>
      <div className="gap-4 flex flex-col">
        <Card>
          <CardHeader>
            <CardTitle>Adminitrador de tiendas</CardTitle>
            <CardDescription>
              Desde aquí podrás gestionar tus tiendas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores &&
                stores.map((store) => {
                  return (
                    <StoreCard user={userDb} store={store} key={store.id} />
                  );
                })}
              {(userDb?.user_type === "PRO" && userDb.store.length >= 4) ||
              userDb?.store.length === 0 ? (
                <Link
                  href="/admin/create-store"
                  className="border rounded-xl flex flex-col items-center justify-center text-muted-foreground min-h-40"
                >
                  <Plus className="size-20" />
                  <p>Agregar tienda</p>
                </Link>
              ) : (
                <div className="border rounded-xl flex flex-col items-center justify-center text-muted-foreground min-h-40">
                  <Plus className="size-20" />
                  <p className="text-center max-w-48">
                    Actualiza al{" "}
                    <a
                      href="/dashboard/upgrade"
                      className="hover:underline text-primary"
                    >
                      Plan Pro
                    </a>{" "}
                    para agregar más tiendas.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminPage;
