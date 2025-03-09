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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {} from "next/router";
import React, { useCallback, useState } from "react";
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
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const signInAttempt = await signIn.create({
        identifier: form.getValues("email"),
        password: form.getValues("password"),
      });

      if (signInAttempt.status === "complete") {
        setLoading(false);
        await setActive({
          session: signInAttempt.createdSessionId,
        });
        router.push("/admin");
        toast.success("Sesión iniciada");
      } else {
        setLoading(false);
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
      if (err.errors[0].code === "form_password_incorrect") {
        form.setError("password", {
          message: "La contraseña es incorrecta",
        });
      }
      if (err.errors[0].code === "form_identifier_not_found") {
        form.setError("email", {
          message: "El correo no existe",
        });
      }

      if (err.errors[0].code === "form_too_many_attempts") {
        toast.error("Has superado el limite de intentos");
      }

      if (err.errors[0].code === "session_exists") {
        toast.error("La sesión ya existe");
      }
    }
  }, [form, isLoaded, router, signIn, setActive]);

  return (
    <section className="flex items-center justify-center h-dvh ">
      <Card className="md:w-[400px] lg:w-[400px]">
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
                    <FormMessage />
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
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full">
                {loading && <LoaderCircle className="animate-spin size-4" />}
                Entrar
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm">
            ¿Aún no tienes una cuenta?{" "}
            <a
              href="/sign-up"
              className="text-muted-foreground hover:underline"
            >
              Regístrate
            </a>{" "}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
