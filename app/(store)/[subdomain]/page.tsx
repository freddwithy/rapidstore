import Instagram from "@/components/icons/instagram";
import WhatsApp from "@/components/icons/whatsapp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";

import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductsComponent from "./components/products";
import Cart from "./components/cart";

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
        url: subdomain,
      },
    });

    const categories = await prismadb.category.findMany({
      where: {
        storeId: store?.id,
      },
      include: {
        products: {
          include: {
            variants: {
              include: {
                variant: true,
                color: true,
              },
            },
            images: true,
          },
        },
      },
    });

    const destacados = categories
      .flatMap((cat) => cat.products.filter((p) => p.isFeatured))
      .slice(0, 4);

    const products = categories.flatMap((cat) => cat.products);

    if (!store) {
      console.log("Page: Store not found, returning 404");
      notFound();
    }

    return (
      <div className="w-full mx-auto max-w-[1080px] h-dvh flex flex-col">
        <div className="w-full py-14 px-8 space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="rounded-lg overflow-hidden border aspect-square size-32">
                <Image
                  src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                  alt="user"
                  width={128}
                  height={128}
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold capitalize">
                  {store.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {store.description}
                </p>
              </div>
              <div className="flex gap-x-4">
                <Button variant="link" size="sm" className="px-0">
                  <WhatsApp className="text-white" />
                  WhatsApp
                </Button>
                <Button variant="link" size="sm" className="px-0">
                  <Instagram />
                  Instagram
                </Button>
              </div>
              <div className="flex gap-x-2 items-center">
                {categories.map((cat) => (
                  <a
                    key={cat.name}
                    href={`#${cat.name}`}
                    className="flex gap-x-2 items-center bg-primary-foreground px-4 py-2 rounded-full border-muted border hover:bg-primary-foreground/80"
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>
            <Cart />
          </div>
          <ProductsComponent
            categories={categories}
            destacados={destacados}
            products={products}
          />
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
