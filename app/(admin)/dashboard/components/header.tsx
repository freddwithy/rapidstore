import { ModeToggle } from "@/components/mode-toggle";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import UserMenu from "@/components/user-menu";
import { User as ClerkUser } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

import { Badge, Sparkle } from "lucide-react";
import Link from "next/link";
import React from "react";

interface DashboardProps {
  user: ClerkUser | null;
  userDb: User | null;
}

const DashboardHeader: React.FC<DashboardProps> = ({ user, userDb }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dashboard/profile" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Perfil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dashboard/upgrade" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md dark:bg-sky-950 bg-sky-100 px-4 py-2 text-sm font-medium transition-colors dark:hover:bg-sky-900 hover:bg-sky-200 hover:text-accent-foreground focus:bg-sky-900 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 gap-x-2">
                    Actualizar cuenta
                    <Sparkle className="size-4" />
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col justify-center text-right">
            <h2 className="leading-none text-muted-foreground text-sm">
              Bienvenido
            </h2>
            <h2 className="text-lg font-semibold flex items-center gap-x-2">
              <Badge>{userDb?.user_type}</Badge>
              {userDb?.username}
            </h2>
          </div>
          <UserMenu imageUrl={user?.imageUrl} userDb={userDb} />
        </div>
        <ModeToggle />
      </div>
    </div>
  );
};

export default DashboardHeader;
