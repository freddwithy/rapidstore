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
import React, { useEffect, useState } from "react";
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
import { LoaderCircle, Plus, Trash } from "lucide-react";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const OrderFormSchema = z.object({
  customerId: z.string().min(1, {
    message: "El cliente es requerido",
  }),
  status: z.string().min(1, {
    message: "El estado es requerido",
  }),
  paymentStatus: z.string().min(1, {
    message: "El estado de pago es requerido",
  }),
  productId: z.string().min(1, {
    message: "El producto es requerido",
  }),
  optionId: z.string().min(1, {
    message: "La variante es requerida",
  }),
  qty: z.coerce
    .number()
    .min(1, {
      message: "La cantidad es requerida",
    })
    .max(100, {
      message: "La cantidad no puede ser mayor a 100",
    }),
  total: z.coerce
    .number()
    .min(1, {
      message: "El total es requerido",
    })
    .max(100000000, {
      message: "El total no puede ser mayor a Gs. 100.000.000",
    }),
});

type VariantProductWithOptions = Prisma.VariantGetPayload<{
  include: {
    options: true;
  };
}>;

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        options: true;
      };
    };
    images: true;
  };
}>;

type orderWithProducts = Prisma.OrderGetPayload<{
  include: {
    products: {
      include: {
        variant: {
          include: {
            options: true;
          };
        };
      };
    };
  };
}>;

interface OrderFormProps {
  products: ProductWithVariants[];
  customers: Customer[];
  initialData: orderWithProducts | null;
  storeId: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  customers,
  storeId,
  products,
  initialData,
}) => {
  const { addItem, removeAll, items, addItems } = useItem();
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof OrderFormSchema>>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      customerId: initialData?.customerId || "",
      status: initialData?.status || "PENDIENTE",
      paymentStatus: initialData?.paymentStatus || "PENDIENTE",
      productId: initialData?.products[0].variant.productId || "Sin productId",
      optionId:
        initialData?.products[0].variant.options[0].id || "Sin optionId",
      qty: initialData?.products[0].qty || 1,
      total: initialData?.total || 1,
    },
  });

  useEffect(() => {
    if (initialData) {
      removeAll();
      addItems(
        initialData.products.map((item) => {
          return {
            productId: item.variant.productId,
            optionId: item.variant.options[0].id,
            quantity: item.qty,
            total: item.total,
          };
        })
      );
    } else {
      removeAll();
    }
  }, [initialData, addItems, removeAll]);

  const searchFilters = [
    {
      title: "Producto",
      filter: "product",
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
    (customer) => customer.id === form.watch("customerId")
  );

  const productSelected = products?.find(
    (product) => product.id === form.watch("productId")
  );

  const variantSelected = productSelected?.variants.find(
    (variant) => variant.id === form.watch("optionId")
  );

  const totalItem =
    (variantSelected?.options[0].price ?? 0) * (form.watch("qty") ?? 0);

  const total = items.reduce((acc, item) => acc + item.total, 0);

  const onAddProducts = () => {
    addItem({
      productId: form.getValues("productId"),
      optionId: form.getValues("optionId"),
      quantity: form.getValues("qty"),
      total: totalItem,
    });
    toast.success("Producto agregado al carrito");
  };

  const onRemoveAll = () => {
    removeAll();
    toast.success("Productos eliminados del carrito");
  };

  const onSubmit = async (data: z.infer<typeof OrderFormSchema>) => {
    if (!initialData) {
      try {
        setLoading(true);
        const res = await fetch(`/api/order`, {
          method: "POST",
          body: JSON.stringify({
            ...data,
            orderProducts: items,
            total,
            storeId,
          }),
        });

        if (res.ok) {
          setLoading(false);
          removeAll();
          toast.success("Pedido creado correctamente");
          router.push(`/manage/${storeId}/orders`);
          router.refresh();
        }
      } catch {
        setLoading(false);
        toast.error("Error al crear el pedido");
        return;
      }
    } else {
      try {
        setLoading(true);
        const res = await fetch(`/api/order/${initialData.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            ...data,
            orderProducts: items,
            total,
            storeId,
          }),
        });
        if (res.ok) {
          setLoading(false);
          removeAll();
          toast.success("Pedido actualizado correctamente");
          router.push(`/manage/${storeId}/orders`);
          router.refresh();
        }
      } catch {
        setLoading(false);
        toast.error("Error al actualizar el pedido");
        return;
      }
    }
  };

  const formattedItems = items.map((item) => {
    const product = products.find((product) => product.id === item.productId);
    return {
      variant: item.optionId,
      product: product?.name || "",
      quantity: item.quantity,
      total: item.total,
    };
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerId"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
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
                  name="optionId"
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
                          {productSelected?.variants.map(
                            (variant: VariantProductWithOptions) => (
                              <SelectItem key={variant.id} value={variant.id}>
                                {variant.name ? variant.name : ""}
                              </SelectItem>
                            )
                          )}
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
                    value={formatter.format(
                      variantSelected?.options[0].price ?? 0
                    )}
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
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onRemoveAll}
          />

          <Button
            disabled={!items.length}
            variant="secondary"
            type="button"
            onClick={() => setOpen(true)}
          >
            <Trash className="size-4" />
            Eliminar todo
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={formattedItems}
          filterOptions={searchFilters}
        />
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {formatter.format(total)}
              </CardTitle>
              <CardDescription>Total en guaraníes</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado del pago</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una opcion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="PAGADO">Pagado</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                <FormDescription>El estado del pago del pedido</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado del pedido</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una opcion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="ENTREGADO">Entregado</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                <FormDescription>El estado del pedido</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          {initialData ? "Actualizar pedido" : "Crear pedido"}
        </Button>
      </form>
    </Form>
  );
};

export default OrderForm;
