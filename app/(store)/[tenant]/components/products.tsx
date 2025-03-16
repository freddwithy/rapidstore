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
  tenant: string;
}
async function ProductByCategories({
  storeId,
  categoryId,
  isFeatured,
  limit,
  tenant,
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
        <ProductCard key={p.id} product={p} tenant={tenant} />
      ))}
    </>
  );
}

export default ProductByCategories;
