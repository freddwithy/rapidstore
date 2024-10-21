"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ProductFormProps {
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
  images: z.any(),
  categories: z.array(z.string()),
});

const ProductForm: React.FC<ProductFormProps> = ({ onClose, storeId }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof ProductFormScheme>>({
    resolver: zodResolver(ProductFormScheme),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      discount: "",
      images: "",
      categories: [],
    },
  });

  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    if (target.files) {
      setLoading(true);
      const file = target.files[0];
      const imageUrl = await uploadToCloudinary(file);

      if (imageUrl) {
        setImages([...images, imageUrl]);
        setLoading(false);
      }
    } else {
      setLoading(false);
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
          images: images,
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
    <div className="p-4">
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
                  <Input type="file" placeholder="Imagen" {...field} />
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
    </div>
  );
};

export default ProductForm;
