import prismadb from "@/lib/prismadb";
import ProductsClientComponent from "./components/client";
import CategoriesTags from "./components/categories-tags";
import { Suspense } from "react";
import CategoriesTagsSkeleton from "./components/ui/skeletons/categories-tags-skeleton";
import { ModeToggle } from "@/components/mode-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import Cart from "./components/cart";
import LateralNavbar from "./components/lateral-navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ban } from "lucide-react";
import StoreInfo from "./components/info";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function generateMetadata({
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
      <Avatar className="size-32 rounded-lg">
        <AvatarImage
          src={store?.logo || ""}
          alt={store?.name}
          className="object-center object-cover"
        />
        <AvatarFallback className="text-xl rounded-lg font-semibold">
          {store?.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="sticky top-0 z-20 bg-background py-2 space-y-2">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-2 items-center">
            <Link href={`/${tenant}`}>
              <h1 className="text-3xl font-medium capitalize">{store.name}</h1>
            </Link>
            <StoreInfo store={store} />
          </div>

          <div className="flex gap-x-2 items-center">
            <ModeToggle />
            <Cart products={store.products} tenant={tenant} />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <LateralNavbar
            storeName={store.name}
            tenant={tenant}
            categories={store.categories}
          />
          <ScrollArea className="w-full ">
            <div className="group relative w-full flex items-center">
              <div className="flex gap-x-2 items-center relative">
                <Suspense fallback={<CategoriesTagsSkeleton count={3} />}>
                  <CategoriesTags storeId={store.id} />
                </Suspense>
              </div>
              {/* <ArrowRight className="size-5 absolute right-1 transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
              <ArrowLeft className="size-5 absolute left-1 transition-opacity duration-300 group-hover:opacity-100 opacity-0" /> */}
            </div>
          </ScrollArea>
        </div>
      </div>
      <ProductsClientComponent storeId={store.id} tenant={tenant} />
    </div>
  );
}

export const dynamic = "force-dynamic"; // ⚡ Desactiva la caché estátic
