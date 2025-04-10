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

interface FeaturedProductCardProps {
  product: ProductWithVariants;
  tenant: string;
}

const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({
  product,
  tenant,
}) => {
  const { addItem, items, updateItem } = useCart();

  // Determinar si es un producto con variantes o sin variantes
  const hasVariants = product.variants.length > 0;

  // Seleccionar la primera opción disponible dentro de las variantes si existe, sino la primera opción para mostrar "AGOTADO"
  const selectedVariant = hasVariants
    ? product.variants
        .flatMap((variant) => variant.options)
        .find((option) => option.status === "DISPONIBLE") ||
      product.variants.flatMap((variant) => variant.options)[0] ||
      product
    : product;

  // Comprobar si está en el carrito (variante u opción)
  const isInCart = items.some((item) =>
    hasVariants
      ? item.optionId === selectedVariant.id
      : item.productId === product.id
  );

  // Encontrar el item en el carrito si existe
  const isInCartQuantity = items.find((item) =>
    hasVariants
      ? item.optionId === selectedVariant.id
      : item.productId === product.id
  );

  const price = formatter.format(selectedVariant.price || 0);

  const salePrice = formatter.format(selectedVariant.salePrice ?? 0);

  const addToCart = () => {
    // Calcular el precio correcto
    const itemPrice = Number(
      selectedVariant.salePrice || selectedVariant.price || 0
    );

    if (isInCart && isInCartQuantity?.quantity) {
      // Actualizar cantidad si ya está en el carrito
      if (hasVariants) {
        // Si tiene variantes, usar optionId
        updateItem(selectedVariant.id, "", isInCartQuantity.quantity + 1);
      } else {
        // Si no tiene variantes, usar productId
        updateItem("", product.id, isInCartQuantity.quantity + 1);
      }

      toast.success("Producto agregado al carrito", {
        position: "top-center",
      });
    } else {
      // Añadir nuevo item al carrito
      addItem({
        // Si tiene variantes, usar optionId, sino usar solo productId
        optionId: hasVariants ? selectedVariant.id : undefined,
        productId: product.id,
        quantity: 1,
        total: itemPrice,
      });

      toast.success("Producto agregado al carrito", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="border bg-card rounded-2xl relative md:max-w-none max-w-60">
      <div className="flex flex-col relative group">
        <Link
          className="rounded-xl size-52 md:w-72 shadow-md bg-white overflow-hidden group relative"
          href={`/${tenant}/${product.id}`}
        >
          <Image
            className="group-hover:scale-105 transition-transform duration-300 object-cover object-center"
            src={product.images[0].url}
            alt={product.name}
            fill
          />
          {selectedVariant.salePrice &&
            selectedVariant.price &&
            selectedVariant.status !== "AGOTADO" && (
              <span className="px-1 bg-red-500 text-white font-semibold text-md rounded-r-md absolute left-0 bottom-5">
                {(
                  ((selectedVariant.salePrice - selectedVariant.price) /
                    selectedVariant.price) *
                  100
                ).toFixed(0)}
                %
              </span>
            )}
          {selectedVariant.status === "AGOTADO" && (
            <span className="px-1 bg-stone-500 text-white font-semibold text-md rounded-r-md absolute left-0 bottom-5">
              AGOTADO
            </span>
          )}
        </Link>
        {selectedVariant.status !== "AGOTADO" && (
          <Button
            variant="secondary"
            className="absolute top-1 right-1 z-10"
            size="icon"
            type="button"
            onClick={addToCart}
          >
            <Plus />
          </Button>
        )}
        <Link className="space-y-2 px-4 py-4" href={`/${product.id}`}>
          <div>
            <p className="text-sm md:text-base font-medium dark:text-zinc-300 text-zinc-700">
              {product.name}
            </p>
            <div className="flex flex-col">
              <span className="text-foreground text-base md:text-lg font-semibold">
                {selectedVariant.salePrice ? salePrice : price}
              </span>
              <span
                className={cn(
                  "text-xs md:text-sm line-through text-red-500",
                  selectedVariant.salePrice ? "visible" : "invisible"
                )}
              >
                {price || 0}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProductCard;
