
import ProductCard from "./ui/product-card";
import {Prisma } from "@prisma/client";
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
  categoryId?: string
  isFeatured?: boolean
  limit?: number
}
async function ProductByCategories({ storeId, categoryId, isFeatured, limit }: ProductsProps) {
  const products: ProductWithVariants[] = await getProducts({storeId, categoryId, isFeatured, limit})
  return (
    <>
            <div className="grid grid-cols-4 w-full gap-4 max-w-[1080px]">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
    </>
  );
}

export default ProductByCategories;
