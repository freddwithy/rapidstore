import Image from "next/image";

interface HeaderProps {
  username: string | undefined | null;
  profileImageUrl: string | undefined | null;
}
const Header: React.FC<HeaderProps> = ({ username, profileImageUrl }) => {
  return (
    <div className="p-4">
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
          <p className="text-2xl text-primary font-semibold">{username}</p>
        </h2>
      </div>
    </div>
  );
};

export default Header;
