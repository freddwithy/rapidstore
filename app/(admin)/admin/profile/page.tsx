import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

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
