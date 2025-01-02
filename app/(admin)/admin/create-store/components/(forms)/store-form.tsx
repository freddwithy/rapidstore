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
import { zodResolver } from "@hookform/resolvers/zod";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface StoreFormProps {
  ownerId: string | undefined;
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
  ruc: z.string().min(1, {
    message: "El número de RUC es requerido",
  }),
});

const StoreForm: React.FC<StoreFormProps> = ({ ownerId }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof storeFormScheme>>({
    resolver: zodResolver(storeFormScheme),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      location: "",
      city: "",
      ruc: "",
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
          ruc: data.ruc,
          ownerId,
        }),
      });

      if (!response.ok) {
        toast.error("Error al crear la tienda");
        return;
      }

      toast.success("Tienda creada correctamente");
      setLoading(false);
      router.push("/admin");
      return response;
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error al crear la tienda");
      router.refresh();
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crea tu tienda de Giddi!</CardTitle>
        <CardDescription>
          Completa el siguiente formulario para crear tu tienda en Giddi.
        </CardDescription>
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
                      <p className="flex-1 bg-muted rounded-r-md items-center justify-center flex px-3 py-1">
                        giddi.shop
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    www.
                    {form.getValues().url ? form.getValues().url : "tutienda"}
                    .giddi.shop
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
