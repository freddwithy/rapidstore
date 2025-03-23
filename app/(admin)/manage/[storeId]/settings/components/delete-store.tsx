"use client";
import AlertCustomDialog from "@/components/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface DeleteStoreProps {
  storeId: string;
}

const DeleteStore: React.FC<DeleteStoreProps> = ({ storeId }) => {
  const [open, setOpen] = useState(false);
  const [isDeletingStore, setIsDeletingStore] = useState(false);

  const router = useRouter();

  const onDeleteStore = async () => {
    try {
      setIsDeletingStore(true);
      const response = await fetch(`/api/store/${storeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Error al eliminar la tienda");
        return;
      }

      toast.success("Tienda eliminada correctamente");
      setIsDeletingStore(false);
      router.push(`/admin`);
      return response;
    } catch (error) {
      setIsDeletingStore(false);
      console.log(error);
      toast.error("Error al eliminar la tienda");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eliminar tienda</CardTitle>
        <CardDescription>
          Ten cuidado al eliminar tu tienda.
          <br />
          Una vez eliminada, no podrás recuperar tus datos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Trash />
          Eliminar tienda
        </Button>
        <AlertCustomDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Eliminar tienda"
          description="¿Estás seguro de que quieres eliminar esta tienda?"
          action={onDeleteStore}
          loading={isDeletingStore}
        />
      </CardContent>
    </Card>
  );
};

export default DeleteStore;
