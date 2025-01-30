"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { uploadToCloudinary } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Prisma, Variant } from "@prisma/client";
import { Loader2, LoaderCircle, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
  price: z.coerce.number().min(1, {
    message: "El precio es requerido",
  }),
  discount: z.coerce
    .number()
    .max(100, {
      message: "El descuento no puede ser mayor a 100%",
    })
    .optional(),
  images: z.any(),
  categories: z
    .any()
    .refine((value) => value.length > 0, {
      message: "Debe seleccionar al menos una categoría",
    })
    .optional(),
  colors: z
    .any()
    .refine((value) => value.length > 0, {
      message: "Debe seleccionar al menos un color",
    })
    .optional(),
  variants: z
    .any()
    .refine((value) => value.length > 0, {
      message: "Debe seleccionar al menos una variante",
    })
    .optional(),
});

type ProductsWithVariants = Prisma.ProductsGetPayload<{
  include: {
    variants: true;
    colors: true;
    categories: true;
  };
}>;

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
  const [variantsSelected, setVariantsSelected] = useState<string[]>([]);
  const [colorsSelected, setColorsSelected] = useState<string[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const onAddColor = (color: string) => {
    if (colorsSelected.includes(color)) return;
    setColorsSelected((current) => [...current, color]);
  };
  const onRemoveColor = (color: string) => {
    setColorsSelected((current) => current.filter((c) => c !== color));
  };

  const onAddCategory = (category: string) => {
    if (categoriesSelected.includes(category)) return;
    setCategoriesSelected((current) => [...current, category]);
  };
  const onRemoveCategory = (category: string) => {
    setCategoriesSelected((current) => current.filter((c) => c !== category));
  };

  const onAddVariant = (variant: string) => {
    if (variantsSelected.includes(variant)) return;
    setVariantsSelected((current) => [...current, variant]);
  };
  const onRemoveVariant = (variant: string) => {
    setVariantsSelected((current) => current.filter((c) => c !== variant));
  };

  const router = useRouter();
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
    },
  });

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
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>El nombre de la producte</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>El precio del producto</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>El descuento del producto</FormDescription>
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
                          <Upload className="text-zinc-600 darK:text-zinc-400 size-6" />
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
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                      No hay imagenes
                    </p>
                  </div>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorias</FormLabel>
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
                    <FormDescription>
                      Las categorias del producto
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => onAddCategory(form.getValues("categories"))}
                className="mt-2"
              >
                <Plus className="size-4" />
                Agregar categoria
              </Button>
            </div>
            <div className="flex items-center gap-x-2">
              {categoriesSelected.length > 0 &&
                categories
                  //filtrar los colores de la tienda que coincidan con los colores seleccionados en el usestate
                  ?.filter((category) =>
                    categoriesSelected.includes(category.id)
                  )
                  .map((category) => (
                    <div key={category.id} className="flex gap-2 items-center">
                      <Badge>{category.name}</Badge>
                      <Button
                        type="button"
                        onClick={() => onRemoveCategory(category.id)}
                        variant="ghost"
                        className="p-1 size-4"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colores</FormLabel>
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
                    <FormDescription>Los colores del producto</FormDescription>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => onAddColor(form.getValues("colors"))}
                className="mt-2"
              >
                <Plus className="size-4" />
                Agregar color
              </Button>
            </div>
            <div className="flex items-center gap-x-2">
              {colorsSelected.length > 0 &&
                colors
                  //filtrar los colores de la tienda que coincidan con los colores seleccionados en el usestate
                  ?.filter((color) => colorsSelected.includes(color.id))
                  .map((color) => (
                    <div key={color.id} className="flex gap-2 items-center">
                      <Badge>{color.name}</Badge>
                      <Button
                        type="button"
                        onClick={() => onRemoveColor(color.id)}
                        variant="ghost"
                        className="p-1 size-4"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <FormField
                control={form.control}
                name="variants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variantes</FormLabel>
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
                      Las variantes del producto
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => onAddVariant(form.getValues("variants"))}
                className="mt-2"
              >
                <Plus className="size-4" />
                Agregar variante
              </Button>
            </div>
            <div className="flex items-center gap-x-2">
              {variantsSelected.length > 0 &&
                variants
                  //filtrar los colores de la tienda que coincidan con los colores seleccionados en el usestate
                  ?.filter((variant) => variantsSelected.includes(variant.id))
                  .map((variant) => (
                    <div key={variant.id} className="flex gap-2 items-center">
                      <Badge>{variant.name}</Badge>
                      <Button
                        type="button"
                        onClick={() => onRemoveVariant(variant.id)}
                        variant="ghost"
                        className="p-1 size-4"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
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
