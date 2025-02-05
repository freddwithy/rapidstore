"use client";
import { DataTable } from "@/components/data-table";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color, Customer, Prisma, Variant } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { columns } from "./columns";
import useItem from "@/hooks/use-item";

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

type ProductWithVariants = Prisma.ProductsGetPayload<{
  include: {
    variants: true;
    colors: true;
  };
}>;

interface OrderFormProps {
  products: ProductWithVariants[];
  variants: Variant[];
  colors: Color[];
  customers: Customer[];
  storeId: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  customers,
  storeId,
  products,
  variants,
  colors,
}) => {
  const { addItems, removeAll, items } = useItem();

  const form = useForm<z.infer<typeof OrderFormSchema>>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      customer: "",
      status: "",
      paymentStatus: "",
    },
  });

  const searchFilters = [
    {
      title: "Producto",
      filter: "name",
    },
    {
      title: "Variante",
      filter: "variant",
    },
    {
      title: "Color",
      filter: "color",
    },
  ];

  const customer = customers?.find(
    (customer) => customer.id === form.watch("customer")
  );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <Combobox
                    field={field}
                    placeholder="Busca un cliente"
                    items={customers.map((item) => {
                      return {
                        id: item.id,
                        name: item.rucName,
                      };
                    })}
                  />
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
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <Input readOnly value={customer?.name || ""} />
          </FormItem>
          <FormItem>
            <FormLabel>Apellido</FormLabel>
            <Input readOnly value={customer?.lastName || ""} />
          </FormItem>
          <FormItem>
            <FormLabel>Telefono</FormLabel>
            <Input readOnly value={customer?.tel || ""} />
          </FormItem>
          <FormItem>
            <FormLabel>Correo</FormLabel>
            <Input readOnly value={customer?.email || ""} />
          </FormItem>
          <FormItem>
            <FormLabel>RUC</FormLabel>
            <Input readOnly value={customer?.ruc || ""} />
          </FormItem>
          <FormItem>
            <FormLabel>Ciudad</FormLabel>
            <Input readOnly value={customer?.city || ""} />
          </FormItem>
        </div>
        <Separator />
        <div>
          <DataTable
            filterOptions={searchFilters}
            columns={columns}
            data={formattedOrderProducts}
          />
        </div>
      </form>
    </Form>
  );
};

export default OrderForm;
