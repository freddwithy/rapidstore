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
import { uploadToCloudinary } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Prisma } from "@prisma/client";
import {
  Boxes,
  Check,
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
  salePrice?: number | null;
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
  const [open, setOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<{
    optionName: string;
    valueName: string;
  } | null>(null);
  const [editedName, setEditedName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setImages(initialData.images.map((i) => i.url) || []);
      setOptions(
        initialData.variants.map((v) => ({
          name: v.name,
          values: v.options.map((o) => ({
            name: o.name,
            price: o.price,
            salePrice: o.salePrice,
            status: o.status,
          })),
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
      status: initialData?.status || "EN_VENTA",
      isFeatured: initialData?.isFeatured || false,
      category: initialData?.categoryId || "",
      price: initialData?.price || 0,
      salePrice: initialData?.salePrice || 0,
      optionStatus: "DISPONIBLE",
    },
  });

  const removeValue = (o: Option, v: Values) => {
    const updatedOptions = options.map((option) => {
      if (option.name === o.name) {
        return {
          ...option,
          values: option.values.filter((value) => value.name !== v.name),
        };
      }
      return option;
    });

    // Verificar si alguna opción quedó sin values
    const optionsWithValues = updatedOptions.filter(
      (option) => option.values.length > 0
    );

    setOptions(optionsWithValues);
  };

  // Función para eliminar toda la opción completamente
  const removeOption = (optionName: string) => {
    setOptions((current) =>
      current.filter((option) => option.name !== optionName)
    );
    toast.success(`Opción "${optionName}" eliminada correctamente.`);
  };

  // Función para actualizar una opción en el estado options
  const handleUpdateValues = (optionName: string, updatedItem: Values) => {
    if (!updatedItem) return toast.error("Es necesario rellenar los campos.");
    if (!optionName) return toast.error("Falta la variante.");

    // Clonar el estado actual para evitar problemas de referencias
    setOptions((prevOptions) => {
      // Creamos una copia profunda del estado para trabajar con ella
      return prevOptions.map((option) => {
        if (option.name === optionName) {
          // Para este option específico, actualiza solo el value que corresponde
          const updatedValues = option.values.map((value) => {
            if (value.name === updatedItem.name) {
              // Creamos un nuevo objeto solo para la variante que se está editando
              return {
                ...value, // Mantener otras propiedades
                price: updatedItem.price,
                salePrice: updatedItem.salePrice,
                status: updatedItem.status,
              };
            }
            return value; // Mantener las demás variantes sin cambios
          });

          return {
            ...option,
            values: updatedValues,
          };
        }
        return option; // Mantener las otras opciones sin cambios
      });
    });
  };

  // Función para actualizar el nombre de una opción
  const handleUpdateOptionName = (oldName: string, newName: string) => {
    if (!newName) return toast.error("El nombre no puede estar vacío");

    setOptions((prevOptions) =>
      prevOptions.map((option) => {
        if (option.name === oldName) {
          return {
            ...option,
            name: newName,
          };
        }
        return option;
      })
    );

    setEditingOption(null);
    toast.success(`Opción "${oldName}" renombrada a "${newName}"`);
  };

  // Función para actualizar el nombre de un valor
  const handleUpdateValueName = (
    optionName: string,
    oldName: string,
    newName: string
  ) => {
    if (!newName) return toast.error("El nombre no puede estar vacío");

    setOptions((prevOptions) =>
      prevOptions.map((option) => {
        if (option.name === optionName) {
          return {
            ...option,
            values: option.values.map((value) => {
              if (value.name === oldName) {
                return {
                  ...value,
                  name: newName,
                };
              }
              return value;
            }),
          };
        }
        return option;
      })
    );

    setEditingValue(null);
    toast.success(`Valor "${oldName}" renombrado a "${newName}"`);
  };

  const handleAddOption = () => {
    const name = form.getValues("variantName");

    if (!name) {
      toast.error("Todos los campos son requeridos");
      return;
    }

    // No permitir más de una opción
    if (options.length > 0) {
      toast.error(
        "Solo se permite una opción. Añade variantes a la existente."
      );
      return;
    }

    // Validar que haya al menos una variante
    if (values.length === 0) {
      toast.error("Agrega al menos una variante");
      return;
    }

    setOptions((current) => [
      ...current,
      {
        name: name,
        values,
      },
    ]);

    toast.success(`Opción "${name}" creada correctamente.`);

    // Limpiar campos después de agregar
    form.resetField("variantName");
    form.resetField("optionName");
    form.resetField("valuePrice");
    form.resetField("valueSalePrice");
    form.resetField("optionStatus");
    setValues([]);
    setOpen(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    if (target.files) {
      setLoadingImage(true);
      const file = target.files[0];

      // Validar formato de imagen
      const allowedFormats = ["jpg", "jpeg", "png", "webp"];
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!extension || !allowedFormats.includes(extension)) {
        setLoadingImage(false);
        toast.error("Formato de imagen no permitido");
        return;
      }

      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        setImages([...images, imageUrl]);
        setLoadingImage(false);
      } else {
        setLoadingImage(false);
        toast.error("Error al subir la imagen");
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
    if (!images.length) {
      toast.error("Debes agregar al menos una imagen");
      return;
    }

    try {
      setLoading(true);
      const endpoint = initialData
        ? `/api/product/${initialData.id}`
        : `/api/product`;
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        body: JSON.stringify({
          ...data,
          images,
          options,
          storeId,
        }),
      });

      if (res.ok) {
        setLoading(false);
        toast.success(
          `Producto ${initialData ? "actualizado" : "creado"} correctamente`
        );
        router.push(`/manage/${storeId}/products`);
        router.refresh();
      } else {
        throw new Error();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
      toast.error(
        `Error al ${initialData ? "actualizar" : "crear"} el producto`,
        err
      );
    }
  };

  return (
    <>
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
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Seleccione una categoría"
                          />
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
                      Las categoria del producto
                    </FormDescription>
                  </FormItem>
                )}
              />
              {options.length <= 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Precio <Obligatory />
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          El precio del producto
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promoción</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>Precio de promoción</FormDescription>
                      </FormItem>
                    )}
                  />
                </>
              )}
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
                    <FormDescription>
                      La descripción del producto
                    </FormDescription>
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
                        <div className="h-40 flex items-center justify-center border rounded-md relative">
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
                          className="object-cover object-center"
                          width={128}
                          height={128}
                          src={image}
                          alt="Imagen del producto"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-white rounded-full p-1 hover:scale-105 transition-all"
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
              <div className="space-y-3">
                {options.length > 0 &&
                  options.map((o, i) => (
                    <div
                      key={i}
                      className="space-y-3 border p-3 sm:p-4 rounded-md overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2">
                          <Boxes className="size-5" />
                          {editingOption === o.name ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="max-w-xs bg-white dark:bg-background"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleUpdateOptionName(o.name, editedName);
                                  } else if (e.key === "Escape") {
                                    setEditingOption(null);
                                  }
                                }}
                              />
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 flex-shrink-0"
                                  onClick={() =>
                                    handleUpdateOptionName(o.name, editedName)
                                  }
                                >
                                  <Check className="size-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 flex-shrink-0"
                                  onClick={() => setEditingOption(null)}
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-medium">{o.name}</p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 "
                                onClick={() => {
                                  setEditingOption(o.name);
                                  setEditedName(o.name);
                                }}
                              >
                                <Pencil className="size-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-x-2">
                          {/* Botón para agregar variante directamente */}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setOpen(true); // Abrir el diálogo de agregar variante
                              form.setValue("variantName", o.name); // Preseleccionar la opción actual
                            }}
                          >
                            <Plus className="size-4 mr-1" />
                            <span className="hidden sm:inline">
                              Añadir variante
                            </span>
                            <span className="sm:hidden">Variante</span>
                          </Button>

                          {/* Botón para eliminar toda la opción */}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setOptionToDelete(o.name);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="size-4 mr-1" />
                            <span className="hidden sm:inline">
                              Eliminar opción
                            </span>
                            <span className="sm:hidden">Eliminar</span>
                          </Button>
                        </div>
                      </div>

                      {o.values.length > 0 &&
                        o.values.map((v, i) => {
                          // Crear un ID único para cada valor
                          const valueId = `${o.name}-${v.name}-${i}`;

                          return (
                            <div
                              className="flex flex-col space-y-4 p-3 sm:p-4 rounded-md bg-secondary"
                              key={valueId}
                            >
                              <div className="flex flex-row justify-between items-center gap-2 w-full">
                                <div className="flex items-center gap-x-2">
                                  <div
                                    className={`rounded-full size-2 ${v.status === "DISPONIBLE" ? "bg-green-500" : "bg-zinc-200"}`}
                                  />
                                  {editingValue &&
                                  editingValue.optionName === o.name &&
                                  editingValue.valueName === v.name ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        value={editedName}
                                        onChange={(e) =>
                                          setEditedName(e.target.value)
                                        }
                                        className="max-w-xs bg-white dark:bg-background"
                                        autoFocus
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleUpdateValueName(
                                              o.name,
                                              v.name || "",
                                              editedName
                                            );
                                          } else if (e.key === "Escape") {
                                            setEditingValue(null);
                                          }
                                        }}
                                      />
                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 flex-shrink-0"
                                          onClick={() => {
                                            handleUpdateValueName(
                                              o.name,
                                              v.name || "",
                                              editedName
                                            );
                                          }}
                                        >
                                          <Check className="size-4" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 flex-shrink-0"
                                          onClick={() => setEditingValue(null)}
                                        >
                                          <X className="size-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <FormLabel>{v.name}</FormLabel>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => {
                                          const safeName = v.name || "";
                                          setEditingValue({
                                            optionName: o.name,
                                            valueName: safeName,
                                          });
                                          setEditedName(safeName);
                                        }}
                                      >
                                        <Pencil className="size-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="flex-shrink-0"
                                  onClick={() => removeValue(o, v)}
                                >
                                  <Trash className="size-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                <div className="w-full space-y-1 min-w-0">
                                  <FormLabel className="text-sm sm:text-base">
                                    Precio
                                  </FormLabel>
                                  <Input
                                    id={`${valueId}-price`}
                                    defaultValue={v.price}
                                    disabled={
                                      options.length > 0 && userType === "FREE"
                                    }
                                    placeholder="Gs. 100.000"
                                    type="number"
                                    className="bg-white dark:bg-background text-sm sm:text-base"
                                    onChange={(e) => {
                                      const updatedItem: Values = {
                                        name: v.name || "",
                                        price: Number(e.target.value),
                                        salePrice: v.salePrice,
                                        status: v.status,
                                      };
                                      handleUpdateValues(o.name, updatedItem);
                                    }}
                                  />
                                </div>
                                <div className="w-full space-y-1 min-w-0">
                                  <FormLabel className="text-sm sm:text-base">
                                    Promoción
                                  </FormLabel>
                                  <Input
                                    id={`${valueId}-salePrice`}
                                    defaultValue={v.salePrice || ""}
                                    disabled={
                                      options.length > 0 && userType === "FREE"
                                    }
                                    placeholder="Gs. 50.000"
                                    type="number"
                                    className="bg-white dark:bg-background text-sm sm:text-base"
                                    onChange={(e) => {
                                      const salePrice = e.target.value
                                        ? Number(e.target.value)
                                        : null;
                                      const updatedItem: Values = {
                                        name: v.name || "",
                                        price: v.price,
                                        salePrice: salePrice,
                                        status: v.status,
                                      };
                                      handleUpdateValues(o.name, updatedItem);
                                    }}
                                  />
                                </div>
                                <div className="w-full space-y-1 min-w-0">
                                  <FormLabel className="text-sm sm:text-base">
                                    Estado
                                  </FormLabel>
                                  <Select
                                    defaultValue={v.status}
                                    onValueChange={(value) => {
                                      const updatedItem: Values = {
                                        name: v.name || "",
                                        price: v.price,
                                        salePrice: v.salePrice,
                                        status: value,
                                      };
                                      handleUpdateValues(o.name, updatedItem);
                                    }}
                                  >
                                    <SelectTrigger className="bg-white dark:bg-background text-sm">
                                      <SelectValue defaultValue={v.status} />
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
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ))}
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <div className="flex w-full">
                    {options.length === 0 && (
                      <Button type="button" variant={"secondary"}>
                        <Plus className="size-4" />
                        Agregar opción
                      </Button>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-md sm:max-w-lg w-full">
                  <DialogHeader>
                    <DialogTitle>Agregar opción</DialogTitle>
                    <DialogDescription>
                      Agrega opciones para el producto.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-8">
                    {options.length === 0 && (
                      <FormField
                        control={form.control}
                        name="variantName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nombre <Obligatory />
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={userType === "FREE"}
                                placeholder="Color, talla, etc."
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <div className="space-y-3">
                      <FormLabel>Opciones disponibles</FormLabel>
                      {values.length > 0 && (
                        <div className="space-y-3">
                          {values.map((value, i) => (
                            <div
                              className="px-4 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border justify-between flex items-center animate-fade-up duration-150 ease-out"
                              key={i}
                            >
                              {value.name}
                              <Button
                                variant="outline"
                                size="icon"
                                type="button"
                                onClick={() =>
                                  setValues((current) => {
                                    return current.filter((v, j) => j !== i);
                                  })
                                }
                              >
                                <Trash className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="">
                        <FormField
                          control={form.control}
                          name="optionName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="space-y-2 w-full">
                                  <div className="flex items-center w-full justify-between gap-x-2 relative">
                                    <Input
                                      placeholder="Blanco, negro, etc."
                                      type="text"
                                      className="p-4 sm:p-6"
                                      {...field}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="absolute right-4"
                                      onClick={() => {
                                        if (!field.value) {
                                          toast.error(
                                            "Ingresa un nombre para la opción"
                                          );
                                          return;
                                        }
                                        setValues((prevState: Values[]) => {
                                          return [
                                            ...prevState,
                                            {
                                              name: field.value || "",
                                              price: 0,
                                              salePrice: 0,
                                              status: "DISPONIBLE",
                                            },
                                          ];
                                        });
                                        field.onChange("");
                                      }}
                                    >
                                      <Plus className="size-4" />
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
                  </div>
                  <DialogFooter>
                    {options.length === 0 ? (
                      <Button
                        type="button"
                        variant="default"
                        onClick={handleAddOption}
                      >
                        Crear opción
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => {
                          if (values.length === 0) {
                            toast.error("Agrega al menos una variante");
                            return;
                          }
                          // Agregar las variantes a la opción existente
                          setOptions((prevOptions) => {
                            return prevOptions.map((option) => {
                              // Solo modificamos la primera opción (la única que debe existir)
                              if (option.name === prevOptions[0].name) {
                                // Comprobar si alguna variante ya existe
                                const existingNames = option.values.map(
                                  (v) => v.name
                                );
                                const newValues = values.filter(
                                  (v) => !existingNames.includes(v.name)
                                );

                                return {
                                  ...option,
                                  values: [...option.values, ...newValues],
                                };
                              }
                              return option;
                            });
                          });

                          // Limpiar el estado después de agregar
                          setValues([]);
                          setOpen(false);
                          toast.success("Variantes agregadas correctamente");
                        }}
                      >
                        Agregar variantes
                      </Button>
                    )}
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

      {/* Diálogo de confirmación para eliminar opción */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar la opción &ldquo;{optionToDelete}&rdquo;
              y todas sus variantes? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (optionToDelete) {
                  removeOption(optionToDelete);
                  setOptionToDelete(null);
                }
                setDeleteDialogOpen(false);
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductForm;
