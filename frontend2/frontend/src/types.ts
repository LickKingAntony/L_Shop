export type ProductCategory = "electronics" | "clothes" | "food" | "other"

export type Product = {
  id: string
  title: string
  description: string
  price: number
  category: ProductCategory
  available: boolean
  stock: number
  imageUrl: string
}

export type CartItem = {
  productId: string
  quantity: number
}

export type DeliveryStatus = "created" | "completed"

export type Delivery = {
  id: string
  userId: string
  items: CartItem[]
  address: string
  phone: string
  email: string
  paymentMethod: string
  createdAt: string
  status: DeliveryStatus
}

export type User = {
  id: string
  name: string
  email: string
  login: string
  phone: string
  cartItems: CartItem[]
  deliveries: Delivery[]
}


