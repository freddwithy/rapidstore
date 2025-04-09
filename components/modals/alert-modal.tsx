"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Montar/desmontar el componente
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Esta función se llama cuando el diálogo cambia de estado (abierto/cerrado)
  const handleOpenChange = (open: boolean) => {
    if (!open && !loading) {
      onClose();
    }
  };

  // Esta función se llama cuando el usuario hace clic en el botón Cancelar
  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  // Esta función se llama cuando el usuario hace clic en el botón Continuar
  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title || "¿Estás seguro de querer eliminar?"}
          </DialogTitle>
          <DialogDescription>
            {description ||
              "Esta acción no se puede deshacer, piensa bien antes de tomar una decisión."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full justify-end space-x-2">
            <Button 
              disabled={loading} 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              disabled={loading}
              variant="destructive"
              onClick={handleConfirm}
            >
              Continuar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
