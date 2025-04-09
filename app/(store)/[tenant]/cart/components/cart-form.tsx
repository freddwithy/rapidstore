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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Obligatory from "@/components/ui/obligatory";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

interface CartFormProps {
  storeId: string;
  tenant: string;
  onLoadingChange: (isLoading: boolean) => void;
}

// Esquema base con campos comunes
const BaseCustomerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El email es requerido" })
    .email({ message: "El formato del email no es válido" }),
  name: z.string().optional(),
  lastName: z.string().optional(),
  ruc: z.string().optional(),
  rucName: z.string().optional(),
  tel: z.number().optional(),
  city: z.string().optional(),
  direction1: z.string().optional(),
  direction2: z.string().optional(),
  isExistingCustomer: z.boolean(),
});

// Esquema para clientes nuevos (campos requeridos)
const NewCustomerSchema = BaseCustomerSchema.extend({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  lastName: z.string().min(1, { message: "El apellido es requerido" }),
  tel: z.number().int({ message: "El teléfono debe ser un número entero" }),
  city: z.string().min(1, { message: "La ciudad es requerida" }),
  direction1: z.string().min(1, { message: "La dirección 1 es requerida" }),
  isExistingCustomer: z.literal(false),
});

// Esquema para clientes existentes (solo email requerido)
const ExistingCustomerSchema = BaseCustomerSchema.extend({
  isExistingCustomer: z.literal(true),
});

// Esquema condicional basado en si es cliente existente o no
const CartFormSchema = z.discriminatedUnion("isExistingCustomer", [
  NewCustomerSchema,
  ExistingCustomerSchema,
]);

const CartForm: React.FC<CartFormProps> = ({
  storeId,
  onLoadingChange,
  tenant,
}) => {
  const { items, removeAll } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);

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
      isExistingCustomer: false,
    },
  });

  // Cuando cambia isExistingCustomer, actualizamos el formulario
  useEffect(() => {
    // Actualizar el valor en el formulario
    form.setValue("isExistingCustomer", isExistingCustomer);

    // Si es cliente existente, limpiar los campos que no son necesarios
    if (isExistingCustomer) {
      form.setValue("name", "");
      form.setValue("lastName", "");
      form.setValue("tel", 0);
      form.setValue("city", "");
      form.setValue("direction1", "");
      form.setValue("direction2", "");
      form.setValue("ruc", "");
      form.setValue("rucName", "");
    }
  }, [isExistingCustomer, form]);

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
        router.push(`/${tenant}/cart/${order.id}/confirmation`);
      } else {
        const errorData = await res.json();
        setLoading(false);
        onLoadingChange(false);
        toast.error(errorData.error || "Error al enviar el pedido");

        // Si el cliente no existe, desactivar la opción de cliente existente
        if (res.status === 404 && data.isExistingCustomer) {
          setIsExistingCustomer(false);
          form.setValue("isExistingCustomer", false);
        }
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
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={form.handleSubmit(onSubmitOrder)}
      >
        <div className="flex items-center gap-x-2 col-span-1 md:col-span-2">
          <Checkbox
            id="isExistingCustomer"
            checked={isExistingCustomer}
            onCheckedChange={(checked) => {
              setIsExistingCustomer(checked as boolean);
            }}
          />
          <div className="flex flex-col items-start justify-center">
            <FormLabel htmlFor="isExistingCustomer" className="cursor-pointer">
              Ya he comprado anteriormente en esta tienda
            </FormLabel>
            <FormDescription>
              Solo necesitarás ingresar tu email
            </FormDescription>
          </div>
        </div>
        {!isExistingCustomer && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nombre <Obligatory />
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-background"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!isExistingCustomer && (
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Apellido <Obligatory />
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-background"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!isExistingCustomer && (
          <FormField
            control={form.control}
            name="ruc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUC (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-background"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!isExistingCustomer && (
          <FormField
            control={form.control}
            name="rucName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón Social (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-background"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!isExistingCustomer && (
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
                    className="bg-white dark:bg-background"
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
        )}
        {!isExistingCustomer && (
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ciudad <Obligatory />
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-background"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!isExistingCustomer && (
          <FormField
            control={form.control}
            name="direction1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Dirección 1 <Obligatory />
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-background"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!isExistingCustomer && (
          <FormField
            control={form.control}
            name="direction2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección 2 (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-background"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem
              className={isExistingCustomer ? "col-span-1 md:col-span-2" : ""}
            >
              <FormLabel>
                Email <Obligatory />
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-white dark:bg-background"
                  type="email"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {isExistingCustomer && (
                <FormDescription>
                  Ingresa el email que usaste en compras anteriores para
                  recuperar tus datos
                </FormDescription>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CartForm;
