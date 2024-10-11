import Header from "@/components/header";
import React from "react";

const Page = ({ params }: { params: { storeId: string } }) => {
  return (
    <div className="h-dvh w-full bg-stone-200">
      <Header
        storeName={params.storeId}
        storeDescription="Tienda de mascotas"
        storeLogo="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
      />
    </div>
  );
};

export default Page;
