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
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface StoreFormProps {
  ownerId: string | undefined;
  onClose?: () => void;
}

const storeFormScheme = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  description: z.string().min(1, {
    message: "La descripción es requerida",
  }),
  url: z.string().min(1, {
    message: "La URL es requerida",
  }),
  location: z.string().min(1, {
    message: "La ubicación es requerida",
  }),
  city: z.string().min(1, {
    message: "La ciudad es requerida",
  }),
});

const StoreForm: React.FC<StoreFormProps> = ({ ownerId, onClose }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof storeFormScheme>>({
    resolver: zodResolver(storeFormScheme),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      location: "",
      city: "",
    },
  });

  const router = useRouter();

  console.log(form.getValues());
  const createStore = async (data: z.infer<typeof storeFormScheme>) => {
    try {
      setLoading(true);
      const response = await fetch("/api/store", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          url: data.url,
          location: data.location,
          city: data.city,
          ownerId,
        }),
      });

      if (!response.ok) {
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
                <FormLabel>Nombre</FormLabel>
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
                <FormLabel>Link a tu tienda</FormLabel>
                <FormControl>
                  <div className="flex">
                    <p className=" bg-orange-100 rounded-l-md items-center justify-center flex px-3 py-1">
                      https://
                    </p>
                    <Input
                      placeholder="URL"
                      className="rounded-l-none"
                      {...field}
                    />
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
                    className="h-24 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
            Guardar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StoreForm;
