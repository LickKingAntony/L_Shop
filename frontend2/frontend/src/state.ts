import { CartItem, Delivery, Product, User } from "./types.js"

export type AppRoute = "/" | "/register" | "/cart" | "/delivery"

export type AppState = {
  currentUser: User | null
  products: Product[]
  cartItems: CartItem[]
  deliveries: Delivery[]
  currentRoute: AppRoute
  productFilters: {
    search: string
    category: string
    available: string
    sort: string
  }
}

const initialState: AppState = {
  currentUser: null,
  products: [],
  cartItems: [],
  deliveries: [],
  currentRoute: "/",
  productFilters: {
    search: "",
    category: "",
    available: "",
    sort: ""
  }
}

let state: AppState = initialState

export function getState(): AppState {
  return state
}

export function setState(next: AppState): void {
  state = next
}

export function updateState(partial: Partial<AppState>): void {
  state = {
    ...state,
    ...partial
  }
}

export function setRoute(route: AppRoute): void {
  state = {
    ...state,
    currentRoute: route
  }
}


