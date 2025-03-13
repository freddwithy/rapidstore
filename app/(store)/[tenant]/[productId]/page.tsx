import React from "react";

const ProductPage = ({ params }: { params: { productId: string } }) => {
  const { productId } = params;
  return <div>Producto: {productId}</div>;
};

export default ProductPage;
