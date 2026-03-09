import { Request, Response } from "express"
import { loadProductsFile } from "../fileStorage"
import { Product } from "../types"

type ProductsQuery = {
  search?: string
  category?: string
  available?: string
  sort?: string
}

export function getProducts(req: Request, res: Response): void {
  try {
    const query = req.query as ProductsQuery
    const data = loadProductsFile()
    let result: Product[] = data.products.slice()

    if (query.search) {
      const value = query.search.toLowerCase()
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(value) ||
          p.description.toLowerCase().includes(value)
      )
    }

    if (query.category) {
      result = result.filter(p => p.category === query.category)
    }

    if (query.available) {
      if (query.available === "true") {
        result = result.filter(p => p.available)
      }
      if (query.available === "false") {
        result = result.filter(p => !p.available)
      }
    }

    if (query.sort === "price_asc") {
      result = result.slice().sort((a, b) => a.price - b.price)
    }
    if (query.sort === "price_desc") {
      result = result.slice().sort((a, b) => b.price - a.price)
    }

    res.status(200).json({ products: result })
  } catch {
    res.status(500).json({ message: "Products error" })
  }
}


