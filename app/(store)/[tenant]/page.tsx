import Instagram from "@/components/icons/instagram";
import WhatsApp from "@/components/icons/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import Image from "next/image";
import { notFound } from "next/navigation";
import Cart from "./components/cart";
import ProductsClientComponent from "./components/client";
import CategoriesTags from "./components/categories-tags";
import { Suspense } from "react";
import CategoriesTagsSkeleton from "./components/ui/skeletons/categories-tags-skeleton";
import { ModeToggle } from "@/components/mode-toggle";
import getStore from "@/actions/get-store";
import { ArrowUpRightIcon } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { tenant: string };
}) {
  const store = await getStore({ tenantURL: params.tenant });
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
    console.log("Page: Store not found, returning 404");
    notFound();
  }

  return (
    <div className="w-full mx-auto max-w-[1080px] h-dvh flex flex-col">
      <div className="w-full py-14 px-4 md:px-8 space-y-4">
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
              <p className="text-sm text-muted-foreground">
                {store.description}
              </p>
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
          <Cart />
        </div>
        <div className="flex gap-x-2 items-center">
          <Suspense fallback={<CategoriesTagsSkeleton count={3} />}>
            <CategoriesTags storeId={store.id} />
          </Suspense>
        </div>
        <ProductsClientComponent storeId={store.id} />
      </div>
    </div>
  );
}
