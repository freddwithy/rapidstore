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
import { Variant } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const VariantFormSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  description: z.string().min(1, {
    message: "La descripción es requerida",
  }),
});

interface VariantFormProps {
  storeId: string;
  initialData: Variant | null;
}

const VariantForm: React.FC<VariantFormProps> = ({ storeId, initialData }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof VariantFormSchema>>({
    resolver: zodResolver(VariantFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof VariantFormSchema>) => {
    if (!initialData) {
      try {
        setLoading(true);
        const res = await fetch(`/api/variant`, {
          method: "POST",
          body: JSON.stringify({
            ...data,
            storeId,
          }),
        });

        if (res.ok) {
          setLoading(false);
          toast.success("Variante creada correctamente");
          router.push(`/manage/${storeId}/variants`);
        }
      } catch {
        setLoading(false);
        toast.error("Error al crear el variante");
        return;
      }
    } else {
      try {
        setLoading(true);
        const res = await fetch(`/api/variant/${initialData.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            ...data,
            storeId,
          }),
        });

        if (res.ok) {
          setLoading(false);
          toast.success("Variante actualizada correctamente");

          router.push(`/manage/${storeId}/variants`);
        }
      } catch {
        setLoading(false);
        toast.error("Error al actualizar la variante");
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
                  <FormDescription>El nombre de la variante</FormDescription>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    La descripción de la variante
                  </FormDescription>
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

export default VariantForm;
