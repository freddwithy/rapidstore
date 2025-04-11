import { ModeToggle } from "@/components/mode-toggle";

import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = ({}) => {
  return (
    <div className="p-4 flex items-center bg-background justify-between border-b">
      <div className="flex items-center gap-x-2">
        <SidebarTrigger />
      </div>
      <ModeToggle />
    </div>
  );
};

export default Header;
