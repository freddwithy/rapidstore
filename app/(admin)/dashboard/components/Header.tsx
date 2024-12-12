import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = ({}) => {
  return (
    <div className="p-4 flex items-center justify-between border-b">
      <SidebarTrigger />
      <div></div>
    </div>
  );
};

export default Header;
