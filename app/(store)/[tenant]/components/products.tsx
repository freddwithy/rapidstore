import ProductCard from "./ui/product-card";
import { Prisma } from "@prisma/client";
import getProducts from "@/actions/get-products";

type ProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        variant: true;
        color: true;
      };
    };
    images: true;
  };
}>;

interface ProductsProps {
  storeId: string;
  categoryId?: string;
  isFeatured?: boolean;
  limit?: number;
}
async function ProductByCategories({
  storeId,
  categoryId,
  isFeatured,
  limit,
}: ProductsProps) {
  const products: ProductWithVariants[] = await getProducts({
    storeId,
    categoryId,
    isFeatured,
    limit,
  });
  return (
    <>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </>
  );
}

export default ProductByCategories;
