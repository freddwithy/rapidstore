"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ProfileFormProps {
  userDb: User | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
});

const ProfileForm: React.FC<ProfileFormProps> = ({ userDb }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userDb?.username || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await fetch(`/api/user/${userDb?.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configura tu cuenta</CardTitle>
        <CardDescription>
          Desde aquí podrás gestionar tu cuenta de usuario y tu perfil.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Correo Electronico</FormLabel>
              <Input disabled value={userDb?.email} />
            </FormItem>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button>
          {loading && <LoaderCircle className="animate-spin size-4" />}
          Guardar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
