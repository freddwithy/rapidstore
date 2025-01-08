"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { AlertCircle, LoaderCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ProfileFormProps {
  userDb: User | null;
  imageUrl: string | undefined;
}

const formSchema = z.object({
  username: z.string().min(1, {
    message: "El nombre de usuario es requerido",
  }),
  profileURL: z.string().optional(),
});

const ProfileForm: React.FC<ProfileFormProps> = ({ userDb, imageUrl }) => {
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userDb?.username || "",
      profileURL: "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    if (target.files) {
      setLoadingImage(true);
      const file = target.files[0];
      const formData = new FormData();

      formData.append("file", file);
      formData.append("userId", userDb?.clerk_id || "");

      const allowedFormats = ["jpg", "jpeg", "png", "webp"];
      const extension = file.name.split(".").pop();
      if (!allowedFormats.includes(extension as string)) {
        setLoadingImage(false);
        toast.error("Formato de imagen no permitido");
        return;
      }

      const updateProfile = await fetch(`/api/upload-profile`, {
        method: "POST",
        body: formData,
      });

      if (updateProfile.ok) {
        setLoadingImage(false);
        setOpen(false);
        router.refresh();
        form.resetField("profileURL");
        toast.error("Imagen subida correctamente");
        return;
      } else {
        setLoadingImage(false);
        form.resetField("profileURL");
        toast.error("Error al subir la imagen");
        return;
      }
    } else {
      setLoadingImage(false);
      form.resetField("profileURL");
      toast.error("Error al seleccionar la imagen");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await fetch(`/api/user/${userDb?.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          username: values.username,
        }),
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error al guardar los cambios");
    } finally {
      setLoading(false);
      toast.success("Cambios guardados correctamente");
      router.refresh();
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
      <CardContent className="space-y-4">
        {userDb?.user_type === "FREE" && (
          <Alert className="bg-accent">
            <AlertCircle className="size-4" />
            <AlertTitle>Eres un usuario GRATUITO</AlertTitle>
            <AlertDescription>
              Si quieres más funciones, compra una suscripción{" "}
              <a
                className="hover:underline text-muted-foreground"
                href="/admin/upgrade"
              >
                aquí
              </a>
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form
            className="flex flex-col md:flex-row gap-14"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="md:w-92 flex flex-col items-center justify-center gap-y-4 mt-8">
              <Avatar className="size-32 md:size-40">
                <AvatarImage src={imageUrl} alt={userDb?.username} />
                <AvatarFallback className="text-xl font-semibold">
                  {userDb?.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="profileURL"
                render={({ field }) => (
                  <FormItem>
                    <FormControl onChange={handleFileChange}>
                      <div className="flex flex-col items-center relative">
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setOpen(true)}
                              type="button"
                            >
                              {loadingImage ? (
                                <LoaderCircle className="animate-spin size-4" />
                              ) : (
                                <Upload className="size-4" />
                              )}{" "}
                              Subir foto
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Subir foto de perfil</DialogTitle>
                              <DialogDescription>
                                Selecciona una imagen para tu perfil.
                              </DialogDescription>
                            </DialogHeader>
                            <Card className="p-4 flex flex-col items-center justify-center h-40 gap-y-1 relative">
                              {loadingImage ? (
                                <LoaderCircle className="animate-spin size-5" />
                              ) : (
                                <Upload className="size-5 text-muted-foreground" />
                              )}
                              <p className="text-sm text-muted-foreground">
                                {loadingImage
                                  ? "Cargando..."
                                  : "Arrastra o selecciona una imagen"}
                              </p>
                              <Input
                                className="opacity-0 absolute h-40 cursor-pointer"
                                type="file"
                                accept="image/*"
                                {...field}
                              />
                            </Card>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4 md:min-w-96">
              <FormField
                control={form.control}
                name="username"
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
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          {loading && <LoaderCircle className="animate-spin size-4" />}
          Guardar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
