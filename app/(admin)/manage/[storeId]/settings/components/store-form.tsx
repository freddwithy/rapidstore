"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
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
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";

import { LoaderCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface StoreFormProps {
  ownerId: string | undefined;
  storeId: string | undefined;
  store: Store;
}

// Regex for URL/slug validation (no spaces, lowercase)
const slugValidation = /^[a-z0-9-]+$/;

// Regex for WhatsApp (only numbers)
const whatsappValidation = /^\d+$/;

// Regex for Instagram username (no @ symbol, alphanumeric and underscore)
const instagramUsernameValidation = /^[a-zA-Z0-9_]+$/;

export const storeFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "El nombre debe tener al menos 3 caracteres",
    })
    .max(100, {
      message: "El nombre no puede tener más de 100 caracteres",
    })
    .trim(), // Remove leading/trailing whitespace

  description: z
    .string()
    .min(10, {
      message: "La descripción debe tener al menos 10 caracteres",
    })
    .max(500, {
      message: "La descripción no puede tener más de 500 caracteres",
    })
    .trim(),

  url: z
    .string()
    .min(3, {
      message: "El slug debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "El slug no puede tener más de 50 caracteres",
    })
    .regex(slugValidation, {
      message:
        "El slug solo puede contener letras minúsculas, números y guiones",
    })
    .toLowerCase(), // Ensure lowercase

  location: z
    .string()
    .min(3, {
      message: "La dirección debe tener al menos 3 caracteres",
    })
    .max(200, {
      message: "La dirección no puede tener más de 200 caracteres",
    })
    .trim(),

  city: z
    .string()
    .min(2, {
      message: "La ciudad debe tener al menos 2 caracteres",
    })
    .max(100, {
      message: "La ciudad no puede tener más de 100 caracteres",
    })
    .trim(),

  ruc: z
    .string()
    .min(6, {
      message: "El RUC debe tener al menos 6 caracteres",
    })
    .max(20, {
      message: "El RUC no puede tener más de 20 caracteres",
    })
    .trim(),

  whatsapp: z
    .string()
    .regex(whatsappValidation, {
      message: "El número de WhatsApp solo puede contener números",
    })
    .min(8, {
      message: "El número de WhatsApp debe tener al menos 8 dígitos",
    })
    .max(15, {
      message: "El número de WhatsApp no puede tener más de 15 dígitos",
    }),

  instagram: z
    .string()
    .regex(instagramUsernameValidation, {
      message:
        "El usuario de Instagram solo puede contener letras, números y guiones bajos",
    })
    .min(3, {
      message: "El usuario de Instagram debe tener al menos 3 caracteres",
    })
    .max(30, {
      message: "El usuario de Instagram no puede tener más de 30 caracteres",
    }),

  logo: z.string().optional(),
});

const StoreForm: React.FC<StoreFormProps> = ({ ownerId, storeId, store }) => {
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (store.logo) {
      setImage(store.logo);
    }
  }, [store]);

  const form = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: store.name || "",
      description: store.description || "",
      url: store.url || "",
      location: store.location || "",
      city: store.city || "",
      ruc: store.ruc || "",
      whatsapp: store.whatsapp || "", //e.g,
      instagram: store.instagram || "",
      logo: "",
    },
  });

  const router = useRouter();

  const createStore = async (data: z.infer<typeof storeFormSchema>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/store/${storeId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          url: data.url,
          location: data.location,
          city: data.city,
          ruc: data.ruc,
          whatsapp: data.whatsapp,
          instagram: data.instagram,
          logo: image,
          ownerId,
        }),
      });

      if (!response.ok) {
        toast.error("Error al actualizar la tienda");
        return;
      }

      toast.success("Tienda actualizada correctamente");
      setLoading(false);
      router.refresh();
      return response;
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error al actualizar la tienda");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    if (target.files) {
      setLoadingImage(true);
      const file = target.files[0];
      const imageUrl = await uploadToCloudinary(file);

      //imageUr

      //valdidate image format
      const allowedFormats = ["jpg", "jpeg", "png", "webp"];
      const extension = file.name.split(".").pop();
      if (!allowedFormats.includes(extension as string)) {
        setLoadingImage(false);
        setImage("");
        setOpen(false);
        toast.error("Formato de imagen no permitido");
        return;
      }

      if (imageUrl) {
        setImage(imageUrl);
        setLoadingImage(false);
        setOpen(false);
      }
    } else {
      setLoadingImage(false);
      setImage("");
      setOpen(false);
      toast.error("Error al seleccionar la imagen");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestiona tu tienda</CardTitle>
        <CardDescription>Configura los datos de tu tienda.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
            onSubmit={form.handleSubmit(createStore)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la tienda</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subdominio de la tienda</FormLabel>

                  <FormControl>
                    <div className="flex">
                      <Input
                        placeholder="URL"
                        className="rounded-r-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    www.giddi.shop/
                    {form.getValues().url ? form.getValues().url : "tutienda"}
                  </FormDescription>
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
                      className="h-24 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 items-center mt-4">
              <Avatar className="size-32 rounded-lg">
                <AvatarImage
                  src={image}
                  alt={store?.name}
                  className="object-center object-cover"
                />
                <AvatarFallback className="text-xl rounded-lg font-semibold">
                  {store?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl onChange={handleFileChange}>
                      <div className="flex flex-col items-center relative">
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              type="button"
                              onClick={() => setOpen(true)}
                            >
                              {loadingImage ? (
                                <LoaderCircle className="animate-spin size-4" />
                              ) : (
                                <Upload className="size-4" />
                              )}{" "}
                              Subir foto
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Subir foto de perfil</DialogTitle>
                              <DialogDescription>
                                Selecciona una imagen para tu perfil.
                              </DialogDescription>
                            </DialogHeader>
                            <Card className="p-4 flex flex-col items-center justify-center h-40 gap-y-1 relative">
                              {loadingImage ? (
                                <LoaderCircle className="animate-spin size-5" />
                              ) : (
                                <Upload className="size-5 text-muted-foreground" />
                              )}
                              <p className="text-sm text-muted-foreground">
                                {loadingImage
                                  ? "Cargando..."
                                  : "Arrastra o selecciona una imagen"}
                              </p>
                              <Input
                                className="opacity-0 absolute h-40 cursor-pointer"
                                type="file"
                                accept="image/jpeg, image/png, image/webp, image/jpg"
                                {...field}
                              />
                            </Card>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ubicación" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ruc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RUC</FormLabel>
                  <FormControl>
                    <Input placeholder="RUC/CI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ciudad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="0900123123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="giddi.shop" {...field} />
                  </FormControl>
                  <FormDescription>Pon el instagram sin el @</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          onClick={form.handleSubmit(createStore)}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
          Guardar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreForm;
