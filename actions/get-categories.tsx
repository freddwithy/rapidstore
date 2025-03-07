import { Prisma } from "@prisma/client";
import queryString from "query-string";

type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: {
    products: {
      select: {
        id: true;
      };
    };
  };
}>;

interface Query {
  storeId?: string;
}

const getCategories = async (query: Query): Promise<CategoryWithProducts[]> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${query.storeId}/categories`;

  console.log(URL);

  const url = queryString.stringifyUrl({
    url: URL,
  });

  const res = await fetch(url);
  return res.json();
};

export default getCategories;
