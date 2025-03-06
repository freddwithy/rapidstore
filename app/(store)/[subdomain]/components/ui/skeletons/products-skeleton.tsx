import React from "react";
import ProductCardSkeleton from "./product-card-skeleton";

interface ProductsSkeletonProps {
  numberOfProducts?: number;
}

const ProductsSkeleton = ({ numberOfProducts }: ProductsSkeletonProps) => {
  return (
    <>
      {numberOfProducts &&
        Array.from({ length: numberOfProducts }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
    </>
  );
};

export default ProductsSkeleton;
