"use client";
import { Form } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Obligatory from "@/components/ui/obligatory";
import { useState } from "react";
import { toast } from "sonner";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

interface CartFormProps {
  storeId: string;
  onLoadingChange: (isLoading: boolean) => void;
}

const CartFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  lastName: z.string().min(1, { message: "El apellido es requerido" }),
  ruc: z.string().optional(), // Hecho opcional
  rucName: z.string().optional(), // Hecho opcional
  tel: z.number().int({ message: "El teléfono debe ser un número entero" }),
  city: z.string().min(1, { message: "La ciudad es requerida" }),
  direction1: z.string().min(1, { message: "La dirección 1 es requerida" }),
  direction2: z.string().optional(), // Hecho opcional
  email: z
    .string()
    .min(1, { message: "El email es requerido" })
    .email({ message: "El formato del email no es válido" }), // Email requerido y validado
});

const CartForm: React.FC<CartFormProps> = ({ storeId, onLoadingChange }) => {
  const { items, removeAll } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof CartFormSchema>>({
    resolver: zodResolver(CartFormSchema),
    defaultValues: {
      name: "",
      lastName: "",
      ruc: "",
      rucName: "",
      tel: 0,
      city: "",
      direction1: "",
      direction2: "",
      email: "",
    },
  });

  const onSubmitOrder = async (data: z.infer<typeof CartFormSchema>) => {
    try {
      setLoading(true);
      onLoadingChange(true);
      const res = await fetch(`/api/cart`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          items,
          storeId,
        }),
      });

      if (res.ok) {
        const { order } = await res.json();
        setLoading(false);
        onLoadingChange(false);
        removeAll();
        toast.success("Pedido enviado correctamente");
        router.push(`/${storeId}/cart/${order.id}/confirmation`);
      }
    } catch {
      setLoading(false);
      onLoadingChange?.(false);
      toast.error("Error al enviar el pedido");
    }
  };

  return (
    <Form {...form}>
      <form
        id="cart-form"
        className="grid grid-cols-2 gap-4"
        onSubmit={form.handleSubmit(onSubmitOrder)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre <Obligatory />
              </FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Apellido <Obligatory />
              </FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} />
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
              <FormLabel>RUC (Opcional)</FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rucName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razón Social (Opcional)</FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Teléfono <Obligatory />
              </FormLabel>
              <FormControl>
                {/* Ensure Input component handles number type correctly, or use type="number" */}
                <Input
                  type="number"
                  disabled={loading}
                  {...field}
                  onChange={(event) => field.onChange(+event.target.value)}
                />
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
              <FormLabel>
                Ciudad <Obligatory />
              </FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="direction1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Dirección 1 <Obligatory />
              </FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="direction2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección 2 (Opcional)</FormLabel>
              <FormControl>
                <Input disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <Obligatory />
              </FormLabel>
              <FormControl>
                <Input type="email" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CartForm;
