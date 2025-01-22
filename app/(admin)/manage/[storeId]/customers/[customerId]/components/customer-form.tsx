"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
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
  tel: z.string().min(1, {
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
}

const CustomerForm: React.FC<CustomerFormProps> = ({}) => {
  const form = useForm<z.infer<typeof CustomerFormSchema>>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: {
      name: "",
      lastName: "",
      ruc: "",
      rucName: "",
      tel: "",
      city: "",
      direction1: "",
      direction2: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
