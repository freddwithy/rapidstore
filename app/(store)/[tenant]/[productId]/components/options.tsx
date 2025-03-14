import { Product } from "@prisma/client";
import React from "react";

interface OptionsProps {
  product: Product;
}

const Options: React.FC<OptionsProps> = ({ product }) => {
  return <div>{product.name}</div>;
};

export default Options;
