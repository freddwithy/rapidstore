"use client";

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
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CustomerFormSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  lastName: z.string().min(1, {
    message: "El apellido es requerido",
  }),
  ruc: z.string().min(1, {
    message: "El RUC es requerido",
  }),
  rucName: z.string().min(1, {
    message: "La Razon Social es requerida",
  }),
  tel: z.coerce.number().min(1, {
    message: "El numero de telefono es requerido",
  }),
  city: z.string().min(1, {
    message: "La ciudad es requerida",
  }),
  direction1: z.string().min(1, {
    message: "La direccion es requerida",
  }),
  direction2: z.string().min(1, {
    message: "La direccion es requerida",
  }),
  email: z.string().min(1, {
    message: "El email es requerido",
  }),
});

interface CustomerFormProps {
  storeId: string;
  initialData: Customer | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  storeId,
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof CustomerFormSchema>>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      lastName: initialData?.lastName || "",
      ruc: initialData?.ruc || "",
      rucName: initialData?.rucName || "",
      tel: initialData?.tel || 0,
      city: initialData?.city || "",
      direction1: initialData?.direction1 || "",
      direction2: initialData?.direction2 || "",
      email: initialData?.email || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CustomerFormSchema>) => {
    if (!initialData) {
      try {
        setLoading(true);
        const res = await fetch(`/api/customer`, {
          method: "POST",
          body: JSON.stringify({
            ...data,
            storeId,
          }),
        });

        if (res.ok) {
          setLoading(false);
          toast.success("Cliente creado correctamente");
          router.push(`/manage/${storeId}/customers`);
          router.refresh();
        }
      } catch {
        setLoading(false);
        toast.error("Error al crear el cliente");
        return;
      }
    } else {
      try {
        setLoading(true);
        const res = await fetch(`/api/customer/${initialData.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            ...data,
            storeId,
          }),
        });

        if (res.ok) {
          setLoading(false);
          toast.success("Cliente actualizado correctamente");
          router.push(`/manage/${storeId}/customers`);
          router.refresh();
        }
      } catch {
        setLoading(false);
        toast.error("Error al actualizar el cliente");
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
                  <FormDescription>El nombre del cliente</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>El apellido del cliente</FormDescription>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>El RUC del cliente</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rucName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razon Social</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>La Razon Social del cliente</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>El telefono del cliente</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>El email del cliente</FormDescription>
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>La ciudad del cliente</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direction1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direccion 1</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>La direccion del cliente</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direction2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direccion 2</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>La direccion del cliente</FormDescription>
                </FormItem>
              )}
            />
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

export default CustomerForm;
