
import { Category } from "@prisma/client"
import queryString from "query-string"

interface Query {
    storeId?: string
}

const getCategories = async (query: Query): Promise<Category[]> => {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/${query.storeId}/categories`

    console.log(URL)

    const url = queryString.stringifyUrl({
        url: URL,
    })

    const res = await fetch(url)
    return res.json()
}

export default getCategories