"use client";
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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useClerk } from "@clerk/nextjs";
import { Store } from "@prisma/client";
import {
  Archive,
  Boxes,
  ChevronsUpDown,
  ClipboardCheck,
  Cog,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  Palette,
  Plus,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AppSidebarpProps {
  store: Store | undefined | null;
  stores: Store[];
  userType: string | null | undefined;
  username: string | undefined;
  profileImage: string | undefined;
}
const AppSidebar: React.FC<AppSidebarpProps> = ({
  userType,
  store,
  stores,
  username,
  profileImage,
}) => {
  const { isMobile } = useSidebar();
  const clerk = useClerk();
  const router = useRouter();

  const items = [
    {
      title: "Tablero",
      url: `/manage/${store?.id}`,
      icon: LayoutDashboard,
    },
    {
      title: "Pedidos",
      url: `/manage/${store?.id}/orders`,
      icon: ClipboardCheck,
    },
    {
      title: "Clientes",
      url: `/manage/${store?.id}/customers`,
      icon: User,
    },
  ];

  const products = {
    title: "Inventario",
    icon: Archive,
    items: [
      {
        title: "Productos",
        url: `/manage/${store?.id}/products`,
        icon: Package,
      },
      {
        title: "Categorías",
        url: `/manage/${store?.id}/categories`,
        icon: Layers,
      },
      {
        title: "Colores",
        url: `/manage/${store?.id}/colors`,
        icon: Palette,
      },
      {
        title: "Variantes",
        url: `/manage/${store?.id}/variants`,
        icon: Boxes,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage
                        src={store?.logo || ""}
                        alt={store?.name}
                        className="object-center object-cover"
                      />
                      <AvatarFallback className="text-sm rounded-lg">
                        {store?.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {store?.name}
                    </span>
                    <span className="truncate text-xs">
                      {store?.description}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Tus tiendas
                </DropdownMenuLabel>
                {stores.map((store, index) => (
                  <DropdownMenuItem
                    key={store.name}
                    onClick={() => router.replace(`/manage/${store.id}`)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <Avatar className="size-6 rounded-lg">
                        <AvatarImage
                          src={store?.logo || ""}
                          alt={store?.name}
                          className="object-center object-cover"
                        />
                        <AvatarFallback className="text-sm rounded-lg">
                          {store?.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {store.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/admin/create-store")}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Añadir tienda
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tu tienda</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="text-primary" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {products.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="text-primary" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {profileImage ? (
                      <Avatar className="rounded-lg size-8">
                        <AvatarImage src={profileImage} alt={username} />
                        <AvatarFallback className="rounded-lg">
                          {username?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="size-4 shrink-0" />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{username}</span>
                    <span className="truncate text-xs">{userType}</span>
                  </div>
                  <Settings className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={profileImage} alt={username} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{username}</span>
                      <span className="truncate text-xs">{"Admin"}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push(`/admin/upgrade`)}
                  >
                    <Sparkles />
                    Actualizar a Plan Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
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
                        <AlertDialogAction onClick={() => clerk.signOut()}>
                          Continuar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/manage/${store?.id}/settings`)}
                >
                  <Cog />
                  Configuración
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
