import getCategories from "@/actions/get-categories";
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
          className="flex gap-x-2 items-center bg-primary-foreground px-4 py-2 rounded-full border-muted border hover:bg-primary-foreground/80"
        >
          {cat.name}
        </a>
      ))}
    </>
  );
};

export default CategoriesTags;
