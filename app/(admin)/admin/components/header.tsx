import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
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
import { Rocket } from "lucide-react";
import Link from "next/link";
import React from "react";

interface DashboardProps {
  user: ClerkUser | null;
  userDb: User | null;
}

const DashboardHeader: React.FC<DashboardProps> = ({ user, userDb }) => {
  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center gap-4">
        <div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/admin" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Inicio
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/admin/profile" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Perfil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/admin/upgrade" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} dark:bg-blue-900 dark:hover:bg-blue-800 bg-blue-500 hover:bg-blue-400 text-white hover:text-white`}
                  >
                    MEJORAR PLAN <Rocket className="size-4 ml-1" />
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <div className="items-center gap-2 md:flex hidden">
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
