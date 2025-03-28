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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {} from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Regex for password validation
const passwordValidation =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

// Regex for username validation (alphanumeric, underscores, no spaces)
const usernameValidation = /^[a-zA-Z0-9_]+$/;

// Regex for email validation
const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const formSchema = z
  .object({
    username: z
      .string()
      .min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres",
      })
      .max(20, {
        message: "El nombre de usuario no puede tener más de 20 caracteres",
      })
      .regex(usernameValidation, {
        message:
          "El nombre de usuario solo puede contener letras, números y guiones bajos",
      }),
    email: z
      .string()
      .min(1, {
        message: "El correo electrónico es requerido",
      })
      .regex(emailValidation, {
        message: "Por favor ingrese un correo electrónico válido",
      }),
    password: z
      .string()
      .min(8, {
        message: "La contraseña debe tener al menos 8 caracteres",
      })
      .max(50, {
        message: "La contraseña no puede tener más de 50 caracteres",
      })
      .regex(passwordValidation, {
        message:
          "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial",
      }),
    confirmPassword: z.string().min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const verifyCodeSchema = z.object({
  code: z.string().min(6, {
    message: "El Código es requerido",
  }),
});

const Page = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [verification, setVerification] = useState({
    state: "default",
    code: "",
    error: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const formVerify = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSignUp = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      await signUp.create({
        emailAddress: form.getValues("email"),
        password: form.getValues("password"),
        username: form.getValues("username"),
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerification({
        ...verification,
        state: "pending",
      });

      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
      toast.error("Error al crear la cuenta", err.errors[0].message);
    }
  };

  const onVerify = async () => {
    if (!isLoaded) return;
    try {
      setLoadingVerify(true);
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: formVerify.getValues("code"),
      });

      if (completeSignUp.status === "complete") {
        await fetch("/api/user", {
          method: "POST",
          body: JSON.stringify({
            username: form.getValues("username"),
            email: form.getValues("email"),
            clerkId: completeSignUp.createdUserId,
          }),
        });

        await setActive({
          session: completeSignUp.createdSessionId,
        });
        setVerification({
          ...verification,
          state: "success",
        });

        setLoadingVerify(false);
        setShowSuccessModal(true);
      } else {
        setLoadingVerify(false);
        setVerification({
          ...verification,
          state: "error",
          error: "El código es incorrecto",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoadingVerify(false);
      setVerification({
        ...verification,
        state: "error",
        error: err.errors[0].longMessage,
      });
    }
  };

  return (
    <section className="flex items-center justify-center h-dvh">
      <Card className="md:w-[400px] lg:w-[500px]">
        <CardHeader>
          <CardTitle>Create una cuenta</CardTitle>
          <CardDescription>
            Primero create una cuenta para poder empezar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSignUp)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirma tu Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full gap-2">
                {loading && <LoaderCircle className="size-5 animate-spin" />}
                Crear cuenta
              </Button>
            </form>
          </Form>
          <Dialog modal open={verification.state === "pending"}>
            <DialogContent className="w-3/4">
              <DialogHeader className="text-start">
                <DialogTitle>Verifica tu correo</DialogTitle>
                <DialogDescription>
                  Por favor, confirma tu correo para poder iniciar sesión.
                </DialogDescription>
              </DialogHeader>
              <Form {...formVerify}>
                <form
                  onSubmit={form.handleSubmit(onVerify)}
                  className="space-y-4"
                >
                  <FormField
                    control={formVerify.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de verificación</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup className="w-full">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full gap-2">
                    {loadingVerify && (
                      <LoaderCircle className="size-5 animate-spin" />
                    )}
                    Verificar
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog
            open={showSuccessModal}
            onOpenChange={() => router.push("/dashboard")}
          >
            <DialogContent className="w-3/4">
              <DialogHeader className="flex items-center justify-center space-y-4">
                <CheckCircle className="size-12 text-green-500" />
                <DialogTitle>Verificación exitosa</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <p className="text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/sign-in"
              className="text-muted-foreground hover:underline"
            >
              Inicia sesión
            </a>{" "}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
