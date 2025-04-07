"use client";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { cn, formatter } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        options: true;
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

  const selectedVariant = product.variants[0].options[0];

  const isInCart = items.some((item) => item.optionId === selectedVariant.id);

  const isInCartQuantity = items.find(
    (item) => item.optionId === selectedVariant.id
  );

  const precios = () => {
    if (selectedVariant?.id) {
      if (selectedVariant?.salePrice) {
        return { price: Number(selectedVariant?.salePrice) };
      }

      return { price: Number(selectedVariant?.price || 0) };
    }

    if (product?.id) {
      if (product?.salePrice) {
        return { price: Number(product?.salePrice) };
      }

      return { price: Number(product?.price || 0) };
    }
  };

  const price = formatter.format(precios()?.price || 0);

  const addToCart = () => {
    if (isInCart && isInCartQuantity?.quantity) {
      updateItem(selectedVariant.id, isInCartQuantity.quantity + 1);
      toast.success("Producto agregado al carrito", {
        position: "top-center",
      });
    } else {
      addItem({
        optionId: selectedVariant.id,
        quantity: 1,
        total: selectedVariant.salePrice || selectedVariant.price,
      });
      toast.success("Producto agregado al carrito", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="border bg-secondary rounded-xl relative md:max-w-60">
      <div className="flex flex-col relative group">
        <Link
          className="rounded-xl w-full h-32 md:h-52 bg-white overflow-hidden group relative"
          href={`/${tenant}/${product.id}`}
        >
          <Image
            className="group-hover:scale-105 transition-transform duration-300 object-cover object-center"
            src={product.images[0].url}
            alt={product.name}
            fill
          />
          {selectedVariant.salePrice && (
            <span className="px-1 bg-red-500 text-white font-semibold text-md rounded-r-md absolute left-0 bottom-5">
              {(
                ((selectedVariant.salePrice - selectedVariant.price) /
                  selectedVariant.price) *
                100
              ).toFixed(0)}
              %
            </span>
          )}
        </Link>
        <Button
          variant="secondary"
          className="absolute top-1 right-1 z-10"
          size="icon"
          type="button"
          onClick={addToCart}
        >
          <Plus />
        </Button>
        <Link className="space-y-2 px-4 py-4" href={`/${product.id}`}>
          <div>
            <p className="text-sm md:text-base font-medium dark:text-zinc-300 text-zinc-600 line-clamp-3">
              {product.name.slice(0, 35)}
            </p>
            <div className="flex flex-col">
              <span className="text-foreground text-base md:text-lg font-semibold">
                {price}
              </span>
              <span
                className={cn(
                  "text-xs md:text-sm line-through text-red-500",
                  selectedVariant.salePrice ? "visible" : "invisible"
                )}
              >
                {formatter.format(selectedVariant.price)}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
