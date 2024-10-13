"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {} from "next/router";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().min(1, {
    message: "El correo es requerido",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
});

const Page = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignIn = useCallback(async () => {
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: form.getValues("email"),
        password: form.getValues("password"),
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
        });
        router.push("/dashboard");
        toast.success("Sesión iniciada");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.errors[0].code === "form_password_incorrect") {
        toast.error("Contraseña incorrecta");
      }
      if (err.errors[0].code === "form_identifier_not_found") {
        toast.error("Usuario no encontrado");
      }

      if (err.errors[0].code === "form_too_many_attempts") {
        toast.error("Demasiados intentos fallidos");
      }

      if (err.errors[0].code === "session_exists") {
        toast.error("La sesión ya existe");
      }
    }
  }, [form, isLoaded, router, signIn, setActive]);

  return (
    <section className="flex items-center justify-center h-dvh ">
      <Card className="w-3/4 md:w-[600px]">
        <CardHeader>
          <CardTitle>Inicia sesión</CardTitle>
          <CardDescription>Inicia sesión con tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSignIn)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electronico</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="w-full">Entrar</Button>
            </form>
          </Form>
          <p className="text-center text-sm">
            ¿Aún no tienes una cuenta?{" "}
            <a href="/sign-up" className="text-yellow-800 font-semibold">
              Regístrate
            </a>{" "}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
