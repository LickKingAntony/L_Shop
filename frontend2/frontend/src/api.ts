import { CartItem, Delivery, Product, User } from "./types.js"

const apiBase = "/api"

type RegisterBody = {
  name: string
  email: string
  login: string
  phone: string
  password: string
}

type LoginBody = {
  loginOrEmailOrPhone: string
  password: string
}

type DeliveryBody = {
  address: string
  phone: string
  email: string
  paymentMethod: string
}

type ProductsQuery = {
  search?: string
  category?: string
  available?: string
  sort?: string
}

export async function apiRegister(body: RegisterBody): Promise<User | null> {
  try {
    const response = await fetch(`${apiBase}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as { user: User }
    return data.user
  } catch {
    return null
  }
}

export async function apiLogin(body: LoginBody): Promise<User | null> {
  try {
    const response = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as { user: User }
    return data.user
  } catch {
    return null
  }
}

export async function apiLogout(): Promise<void> {
  try {
    await fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      credentials: "include"
    })
  } catch {
  }
}

export async function apiMe(): Promise<User | null> {
  try {
    const response = await fetch(`${apiBase}/auth/me`, {
      method: "GET",
      credentials: "include"
    })
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as { user: User | null }
    return data.user
  } catch {
    return null
  }
}

export async function apiGetProducts(query: ProductsQuery): Promise<Product[]> {
  try {
    const params = new URLSearchParams()
    if (query.search) {
      params.set("search", query.search)
    }
    if (query.category) {
      params.set("category", query.category)
    }
    if (query.available) {
      params.set("available", query.available)
    }
    if (query.sort) {
      params.set("sort", query.sort)
    }
    const queryString = params.toString()
    const url = queryString ? `${apiBase}/products?${queryString}` : `${apiBase}/products`
    const response = await fetch(url, {
      method: "GET",
      credentials: "include"
    })
    if (!response.ok) {
      return []
    }
    const data = (await response.json()) as { products: Product[] }
    return data.products
  } catch {
    return []
  }
}

export async function apiGetCart(): Promise<CartItem[]> {
  try {
    const response = await fetch(`${apiBase}/cart`, {
      method: "GET",
      credentials: "include"
    })
    if (!response.ok) {
      return []
    }
    const data = (await response.json()) as { items: CartItem[] }
    return data.items
  } catch {
    return []
  }
}

export async function apiAddToCart(productId: string, quantity: number): Promise<CartItem[] | null> {
  try {
    const response = await fetch(`${apiBase}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ productId, quantity })
    })
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as { items: CartItem[] }
    return data.items
  } catch {
    return null
  }
}

export async function apiUpdateCartItem(productId: string, quantity: number): Promise<CartItem[] | null> {
  try {
    const response = await fetch(`${apiBase}/cart/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ quantity })
    })
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as { items: CartItem[] }
    return data.items
  } catch {
    return null
  }
}

export async function apiRemoveCartItem(productId: string): Promise<CartItem[] | null> {
  try {
    const response = await fetch(`${apiBase}/cart/${productId}`, {
      method: "DELETE",
      credentials: "include"
    })
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as { items: CartItem[] }
    return data.items
  } catch {
    return null
  }
}

export async function apiGetDeliveries(): Promise<Delivery[]> {
  try {
    const response = await fetch(`${apiBase}/deliveries`, {
      method: "GET",
      credentials: "include"
    })
    if (!response.ok) {
      return []
    }
    const data = (await response.json()) as { deliveries: Delivery[] }
    return data.deliveries
  } catch {
    return []
  }
}

export async function apiCreateDelivery(body: DeliveryBody): Promise<Delivery | null> {
  try {
    const response = await fetch(`${apiBase}/deliveries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    })
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as { delivery: Delivery }
    return data.delivery
  } catch {
    return null
  }
}


