import Titles from "@/components/titles";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductCard from "./ui/product-card";
import { Prisma } from "@prisma/client";

type CategoriesWithProducts = Prisma.CategoryGetPayload<{
  include: {
    products: {
      include: {
        variants: {
          include: {
            variant: true;
            color: true;
          };
        };
        images: true;
      };
    };
  };
}>;

interface ProductsProps {
  storeId: string;
}
async function ProductByCategories({ storeId }: ProductsProps) {
  const data = async () => {
    try {
      // no cors
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${storeId}/product`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const categories = await res.json();
        return categories;
      } else {
        console.log(res.status);
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const categories = (await data()) as CategoriesWithProducts[];

  if (!categories) return null;

  console.log(categories);

  return (
    <>
      {categories.map((cat) => (
        <div key={cat.id} className="space-y-4" id={cat.name}>
          <Titles
            title={cat.name}
            description={
              cat.products.length +
              (cat.products.length > 1 ? " productos" : " producto")
            }
          />
          <ScrollArea className="max-w-[1080px]">
            <div className="flex w-full gap-4">
              {cat.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}
    </>
  );
}

export default ProductByCategories;
