"use client";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { formatter } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

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
  tenant: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, tenant }) => {
  const { addItem, items, updateItem } = useCart();

  const selectedVariant = product.variants[0];

  const isInCart = items.some((item) => item.variantId === selectedVariant.id);

  const isInCartQuantity = items.find(
    (item) => item.variantId === selectedVariant.id
  );

  const addToCart = () => {
    if (isInCart && isInCartQuantity?.quantity) {
      updateItem(selectedVariant.id, isInCartQuantity.quantity + 1);
      toast.success("Producto agregado al carrito", {
        position: "top-center",
      });
    } else {
      addItem({
        variantId: selectedVariant.id,
        quantity: 1,
        total: selectedVariant.salePrice || selectedVariant.price,
      });
      toast.success("Producto agregado al carrito", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-secondary relative max-w-60">
      <div className="flex flex-col gap-4 relative group">
        <Link
          className="rounded-lg size-52 bg-white overflow-hidden group relative"
          href={`/${tenant}/${product.id}`}
        >
          <Image
            className="group-hover:scale-105 transition-transform duration-300 object-cover object-center"
            src={product.images[0].url}
            alt={product.name}
            fill
          />
          {product.isFeatured && (
            <Star className="size-4 top-2 left-2 absolute text-yellow-500 fill-yellow-500" />
          )}
        </Link>
        <Button
          className="absolute top-1 right-1 z-10"
          size="icon"
          type="button"
          onClick={addToCart}
        >
          <Plus />
        </Button>
        <Link className="space-y-2" href={`/${product.id}`}>
          <div>
            <h1 className="text-md font-medium">{product.name}</h1>
            <p className="text-xs text-muted-foreground text-wrap ">
              {product.description.length > 60
                ? product.description.slice(0, 60) + "..."
                : product.description}
            </p>
            <div className="flex flex-col">
              <span className="text-foreground text-sm md:text-lg font-semibold">
                {formatter.format(
                  selectedVariant.salePrice || selectedVariant.price
                )}
              </span>
              {selectedVariant.salePrice > 0 && (
                <div className="flex gap-x-2 items-center">
                  <span className="px-1 bg-red-500 text-sm md:text-medium  text-white font-medium rounded-lg">
                    {(
                      ((selectedVariant.salePrice - selectedVariant.price) /
                        selectedVariant.price) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                  <span className="text-xs md:text-sm line-through text-red-500">
                    {formatter.format(selectedVariant.price)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
