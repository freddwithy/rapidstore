import Instagram from "@/components/icons/instagram";
import WhatsApp from "@/components/icons/whatsapp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";

import { AlertCircle, List } from "lucide-react";
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
      include: {
        categories: true,
      },
    });

    console.log("Page: Found store", store);
    console.log(store?.categories);

    if (!store) {
      console.log("Page: Store not found, returning 404");
      notFound();
    }

    return (
      <div className="w-full mx-auto h-dvh flex flex-col">
        <div className="h-40 w-full bg-foreground border-b border relativo overflow-hidden">
          <Image
            src="https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png"
            alt="portada"
            width={1500}
            height={400}
            className="object-fill"
          />
          <div className="absolute flex flex-col size-32 rounded-lg bg-zinc-100 top-20 left-40 border-foreground border-4 overflow-hidden">
            <Image
              src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
              alt="user"
              width={128}
              height={128}
            />
          </div>
        </div>
        <div className="w-full px-40 py-14 space-y-4">
          <div className="flex justify-between">
            <div>
              <h1 className="text-xl font-semibold capitalize">{store.name}</h1>
              <p className="text-sm text-muted-foreground">
                {store.description}
              </p>
            </div>
            <div className="flex gap-x-1">
              <Button variant="link" size="sm">
                <WhatsApp className="text-white" />
                WhatsApp
              </Button>
              <Button variant="link" size="sm">
                <Instagram />
                Instagram
              </Button>
            </div>
          </div>
          <div className="flex gap-x-2">
            {store.categories.map((cat) => (
              <div
                key={cat.name}
                className="flex gap-x-2 bg-primary-foreground px-4 py-2 rounded-full border-muted border"
              >
                <List className="size-4" />
                {cat.name}
              </div>
            ))}
          </div>
        </div>
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
