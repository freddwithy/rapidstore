import prismadb from "@/lib/prismadb";
import Image from "next/image";
import ProductsClientComponent from "./components/client";
import CategoriesTags from "./components/categories-tags";
import { Suspense } from "react";
import CategoriesTagsSkeleton from "./components/ui/skeletons/categories-tags-skeleton";
import { ModeToggle } from "@/components/mode-toggle";
import getStore from "@/actions/get-store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Ban, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Cart from "./components/cart";
import LateralNavbar from "./components/lateral-navbar";

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
    include: {
      products: {
        include: {
          images: true,
          variants: true,
        },
      },
      categories: true,
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
    <div className="w-full py-8 px-4 md:py-14 space-y-2">
      <div className="rounded-xl overflow-hidden border aspect-square size-24 md:size-36">
        <Image
          src={
            store.logo ||
            "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          alt="user"
          width={160}
          height={160}
        />
      </div>

      <div className="sticky top-0 z-20 bg-background py-2 space-y-2">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-2 items-center">
            <Link href={`/${tenant}`}>
              <h1 className="text-3xl font-medium capitalize">{store.name}</h1>
            </Link>
            <Button size="icon" variant="ghost">
              <Info className="size-4" />
            </Button>
          </div>

          <div className="flex gap-x-2 items-center">
            <ModeToggle />
            <Cart products={store.products} tenant={tenant} />
          </div>
        </div>
        <div className="flex gap-x-2 items-center">
          <LateralNavbar
            storeName={store.name}
            tenant={tenant}
            categories={store.categories}
          />
          <Suspense fallback={<CategoriesTagsSkeleton count={3} />}>
            <CategoriesTags storeId={store.id} />
          </Suspense>
        </div>
      </div>
      <ProductsClientComponent storeId={store.id} tenant={tenant} />
    </div>
  );
}
