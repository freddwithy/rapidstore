import prismadb from "@/lib/prismadb";
import ProductCard from "./ui/product-card";
import FeaturedProductCard from "./ui/featured-product-card";

interface ProductsProps {
  storeId: string;
  categoryId?: string;
  isFeatured?: boolean;
  limit?: number;
  tenant: string;
  forScroll?: boolean;
}
async function ProductByCategories({
  storeId,
  categoryId,
  isFeatured,
  limit,
  tenant,
  forScroll,
}: ProductsProps) {
  const products = await prismadb.product.findMany({
    where: {
      storeId,
      categoryId,
      isFeatured,
      status: { in: ["EN_VENTA", "AGOTADO"] },
    },
    take: limit,
    include: {
      images: true,
      variants: {
        include: {
          options: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <>
      {forScroll
        ? products.map((p) => (
            <FeaturedProductCard key={p.id} product={p} tenant={tenant} />
          ))
        : products.map((p) => (
            <ProductCard key={p.id} product={p} tenant={tenant} />
          ))}
    </>
  );
}

export default ProductByCategories;
