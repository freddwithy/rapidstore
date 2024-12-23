"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BadgeCheck, LogOut, Sparkles } from "lucide-react";
import { User } from "@prisma/client";
import AlertCustomDialog from "./alert-dialog";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface UserMenuProps {
  userDb: User | null;
  imageUrl: string | undefined;
}

const UserMenu: React.FC<UserMenuProps> = ({ userDb, imageUrl }) => {
  const [open, setOpen] = useState(false);
  const clerk = useClerk();
  const router = useRouter();

  const onSignOut = () => {
    setOpen(false);
    clerk.signOut();
    router.refresh();
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <Avatar className="rounded-lg size-11">
              <AvatarImage src={imageUrl} alt={userDb?.username} />
              <AvatarFallback className="rounded-lg">
                <p className="uppercase font-semibold">
                  {userDb?.username?.slice(0, 2)}
                </p>
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="mt-2">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="group"
              onClick={() => router.push("/dashboard/upgrade")}
            >
              <Sparkles className="group-hover:text-yellow-500 transition-colors group-hover:animate-pulse" />
              Actualizar a Plan Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck />
              Cuenta
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex gap-x-1.5 items-center cursor-default px-2.5 rounded-sm py-1.5 hover:bg-accent text-sm">
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cerrar sesión</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro que deseas cerrar sesión?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction>Continuar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertCustomDialog
        onClose={() => setOpen(!open)}
        open={open}
        action={() => onSignOut()}
        title="Cerrar Sesión"
        description="¿Estás seguro que deseas cerrar sesión?"
      />
    </>
  );
};

export default UserMenu;
