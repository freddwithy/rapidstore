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
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ColorFormSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  value: z.string().min(1, {
    message: "El color es requerido",
  }),
});

interface ColorFormProps {
  storeId: string;
  initialData: Color | null;
}

const ColorForm: React.FC<ColorFormProps> = ({ storeId, initialData }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ColorFormSchema>>({
    resolver: zodResolver(ColorFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      value: initialData?.value || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ColorFormSchema>) => {
    if (!initialData) {
      try {
        setLoading(true);
        const res = await fetch(`/api/color`, {
          method: "POST",
          body: JSON.stringify({
            ...data,
            storeId,
          }),
        });

        if (!res.ok) {
          setLoading(false);
          toast.error("Error al crear el color");
          return;
        } else {
          toast.success("Color creado correctamente");
          setLoading(false);
          router.push(`/manage/${storeId}/colors`);
          return res;
        }
      } catch {
        setLoading(false);
        toast.error("Error al crear el color");
        return;
      }
    } else {
      try {
        setLoading(true);
        const res = await fetch(`/api/color/${initialData.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            ...data,
            storeId,
          }),
        });

        if (!res.ok) {
          setLoading(false);
          toast.error("Error al actualizar el color");
          return;
        } else {
          toast.success("Color actualizado correctamente");
          setLoading(false);
          router.push(`/manage/${storeId}/colors`);
          return res;
        }
      } catch {
        setLoading(false);
        toast.error("Error al actualizar el color");
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
                  <FormDescription>El nombre del color</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input
                        className="p-0 border-none rounded-lg size-9"
                        type="color"
                        {...field}
                      />
                      <p>{field.value}</p>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>El color del producto</FormDescription>
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

export default ColorForm;
