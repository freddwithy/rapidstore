import Image from "next/image";
import React from "react";

interface HeaderProps {
  storeName: string;
  storeDescription: string;
  storeLogo: string;
}

const Header: React.FC<HeaderProps> = ({
  storeName,
  storeDescription,
  storeLogo,
}) => {
  return (
    <div className="bg-white w-full rounded-b-3xl shadow-md">
      <div className="flex flex-col items-center justify-center py-20 gap-y-2">
        <div className="overflow-hidden rounded-full">
          {storeLogo ? (
            <Image src={storeLogo} width={100} height={100} alt="logo" />
          ) : (
            <Image
              src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
              width={100}
              height={100}
              alt="logo"
            />
          )}
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-stone-900">{storeName}</h1>
          <div>
            <p>{storeDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
