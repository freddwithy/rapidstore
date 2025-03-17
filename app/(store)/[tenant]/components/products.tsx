import prismadb from "@/lib/prismadb";
import ProductCard from "./ui/product-card";

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
  const products = await prismadb.product.findMany({
    where: {
      storeId,
      categoryId,
      isFeatured,
    },
    take: limit,
    include: {
      images: true,
      variants: {
        include: {
          variant: true,
          color: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
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
