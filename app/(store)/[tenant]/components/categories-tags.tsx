import { buttonVariants } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import React from "react";

interface CategoriesTagsProps {
  storeId: string;
}

const CategoriesTags: React.FC<CategoriesTagsProps> = async ({ storeId }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });
  return (
    <>
      {categories.map((cat) => (
        <a
          key={cat.name}
          href={`#${cat.name}`}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          {cat.name}
        </a>
      ))}
    </>
  );
};

export default CategoriesTags;
