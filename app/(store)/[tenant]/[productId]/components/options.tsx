"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useCart from "@/hooks/use-cart";
import { formatter, usdFormatter } from "@/lib/utils";
import { Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { Currency, Prisma } from "@prisma/client";
import clsx from "clsx";
import { Check, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";

type ProductWithOptions = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        color: true;
        variant: true;
      };
    };
  };
}>;

interface OptionsProps {
  product: ProductWithOptions;
}

const Options: React.FC<OptionsProps> = ({ product }) => {
  const { addItem, items, updateItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const isInCart = items.some((item) => item.variantId === selectedVariant.id);

  const isInCartQuantity = items.find(
    (item) => item.variantId === selectedVariant.id
  );

  const SafeHTML = () => {
    const sanitizedContent = DOMPurify.sanitize(product.description);

    return (
      <div
        className="prose text-muted-foreground prose-sm prose-p:text-sm"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  };

  const addToCart = () => {
    if (isInCart && isInCartQuantity?.quantity) {
      updateItem(selectedVariant.id, isInCartQuantity.quantity + quantity);
      toast.success("Producto agregado al carrito", {
        position: "top-center",
        action: (
          <Button onClick={() => router.push("cart")} size="sm">
            <ShoppingCart />
            Carrito
          </Button>
        ),
        style: {
          justifyContent: "space-between",
        },
      });
    } else {
      addItem({
        variantId: selectedVariant.id,
        quantity,
        total: selectedVariant.salePrice || selectedVariant.price,
      });
      toast.success("Producto agregado al carrito", {
        position: "top-center",
        action: (
          <Button onClick={() => router.push("cart")} size="sm">
            <ShoppingCart />
            Carrito
          </Button>
        ),
        style: {
          justifyContent: "space-between",
        },
      });
    }
  };

  const price =
    selectedVariant.currency === Currency.USD
      ? usdFormatter.format(selectedVariant.price)
      : formatter.format(selectedVariant.price);

  const salePrice =
    selectedVariant.currency === Currency.USD
      ? usdFormatter.format(selectedVariant.salePrice ?? 0)
      : formatter.format(selectedVariant.salePrice ?? 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{product.name}</CardTitle>
        <CardDescription className="text-lg">
          {selectedVariant.salePrice ? salePrice : price}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="font-semibold">Opciones</p>
          <RadioGroup
            value={selectedVariant}
            onChange={setSelectedVariant}
            className="flex gap-2 flex-wrap"
          >
            {product.variants.map((variant) => (
              <Field
                key={variant.id}
                className="flex items-center gap-2 py-2 px-4 bg-secondary rounded-md relative"
              >
                <Radio value={variant} className="">
                  {({ checked, disabled }) => (
                    <span
                      className={clsx(
                        "absolute inset-0 ring-2 rounded-md cursor-pointer flex items-center px-2",
                        checked ? "ring-primary/60" : "ring-transparent",
                        disabled && "cursor-not-allowed"
                      )}
                    >
                      {checked && (
                        <span className="bg-green-500 text-white p-1 rounded-full">
                          <Check className="size-3" />
                        </span>
                      )}
                    </span>
                  )}
                </Radio>
                <Label className="ml-3">
                  {variant.variant?.name || variant.color?.name
                    ? variant.color?.name + " - " + variant.variant?.name
                    : variant.name}
                </Label>
              </Field>
            ))}
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Cantidad</p>
          <div className="flex gap-x-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : q))}
            >
              -
            </Button>
            <p>{quantity}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((q) => (q < 10 ? q + 1 : q))}
            >
              +
            </Button>
          </div>
        </div>
        <Button onClick={addToCart}>Añadir al carrito</Button>
      </CardContent>
      <CardFooter>
        <div className="space-y-2">
          <p className="font-semibold">Detalles</p>
          <SafeHTML />
        </div>
      </CardFooter>
    </Card>
  );
};

export default Options;
