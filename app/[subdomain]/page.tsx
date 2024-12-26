import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prismadb from "@/lib/prismadb";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function SubdomainPage({
  params,
}: {
  params: { subdomain: string };
}) {
  const { subdomain } = params;
  console.log("Page: Received request for store with subdomain", subdomain);

  try {
    const store = await prismadb.store.findUnique({
      where: {
        name: subdomain,
      },
    });

    console.log("Page: Found store", store);

    if (!store) {
      console.log("Page: Store not found, returning 404");
      notFound();
    }

    return (
      <div className="w-full mx-auto h-dvh flex flex-col">
        <div className="h-40 w-full bg-foreground border-b border relativo">
          <div className="absolute size-32 rounded-lg bg-zinc-100 top-20 left-40 border-foreground border-4 overflow-hidden">
            <Image
              src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
              alt="user"
              width={128}
              height={128}
            />
          </div>
        </div>
        <div className="h-48 w-full bg-muted"></div>
      </div>
    );
  } catch (err) {
    console.log("[STORE_GET]", err);
    return (
      <div className="w-full max-w-lg mx-auto h-dvh flex items-center justify-center">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertTitle>Ups! Esta tienda no existe.</AlertTitle>
          <AlertDescription>Intenta con otra.</AlertDescription>
        </Alert>
      </div>
    );
  }
}
