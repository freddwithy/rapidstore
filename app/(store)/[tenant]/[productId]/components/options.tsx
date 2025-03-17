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
import { Check, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const addToCart = () => {
    addItem({
      variantId: selectedVariant.id,
      quantity,
      total: (selectedVariant.salePrice || selectedVariant.price) * quantity,
    });
    toast.success("Producto agregado al carrito", {
      action: (
        <Button onClick={() => router.push("cart")}>
          <ShoppingCart />
          Carrito
        </Button>
      ),
      style: {
        justifyContent: "space-between",
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{product.name}</CardTitle>
        <CardDescription className="text-lg">
          {formatter.format(selectedVariant.salePrice || selectedVariant.price)}
        </CardDescription>
        <p className="text-sm">{product.description.slice(0, 600)}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="">Opciones</p>
        <div>
          <RadioGroup
            value={selectedVariant}
            onChange={setSelectedVariant}
            className="flex gap-2"
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
                  {variant.variant.name + " " + variant.color.name}
                </Label>
              </Field>
            ))}
          </RadioGroup>
        </div>
        <p className="">Cantidad</p>
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
      </CardContent>
      <CardFooter>
        <Button onClick={addToCart}>Añadir al carrito</Button>
      </CardFooter>
    </Card>
  );
};

export default Options;
