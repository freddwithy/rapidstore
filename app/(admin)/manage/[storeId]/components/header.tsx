import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Slash } from "lucide-react";

const Header = ({}) => {
  return (
    <div className="p-4 flex items-center justify-between border-b">
      <div className="flex items-center gap-x-2">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ModeToggle />
    </div>
  );
};

export default Header;
