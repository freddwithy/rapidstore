import { Card } from "@/components/ui/card";
import Image from "next/image";

interface HeaderProps {
  username: string | undefined | null;
  profileImageUrl: string | undefined | null;
}
const Header: React.FC<HeaderProps> = ({ username, profileImageUrl }) => {
  return (
    <Card className="p-4 shadow-none">
      <div className="space-y-2">
        <div className="overflow-hidden rounded-full size-16">
          <Image
            src={profileImageUrl!}
            width={100}
            height={100}
            alt="user-image"
          />
        </div>
        <h2 className="text-medium tracking-tight text-stone-700">
          Bienvenido{" "}
          <p className="text-2xl text-yellow-900 font-semibold">{username}</p>
        </h2>
      </div>
    </Card>
  );
};

export default Header;
