import getCategories from "@/actions/get-categories";
import { buttonVariants } from "@/components/ui/button";
import React from "react";

interface CategoriesTagsProps {
  storeId: string;
}

const CategoriesTags: React.FC<CategoriesTagsProps> = async ({ storeId }) => {
  const categories = await getCategories({ storeId });
  return (
    <>
      {categories.map((cat) => (
        <a
          key={cat.name}
          href={`#${cat.name}`}
          className={buttonVariants({
            variant: "outline",
            className: "rounded-xl",
          })}
        >
          {cat.name}
        </a>
      ))}
    </>
  );
};

export default CategoriesTags;
