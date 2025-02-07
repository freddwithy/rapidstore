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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer, Prisma } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useItem from "@/hooks/use-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatter } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Plus, Trash } from "lucide-react";

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
  productId: z.string().min(1, {
    message: "Los productos son requeridos",
  }),
  variantId: z.string().min(1, {
    message: "La variante es requerida",
  }),
  qty: z.coerce.number().min(1, {
    message: "La cantidad es requerida",
  }),
  total: z.coerce.number().min(1, {
    message: "El total es requerido",
  }),
});

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        color: true;
        variant: true;
      };
    };
    images: true;
  };
}>;

interface OrderFormProps {
  products: ProductWithVariants[];
  customers: Customer[];
  storeId: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  customers,
  storeId,
  products,
}) => {
  const { addItem, removeAll, items } = useItem();

  const form = useForm<z.infer<typeof OrderFormSchema>>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      customer: "",
      status: "",
      paymentStatus: "",
    },
  });

  console.log(items);

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

  const productSelected = products?.find(
    (product) => product.id === form.watch("productId")
  );

  const variantSelected = productSelected?.variants.find(
    (variant) => variant.id === form.watch("variantId")
  );

  const totalItem = (variantSelected?.price ?? 0) * (form.watch("qty") ?? 0);

  const onAddProducts = () => {
    addItem({
      productId: form.getValues("productId"),
      variantId: form.getValues("variantId"),
      quantity: form.getValues("qty"),
      total: totalItem,
    });
    toast.success("Producto agregado al carrito");
  };

  const onRemoveAll = () => {
    removeAll();
    toast.success("Productos eliminados del carrito");
  };

  const formattedItems = items.map((item) => {
    const product = products.find((product) => product.id === item.productId);
    const variant = product?.variants.find(
      (variant) => variant.id === item.variantId
    );
    return {
      product: product?.name || "",
      color: variant?.color.name || "",
      variant: variant?.variant.name || "",
      quantity: item.quantity,
      total: item.total,
    };
  });
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
        <div className="flex justify-end gap-x-2">
          <Button variant="destructive" type="button" onClick={onRemoveAll}>
            <Trash className="size-4" />
            Eliminar todo
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button type="button" variant="secondary">
                <Plus className="size-4" />
                Agregar productos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar productos al pedido</DialogTitle>
                <DialogDescription>
                  Busca un producto y agrega al pedido
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Producto</FormLabel>
                      <FormControl>
                        <Combobox
                          field={field}
                          placeholder="Busca un producto"
                          items={products.map((item) => {
                            return {
                              id: item.id,
                              name: item.name,
                            };
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="variantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variante</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona variante" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productSelected?.variants.map((variant) => (
                            <SelectItem key={variant.id} value={variant.id}>
                              {variant.variant.name} - {variant.color.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <Input
                    readOnly
                    value={formatter.format(variantSelected?.price ?? 0)}
                  />
                </FormItem>
                <FormField
                  control={form.control}
                  name="qty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Total</FormLabel>
                  <Input readOnly value={formatter.format(totalItem)} />
                </FormItem>
              </div>
              <DialogFooter>
                <Button type="button" onClick={onAddProducts}>
                  Agregar
                  <span className="sr-only">Agregar producto</span>
                </Button>
                <DialogClose>
                  <Button type="button" variant="secondary">
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns}
          data={formattedItems}
          filterOptions={searchFilters}
        />
      </form>
    </Form>
  );
};

export default OrderForm;
