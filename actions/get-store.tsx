import { Product } from "@prisma/client";
import queryString from "query-string";

interface Query {
  tenantURL: string;
}

const getStore = async (query: Query): Promise<Product> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${query.tenantURL}`;

  console.log(URL);

  const url = queryString.stringifyUrl({
    url: URL,
    query: {
      url: query.tenantURL,
    },
  });

  const res = await fetch(url);
  return res.json();
};

export default getStore;
