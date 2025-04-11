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
    product.variants.length > 0 ? product.variants[0].options[0] : product
  );
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  // Determinar si es un producto con variantes
  const hasVariants = product.variants.length > 0;

  // Comprobar si está en el carrito
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

  const SafeHTML = () => {
    const sanitizedContent = DOMPurify.sanitize(product.description);

    return (
      <div
        className="prose text-muted-foreground prose-strong:text-muted-foreground prose-sm prose-p:text-sm"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  };

  const addToCart = () => {
    // Calcular el precio correcto según si es producto o variante
    const itemPrice = hasVariants
      ? selectedVariant.salePrice || selectedVariant.price || 0
      : product.salePrice || product.price || 0;

    const successToast = () => {
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
    };

    if (isInCart && isInCartQuantity?.quantity) {
      // Ya está en el carrito, actualizar cantidad
      if (hasVariants) {
        // Producto con variantes: usar optionId
        updateItem(
          selectedVariant.id,
          "",
          isInCartQuantity.quantity + quantity
        );
      } else {
        // Producto sin variantes: usar productId
        updateItem("", product.id, isInCartQuantity.quantity + quantity);
      }
      successToast();
    } else {
      // No está en el carrito, añadir nuevo item
      addItem({
        // Usar optionId solo si tiene variantes
        optionId: hasVariants ? selectedVariant.id : undefined,
        productId: product.id,
        quantity,
        total: itemPrice,
      });
      successToast();
    }
  };

  const precios = () => {
    if (selectedVariant.id) {
      if (selectedVariant.salePrice) {
        const price = formatter.format(selectedVariant.salePrice);

        return { price };
      }

      return { price: formatter.format(selectedVariant.price || 0) };
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
        {product.variants.length > 0 && (
          <div className="space-y-2">
            <RadioGroup
              value={selectedVariant}
              onChange={setSelectedVariant}
              className="space-y-2"
            >
              {product.variants.map((variant) => (
                <div key={variant.id} className="space-y-2">
                  <Label className="font-semibold">{variant.name}</Label>
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
        {selectedVariant.status !== "AGOTADO" && (
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
        )}
        {selectedVariant.status === "AGOTADO" && (
          <Button disabled variant="secondary" type="button">
            Agotado
          </Button>
        )}
        {selectedVariant.status !== "AGOTADO" && (
          <Button onClick={addToCart}>Añadir al carrito</Button>
        )}
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
