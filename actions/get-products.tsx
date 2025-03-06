import { Prisma } from "@prisma/client";
import queryString from "query-string";

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

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  storeId?: string;
  limit?: number;
}

const getProducts = async (query: Query): Promise<ProductWithVariants[]> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${query.storeId}/products`;

  console.log(URL);

  const url = queryString.stringifyUrl({
    url: URL,
    query: {
      colorId: query.colorId,
      sizeId: query.sizeId,
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
      limit: query.limit,
    },
  });

  const res = await fetch(url);
  return res.json();
};

export default getProducts;
