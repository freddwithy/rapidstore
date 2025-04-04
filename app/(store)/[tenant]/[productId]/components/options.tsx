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
import { formatter } from "@/lib/utils";
import { Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { Prisma } from "@prisma/client";
import clsx from "clsx";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";

type ProductWithOptions = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        options: true;
      };
    };
  };
}>;

interface OptionsProps {
  product: ProductWithOptions;
}

const Options: React.FC<OptionsProps> = ({ product }) => {
  const { addItem, items, updateItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0].options[0]
  );
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const isInCart = items.some((item) => item.optionId === selectedVariant.id);

  const isInCartQuantity = items.find(
    (item) => item.optionId === selectedVariant.id
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
    if (selectedVariant.id === "") {
      if (isInCart && isInCartQuantity?.quantity) {
        updateItem(product.id, isInCartQuantity.quantity + quantity);
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
      addItem({
        productId: product.id,
        quantity,
        total: product?.salePrice || product?.price || 0,
      });
    }
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
        optionId: selectedVariant.id,
        productId: product.id,
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

  const precios = () => {
    if (selectedVariant.id) {
      if (selectedVariant.salePrice) {
        const price = formatter.format(selectedVariant.salePrice);

        return { price };
      }

      return { price: formatter.format(selectedVariant.price) };
    }

    if (product.id) {
      if (product.salePrice) {
        return { price: formatter.format(product.salePrice) };
      }

      return { price: formatter.format(product.price || 0) };
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{product.name}</CardTitle>
        <CardDescription className="text-lg">
          {precios()?.price}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {product.variants.length > 1 && (
          <div className="space-y-2">
            <p className="font-semibold">Opciones</p>
            <RadioGroup
              value={selectedVariant}
              onChange={setSelectedVariant}
              className="space-y-2"
            >
              {product.variants.map((variant) => (
                <div key={variant.id} className="space-y-2">
                  <Label>{variant.name}</Label>
                  <div className="flex gap-2 items-center">
                    {variant.options.map((option) => (
                      <Field
                        key={option.id}
                        className="flex items-center gap-2 py-2 px-4 bg-secondary rounded-md relative justify-center"
                      >
                        <Radio value={option} className="">
                          {({ checked, disabled }) => (
                            <span
                              className={clsx(
                                "absolute inset-0 ring-2 rounded-md cursor-pointer flex items-center",
                                checked
                                  ? "ring-primary/60"
                                  : "ring-transparent",
                                disabled && "cursor-not-allowed"
                              )}
                            ></span>
                          )}
                        </Radio>
                        <Label>{option.name}</Label>
                      </Field>
                    ))}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
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
