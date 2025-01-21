"use client";
import Combobox from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer, Products } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const OrderFormSchema = z.object({
  customer: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  status: z.string().min(1, {
    message: "El estado es requerido",
  }),
  paymentStatus: z.string().min(1, {
    message: "El estado de pago es requerido",
  }),
  product: z.string().min(1, {
    message: "Los productos son requeridos",
  }),
});

interface OrderFormProps {
  products: Products[];
  customers: Customer[];
  storeId: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  customers,
  storeId,
  products,
}) => {
  const form = useForm<z.infer<typeof OrderFormSchema>>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      customer: "",
      status: "",
      paymentStatus: "",
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {customers?.map((customer) => (
                          <Combobox
                            key={customer.id}
                            field={field}
                            items={
                              customers.map((item) => {
                                return {
                                  name: item.rucName,
                                  id: item.id,
                                };
                              }) || []
                            }
                            placeholder="Seleccione un cliente"
                          />
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    ¿No ve el cliente?{" "}
                    <Link
                      className="text-primary font-semibold hover:underline"
                      href={`/manage/${storeId}/customers/new`}
                    >
                      Crea uno
                    </Link>
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Productos</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map((product) => (
                          <Combobox
                            key={product.id}
                            field={field}
                            items={
                              products.map((item) => {
                                return {
                                  name: item.name,
                                  id: item.id,
                                };
                              }) || []
                            }
                            placeholder="Seleccione un producto"
                          />
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    ¿No ve el producto?{" "}
                    <Link
                      className="text-primary font-semibold hover:underline"
                      href={`/manage/${storeId}/products/new`}
                    >
                      Crea uno
                    </Link>
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="ENTREGADO">Completado</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de pago</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PAGADO">Pendiente</SelectItem>
                        <SelectItem value="PAGO_PARCIAL">Completado</SelectItem>
                        <SelectItem value="PENDIENTE">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default OrderForm;
