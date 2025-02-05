"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Obligatory from "@/components/ui/obligatory";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatter, uploadToCloudinary } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Prisma, Variant } from "@prisma/client";
import {
  ImageOff,
  Loader2,
  LoaderCircle,
  Trash,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ProductFormSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  description: z.string().min(1, {
    message: "La descripción es requerida",
  }),
  images: z.any(),
  category: z.string().min(1, {
    message: "La categoría es requerida",
  }),
  color: z.string().min(1, {
    message: "El color es requerido",
  }),
  variant: z.string().min(1, {
    message: "La variante es requerida",
  }),
  price: z.coerce
    .number()
    .min(1, {
      message: "El precio es requerido",
    })
    .max(99999999, {
      message: "El precio no puede ser mayor a 99.999.999 Gs.",
    }),
  salePrice: z.number().max(99999999, {
    message: "El precio de venta no puede ser mayor a 99.999.999 Gs.",
  }),
  stock: z.coerce
    .number()
    .min(1, {
      message: "El stock es requerido",
    })
    .max(10000, {
      message: "El stock no puede ser mayor a 10.000 unidades.",
    }),
  isArchived: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

type ProductsWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        color: true;
        variant: true;
      };
    };
    images: true;
  };
}>;

type Option = {
  colorId: string;
  variantId: string;
  price: number;
  salePrice: number;
  stock: number;
};

