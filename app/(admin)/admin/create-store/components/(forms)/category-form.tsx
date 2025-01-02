"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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

interface CategoryFormProps {
  ownerId: string | undefined;
  onClose?: () => void;
}

const CategoryFormScheme = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  description: z.string().min(1, {
    message: "La descripción es requerida",
  }),
});

const CategoryForm: React.FC<CategoryFormProps> = ({ ownerId, onClose }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof CategoryFormScheme>>({
    resolver: zodResolver(CategoryFormScheme),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const router = useRouter();

  console.log(form.getValues());
  const createCategory = async (data: z.infer<typeof CategoryFormScheme>) => {
    try {
      setLoading(true);
      const response = await fetch("/api/category", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          ownerId,
        }),
      });

      if (!response.ok) {
        toast.error("Error al crear la categoría");
        return;
      }

      toast.success("Categoría creada correctamente");
      setLoading(false);
      onClose?.();
      router.refresh();
      return response;
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error al crear la categoría");
    }
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(createCategory)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
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
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
            Guardar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
