import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prismadb from "@/lib/prismadb";
import React from "react";
import Gallery from "./components/gallery";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
  return (
    <div className="py-20 w-full h-dvh space-y-4">
      <div>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/${tenant}`}
        >
          <ArrowLeft />
          Volver
        </Link>
      </div>
      <div className="flex gap-x-4 w-full">
        <Gallery images={product?.images || []} />
        <Card>
          <CardHeader>
            <CardTitle>{product?.name}</CardTitle>
            <CardDescription>{product?.description}</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductPage;
