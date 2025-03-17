import Instagram from "@/components/icons/instagram";
import WhatsApp from "@/components/icons/whatsapp";
import prismadb from "@/lib/prismadb";
import Image from "next/image";
import ProductsClientComponent from "./components/client";
import CategoriesTags from "./components/categories-tags";
import { Suspense } from "react";
import CategoriesTagsSkeleton from "./components/ui/skeletons/categories-tags-skeleton";
import { ModeToggle } from "@/components/mode-toggle";
import getStore from "@/actions/get-store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Ban } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { tenant: string };
}) {
  const store = await getStore({ tenantURL: params.tenant });
  if (!store) {
    return {
      title: "Store not found",
      description: "Store not found",
    };
  }
  return {
    title: store.name,
    description: store.description,
  };
}

export default async function SubdomainPage({
  params,
}: {
  params: { tenant: string };
}) {
  const { tenant } = params;
  const store = await prismadb.store.findUnique({
    where: {
      url: tenant,
    },
  });

  if (!store) {
    return (
      <div className="w-full h-dvh flex justify-center items-center">
        <div>
          <Alert>
            <Ban className="size-5" />
            <AlertTitle>Tienda no encontrada</AlertTitle>
            <AlertDescription>
              La tienda que buscas no existe o fue eliminada.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  //set timout to 1 second to simulate loading
  //await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <div className="w-full py-2 md:py-14 px-2 md:px-8 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="flex justify-between w-full">
            <div className="rounded-lg overflow-hidden border aspect-square size-32">
              <Image
                src={
                  store.logo ||
                  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt="user"
                width={128}
                height={128}
              />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold capitalize">{store.name}</h1>
            <p className="text-sm text-muted-foreground">{store.description}</p>
          </div>
          <div className="flex gap-x-2">
            <a
              className="text-xs flex gap-x-1 items-center hover:underline"
              href={store.whatsapp || ""}
            >
              <WhatsApp className="size-4" />
              WhatsApp
            </a>
            <a
              className="text-xs flex gap-x-1 items-center hover:underline"
              href={store.whatsapp || ""}
            >
              <Instagram className="size-4" />
              Instagram
            </a>
          </div>
        </div>
        <ModeToggle />
      </div>
      <div className="flex gap-x-2 items-center">
        <Suspense fallback={<CategoriesTagsSkeleton count={3} />}>
          <CategoriesTags storeId={store.id} />
        </Suspense>
      </div>
      <ProductsClientComponent storeId={store.id} tenant={tenant} />
    </div>
  );
}
