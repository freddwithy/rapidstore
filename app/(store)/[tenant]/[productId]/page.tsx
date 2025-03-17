import prismadb from "@/lib/prismadb";
import React from "react";
import Gallery from "./components/gallery";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Options from "./components/options";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; tenant: string };
}) => {
  const { productId, tenant } = params;

  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
      variants: {
        include: {
          variant: true,
          color: true,
        },
      },
    },
  });
  if (!product) return <div>Producto no encontrado</div>;
  return (
    <div className="px-2 py-4 md:py-20 w-full md:h-dvh space-y-4">
      <div>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/${tenant}`}
        >
          <ArrowLeft />
          Volver
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <Gallery images={product?.images || []} />
        <Options product={product} />
      </div>
    </div>
  );
};

export default ProductPage;
