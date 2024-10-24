"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon, LoaderCircle, Trash, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ProductFormProps {
  categories: Category[];
  storeId: string | undefined;
  onClose?: () => void;
}

const ProductFormScheme = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  description: z.string().min(1, {
    message: "La descripción es requerida",
  }),
  price: z.string().min(1, {
    message: "El precio es requerido",
  }),
  discount: z.string(),
  images: z.array(z.string()),
  categories: z.any().refine((value) => value.length > 0, {
    message: "Debe seleccionar al menos una categoría",
  }),
});

const ProductForm: React.FC<ProductFormProps> = ({
  onClose,
  storeId,
  categories,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof ProductFormScheme>>({
    resolver: zodResolver(ProductFormScheme),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      discount: "",
      images: [],
      categories: [],
    },
  });

  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    if (target.files) {
      setLoadingImage(true);
      const file = target.files[0];
      const imageUrl = await uploadToCloudinary(file);

      if (imageUrl) {
        setImages([...images, imageUrl]);
        setLoadingImage(false);
      }
    } else {
      setLoadingImage(false);
      toast.error("Error al seleccionar la imagen");
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ruqmlhen");
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dxyfhaiu2/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      toast.error("Error al subir la imagen");
      return;
    } else {
      toast.success("Imagen subida correctamente");
      const data = await response.json();
      return data.secure_url;
    }
  };

  const createStore = async (data: z.infer<typeof ProductFormScheme>) => {
    try {
      setLoading(true);
      const response = await fetch("/api/product", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          price: data.price,
          discount: data.discount,
          images: {
            url: images,
          },
          categories: data.categories,
          storeId: storeId,
        }),
      });

      if (!response.ok) {
        setLoading(false);
        toast.error("Error al crear la tienda");
        return;
      }

      toast.success("Tienda creada correctamente");
      setLoading(false);
      onClose?.();
      router.refresh();
      return response;
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error al crear la tienda");
    }
  };
  return (
    <ScrollArea className="p-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(createStore)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del producto</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Categoría</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          " justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? categories.find(
                              (category) => category.id === field.value
                            )?.name
                          : "Selecciona una categoría"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 min-w-[380px]">
                    <Command className="w-full">
                      <CommandInput
                        placeholder="Buscar por categoría"
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          No hay categorías, crea una desde el panel
                        </CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem
                              value={category.id}
                              key={category.id}
                              onSelect={() => {
                                form.setValue("categories", category.id);
                              }}
                            >
                              {category.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  category.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
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
                  <div className="flex">
                    <Input type="number" placeholder="Precio" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
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
                  <div className="flex">
                    <Input type="number" placeholder="Descuento" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
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
                  <Textarea
                    placeholder="Descripción"
                    {...field}
                    className="h-24"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            {images.length > 0
              ? images.map((image) => (
                  <div
                    key={image}
                    className="border border-stone-300 rounded-md overflow-hidden size-24 relative"
                  >
                    <button className="absolute top-1 right-1 flex items-center justify-center rounded-full bg-white p-1">
                      <Trash className=" text-red-500 size-4" />
                    </button>
                    <Image src={image} width={100} height={100} alt="product" />
                  </div>
                ))
              : null}
          </div>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <FormControl onChange={handleFileChange}>
                  {!loadingImage ? (
                    <div className="h-24 flex items-center justify-center border border-stone-200 rounded-md relative">
                      <div className="flex flex-col items-center justify-center w-full absolute top-0 left-0 h-24">
                        <Upload className="text-stone-400" />
                        <p className="text-stone-400">Selecciona una imagen</p>
                      </div>
                      <Input
                        className="opacity-0 h-24"
                        type="file"
                        {...field}
                      />
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center border border-stone-200 rounded-md relative">
                      <div className="flex flex-col items-center justify-center w-full absolute top-0 left-0 h-24">
                        <LoaderCircle className="text-stone-400 animate-spin" />
                        <p className="text-stone-400">Cargando imagen</p>
                      </div>
                      <Input
                        className="opacity-0 h-24"
                        type="file"
                        {...field}
                      />
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
            Guardar
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default ProductForm;
