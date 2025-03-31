"use client";
import Tiptap from "@/components/tiptap";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Category, Prisma } from "@prisma/client";
import {
  ImageOff,
  Loader2,
  LoaderCircle,
  Pencil,
  Plus,
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
  variantName: z.string().optional(),
  optionName: z.string().optional(),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(1500, "La descripción no puede tener más de 1500 caracteres"),
  images: z.string().url("Debe ser una URL válida").optional(),
  category: z.string().min(1, "La categoría es requerida"),
  price: z.coerce
    .number({
      invalid_type_error: "El precio debe ser un número válido",
    })
    .max(99999999, "El precio no puede ser mayor a 99.999.999 Gs.")
    .optional(),
  salePrice: z.coerce
    .number({
      invalid_type_error: "El precio de venta debe ser un número válido",
    })
    .max(99999999, "El precio de venta no puede ser mayor a 99.999.999 Gs.")
    .optional(),
  valuePrice: z.coerce
    .number({
      invalid_type_error: "El precio debe ser un número valido",
    })
    .max(99999999, "El precio no puede ser mayor a 99.999.999 Gs.")
    .optional(),
  valueSalePrice: z.coerce
    .number({
      invalid_type_error: "El precio de venta debe ser un número valido",
    })
    .max(99999999, "El precio de venta no puede ser mayor a 99.999.999 Gs.")
    .optional(),
  isFeatured: z.boolean().optional().default(false),
  status: z
    .string()
    .min(1, "El estado es requerido")
    .optional()
    .default("EN_VENTA"),
  optionStatus: z.string().optional().default("DISPONIBLE"),
});

type ProductsWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        options: true;
      };
    };
    images: true;
  };
}>;

type Option = {
  values: Values[];
  name: string;
};

type Values = {
  name: string;
  price?: number;
  salePrice?: number | null; // Change this line
  status: string | "DISPONIBLE";
};

interface ProductFormProps {
  storeId: string;
  initialData: ProductsWithVariants | null;
  categories: Category[];
  userType: "PRO" | "FREE" | "PREMIUM" | undefined;
}

