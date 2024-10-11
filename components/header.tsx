import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="bg-white w-full rounded-b-3xl shadow-md">
      <div className="flex flex-col items-center justify-center py-40 gap-y-2">
        <div className="overflow-hidden rounded-full">
          <Image
            src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
            width={100}
            height={100}
            alt="logo"
          />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-stone-900">RapidStore</h1>
          <div>
            <p>Tu descripción de la tienda va aqui.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
