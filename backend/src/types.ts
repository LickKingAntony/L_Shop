export type UserRole = "customer"

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
  password: string
  role: UserRole
  cartItems: CartItem[]
  deliveries: Delivery[]
  sessionToken: string | null
}

export type ProductCategory = "electronics" | "clothes" | "food" | "other"

export type Product = {
  id: string
  title: string
  description: string
  price: number
  category: ProductCategory
  available: boolean
  imageUrl: string
}

export type UsersFile = {
  users: User[]
}

export type ProductsFile = {
  products: Product[]
}


