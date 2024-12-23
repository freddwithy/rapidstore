"use client";
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
import { Store } from "@prisma/client";
import {
  Archive,
  AudioWaveform,
  BadgeCheck,
  Bell,
  Boxes,
  ChevronsUpDown,
  ClipboardCheck,
  CreditCard,
  Layers,
  LayoutDashboard,
  List,
  LogOut,
  Package,
  Palette,
  Plus,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const items = [
  {
    title: "Tablero",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pedidos",
    url: "/orders",
    icon: ClipboardCheck,
  },
];

const products = {
  title: "Inventario",
  icon: Archive,
  items: [
    {
      title: "Productos",
      url: "products",
      icon: Package,
    },
    {
      title: "Colores",
      url: "/colors",
      icon: Palette,
    },
    {
      title: "Variantes",
      url: "/variants",
      icon: Boxes,
    },
    {
      title: "Categorías",
      url: "/categories",
      icon: Layers,
    },
  ],
};

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
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <AudioWaveform className="size-4 shrink-0" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {store?.name}
                    </span>
                    <span className="truncate text-xs">{userType}</span>
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
                    onClick={() => redirect(`/dashboard/${store.id}`)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <AudioWaveform className="size-4" />
                    </div>
                    {store.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => redirect("/create-store")}
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
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {products.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
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
                  <DropdownMenuItem>
                    <Sparkles />
                    Actualizar a Plan Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Cuenta
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Facturación
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notificaciones
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Cerrar sesión
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