const ProductForm: React.FC<ProductFormProps> = ({
  storeId,
  initialData,
  categories,
  userType,
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [values, setValues] = useState<Values[]>([]);

  useEffect(() => {
    if (initialData) {
      setImages(initialData.images.map((i) => i.url) || []);
      setOptions(
        initialData.variants.flatMap((v) =>
          v.options.length > 0
            ? v.options.map((o) => ({
                name: o.name,
                values: [
                  {
                    name: o.name,
                    price: o.price,
                    salePrice: o.salePrice,
                    status: o.status,
                  },
                ],
              }))
            : []
        )
      );
    }
  }, [initialData]);

  const router = useRouter();
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      status: initialData?.status,
      isFeatured: initialData?.isFeatured || false,
      category: initialData?.categoryId || "",
      price: initialData?.variants[0].options[0].price || 0,
      salePrice: initialData?.variants[0].options[0].salePrice || 0,
    },
  });

  const handleAddOption = () => {
    //filtrar y no agregar combinaciones de colorId y variantId que ya existan al estado
    const name = form.getValues("variantName");

    const valueName = form.getValues("optionName");
    //si el usuario es free solo puede agregar 1 opcion

    if (userType === "FREE" && options.length > 0) {
      toast.error("No puedes agregar más opciones");
      return;
    }

    if (!name || !valueName) {
      toast.error("Todos los campos son requeridos");
      return;
    }

    setOptions((current) => [
      ...current,
      {
        name: name,
        values: values,
      },
    ]);

    toast.success("Opción agregada correctamente");
  };

  const handleRemoveOption = (id: string) => {
    setOptions((current) => current.filter((o) => o.name !== id));
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
            options,
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
            options,
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descripción <Obligatory />
                  </FormLabel>
                  <FormControl>
                    <Tiptap
                      description={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>La descripción del producto</FormDescription>
                </FormItem>
              )}
            />
            <div className="space-y-4">
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
                        Marca el producto destacado, aparecer&aacute; en la
                        lista de productos destacados.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
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
            <div>
              <FormLabel>Variantes</FormLabel>
              <FormDescription>
                Agrega variaciones a tu producto, como tallas, colores, etc.
              </FormDescription>
            </div>

            {options.length > 0 && (
              <div className="space-y-2">
                {options.map((option, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-x-2 justify-between">
                      <FormLabel>{option.name}</FormLabel>
                      <Button variant="outline">
                        <Pencil />
                        Editar
                      </Button>
                    </div>

                    {option.values.map((value, i) => (
                      <div
                        key={i}
                        className="bg-secondary p-4 rounded-lg space-y-4"
                      >
                        <FormLabel>
                          <div className="flex items-center gap-x-2">
                            <div
                              className={`rounded-full size-2 bg-green-500 ${value.status === "DISPONIBLE" ? "bg-green-500" : "bg-zinc-200"}`}
                            />{" "}
                            {value.name}
                          </div>
                        </FormLabel>
                        <div className="flex items-center gap-x-2">
                          <FormItem>
                            <FormLabel>Precio</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={value.price || 0}
                                value={value.price}
                                type="number"
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          <FormItem>
                            <FormLabel>Promoci&oacute;n</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={value.salePrice || 0}
                                value={value.salePrice || 0}
                                type="number"
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          <FormItem>
                            <FormLabel>Disponibilidad</FormLabel>
                            <FormControl>
                              <Select>
                                <SelectTrigger className="bg-background">
                                  <SelectValue
                                    defaultValue={value.status}
                                    placeholder="Disponibilidad"
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="DISPONIBLE">
                                    Disponible
                                  </SelectItem>
                                  <SelectItem value="AGOTADO">
                                    Agotado
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex">
                  <Button
                    type="button"
                    variant={"secondary"}
                    disabled={options.length > 0 && userType === "FREE"}
                  >
                    <Plus className="size-4" />
                    Agregar opción
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle>Agregar opción</DialogTitle>
                  <DialogDescription>
                    Agrega opciones para el producto.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="variantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            disabled={options.length > 0 && userType === "FREE"}
                            placeholder="Color, talla, etc."
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="optionName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valores disponibles</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              {values.length > 0 &&
                                values.map((value) => (
                                  <div
                                    key={value.name}
                                    className="flex items-center gap-x-2"
                                  >
                                    <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 py-1.5 px-4 border rounded-md text-sm w-full">
                                      <span>{value.name}</span>
                                    </div>
                                    <Button
                                      variant="secondary"
                                      size="icon"
                                      onClick={() => {
                                        setValues((prev) =>
                                          prev.filter(
                                            (item) => item.name !== value.name
                                          )
                                        );
                                      }}
                                    >
                                      <Trash />
                                    </Button>
                                  </div>
                                ))}

                              <div className="flex items-center gap-x-2">
                                <Input
                                  disabled={
                                    options.length > 0 && userType === "FREE"
                                  }
                                  placeholder="Blanco, negro, etc."
                                  type="text"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="secondary"
                                  onClick={() =>
                                    setValues((prev) => [
                                      ...prev,
                                      {
                                        name: field.value as string,
                                        price: 0,
                                        status: "DISPONIBLE",
                                      },
                                    ])
                                  }
                                >
                                  <Plus />
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    disabled={options.length > 0 && userType === "FREE"}
                    onClick={handleAddOption}
                  >
                    {options.length > 0 && userType === "FREE"
                      ? "Inhabilitado"
                      : "Guardar"}
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancelar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {options.length > 0 && userType === "FREE" && (
              <p className="text-sm text-muted-foreground">
                Si quieres agregar mas variantes debes actualizar tu plan
                actual.
                <Obligatory />
              </p>
            )}
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