interface ProductFormProps {
  storeId: string;
  initialData: ProductsWithVariants | null;
  colors: Color[];
  categories: Category[];
  variants: Variant[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  storeId,
  initialData,
  colors,
  categories,
  variants,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setImages(initialData.images.map((i) => i.url) || []);
      setOptions(
        initialData.variants.map((v) => ({
          colorId: v.color.id,
          variantId: v.variant.id,
          price: v.price,
          salePrice: v.salePrice,
          stock: v.stock,
        }))
      );
    }
  }, [initialData]);

  const router = useRouter();
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      isArchived: initialData?.isArchived || false,
      isFeatured: initialData?.isFeatured || false,
      images: initialData?.images.map((i) => i.url) || [],
      category: initialData?.categoryId || "",
      color: initialData?.variants[0].color.id || "",
      variant: initialData?.variants[0].variant.id || "",
      price: initialData?.variants[0].price || 0,
      salePrice: initialData?.variants[0].salePrice || 0,
      stock: initialData?.variants[0].stock || 0,
    },
  });

  const handleAddOption = () => {
    //filtrar y no agregar combinaciones de colorId y variantId que ya existan al estado
    const colorId = form.getValues("color");
    const variantId = form.getValues("variant");
    const price = form.getValues("price");
    const salePrice = form.getValues("salePrice");
    const stock = form.getValues("stock");

    if (
      options.some((o) => o.colorId === colorId && o.variantId === variantId)
    ) {
      toast.error("La combinación de color y variante ya existe");
      return;
    }

    setOptions((current) => [
      ...current,
      {
        colorId,
        variantId,
        price,
        salePrice,
        stock,
      },
    ]);
  };

  const handleRemoveOption = (id: string) => {
    setOptions((current) =>
      current.filter((o) => o.colorId + o.variantId !== id)
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    if (target.files) {
      setLoadingImage(true);
      const file = target.files[0];
      const imageUrl = await uploadToCloudinary(file);

      //valdidate image format
      const allowedFormats = ["jpg", "jpeg", "png", "webp"];
      const extension = file.name.split(".").pop();
      if (!allowedFormats.includes(extension as string)) {
        setLoadingImage(false);
        toast.error("Formato de imagen no permitido");
        return;
      }

      if (imageUrl) {
        setImages([...images, imageUrl]);
        setLoadingImage(false);
      }
    } else {
      setLoadingImage(false);
      toast.error("Error al seleccionar la imagen");
    }
  };

  const handleRemoveImage = (image: string) => {
    setImages((current) => current.filter((i) => i !== image));
  };

  const onSubmit = async (data: z.infer<typeof ProductFormSchema>) => {
    if (!initialData) {
      try {
        setLoading(true);
        const res = await fetch(`/api/product`, {
          method: "POST",
          body: JSON.stringify({
            ...data,
            images,
            variants: options,
            storeId,
          }),
        });

        if (res.ok) {
          setLoading(false);
          toast.success("Producto creado correctamente");
          router.push(`/manage/${storeId}/products`);
          router.refresh();
        }
      } catch {
        setLoading(false);
        toast.error("Error al crear el producto");
        return;
      }
    } else {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/${initialData.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            ...data,
            images,
            variants: options,
            storeId,
          }),
        });

        if (res.ok) {
          setLoading(false);
          toast.success("Producto actualizada correctamente");
          router.push(`/manage/${storeId}/products`);
          router.refresh();
        }
      } catch {
        setLoading(false);
        toast.error("Error al actualizar el producto");
        return;
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <Obligatory />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>El nombre del producto</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descripción <Obligatory />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>La descripción del producto</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Categoria <Obligatory />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="min-w-[200px]">
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>Las categoria del producto</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archivar</FormLabel>
                    <FormDescription>
                      Archiva el producto, no será visible en la tienda.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Destacado</FormLabel>
                    <FormDescription>
                      Marca el producto destacado, aparecer&aacute; en la lista
                      de productos destacados.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <div className="flex gap-x-4">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imágenes</FormLabel>
                  <FormControl onChange={handleFileChange}>
                    {!loadingImage ? (
                      <div className="h-40 flex items-center justify-center border rounded-lg relative">
                        <div className="flex flex-col items-center justify-center w-full absolute top-0 left-0 h-40">
                          <Upload className="text-zinc-600 dark:text-zinc-400 size-6" />
                          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Selecciona una imagen
                          </p>
                        </div>
                        <Input
                          className="opacity-0 h-24 cursor-pointer"
                          type="file"
                          accept="image/*"
                          {...field}
                        />
                      </div>
                    ) : (
                      <div className="h-40 flex items-center justify-center border  rounded-md relative">
                        <div className="flex flex-col items-center justify-center w-full absolute top-0 left-0 h-40">
                          <LoaderCircle className="text-zinc-600 dark:text-zinc-400 animate-spin size-6" />
                          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            Cargando imagen
                          </p>
                        </div>
                        <Input
                          disabled
                          className="opacity-0 h-40"
                          type="file"
                          accept="image/*"
                          {...field}
                        />
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ScrollArea className="w-80 rounded-lg border mt-8">
              <div className="gap-x-2 p-2 h-40 flex items-center">
                {images.length > 0 ? (
                  images.map((image) => (
                    <div
                      key={image}
                      className="size-32 rounded-lg bg-foreground relative hover:scale-105 transition-all overflow-hidden"
                    >
                      <Image
                        className="object-cover"
                        width={128}
                        height={128}
                        src={image}
                        alt="Imagen del producto"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-background rounded-full p-1 hover:scale-105 transition-all"
                        onClick={() => handleRemoveImage(image)}
                      >
                        <X className="size-4 text-primary" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <ImageOff className="size-6 text-zinc-600 dark:text-zinc-400" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                      No hay imagenes
                    </p>
                  </div>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <Separator />
          <div className="flex flex-col gap-y-4">
            <FormLabel>Agregar opciones</FormLabel>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {options.length > 0 &&
                options.map((option) => (
                  <div
                    key={option.colorId + option.colorId}
                    className="border rounded-lg p-4 flex-col gap-y-1 hover:bg-primary-foreground hover:text-primary transition-colors relative"
                  >
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className=" absolute top-2 right-2"
                      onClick={() =>
                        handleRemoveOption(option.colorId + option.variantId)
                      }
                    >
                      <Trash className="text-zinc-600 dark:text-zinc-400 size-4" />
                    </Button>

                    <p className="">
                      {colors.find((c) => c.id === option.colorId)?.name}
                      {" - "}
                      {variants.find((v) => v.id === option.variantId)?.name}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatter.format(option.price)}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {option.stock} un
                    </p>
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Precio <Obligatory />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="2.000.000" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      El precio no puede ser mayor a 99.999.999 Gs.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Precio de promoción <Obligatory />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="1.500.000" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      El precio no puede ser mayor al precio principal
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Stock <Obligatory />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      El stock no puede ser mayor a 999
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Color <Obligatory />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="min-w-[200px]">
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color.id} value={color.id}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription>
                      Selecciona el color del producto
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="variant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Variante/Tamaño <Obligatory />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="min-w-[200px]">
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {variants.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {variant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription>
                      Selecciona la variante del producto
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="secondary"
                disabled={loading}
                onClick={handleAddOption}
                className="mt-8"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Agregar opción
              </Button>
            </div>
          </div>
          <Button disabled={loading} type="submit">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
