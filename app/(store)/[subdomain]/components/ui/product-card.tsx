"use client";
import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        variant: true;
        color: true;
      };
    };
    images: true;
  };
}>;

interface ProductCardProps {
  product: ProductWithVariants;
}

const ProductCard: React.FC<ProductCardProps> = ({ product}) => {
  return (
    <div className="border rounded-xl p-4 bg-secondary relative">
      <div className="flex flex-col gap-4 relative group">
        <Link
          className="rounded-lg size-52 bg-white overflow-hidden group relative"
          href={`/${product.id}`}
        >
          <Image
            className="group-hover:scale-105 transition-transform duration-300 object-cover"
            src={product.images[0].url}
            alt={product.name}
            width={208}
            height={208}
          />
          <Star className="size-4 top-2 left-2 absolute text-yellow-500" />
        </Link>
        <Button
          className="absolute top-1 right-1 z-10"
          size="icon"
        >
          <Plus />
        </Button>
        <Link className="space-y-2" href={`/${product.id}`}>
          <div>
            <h1 className="text-xl font-semibold">{product.name}</h1>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
          <span className="text-foreground">
            {formatter.format(product.variants[0].price)}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
