import { Response } from "express"
import { AuthedRequest } from "../authMiddleware"
import { CartItem } from "../types"
import { loadUsersFile, saveUsersFile } from "../fileStorage"

type AddToCartBody = {
  productId: string
  quantity: number
}

type UpdateCartBody = {
  quantity: number
}

export function getCart(req: AuthedRequest, res: Response): void {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }
    res.status(200).json({ items: req.user.cartItems })
  } catch {
    res.status(500).json({ message: "Cart error" })
  }
}

export function addToCart(req: AuthedRequest, res: Response): void {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }
    const body = req.body as AddToCartBody
    if (!body.productId || !body.quantity || body.quantity <= 0) {
      res.status(400).json({ message: "Invalid body" })
      return
    }
    const data = loadUsersFile()
    const user = data.users.find(u => u.id === req.user?.id)
    if (!user) {
      res.status(401).json({ message: "User not found" })
      return
    }
    const existing = user.cartItems.find(i => i.productId === body.productId)
    if (existing) {
      existing.quantity += body.quantity
    } else {
      const item: CartItem = {
        productId: body.productId,
        quantity: body.quantity
      }
      user.cartItems.push(item)
    }
    saveUsersFile(data)
    res.status(200).json({ items: user.cartItems })
  } catch {
    res.status(500).json({ message: "Add to cart error" })
  }
}

export function updateCartItem(req: AuthedRequest, res: Response): void {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }
    const productId = req.params.productId
    const body = req.body as UpdateCartBody
    if (!productId || body.quantity === undefined) {
      res.status(400).json({ message: "Invalid body" })
      return
    }
    const data = loadUsersFile()
    const user = data.users.find(u => u.id === req.user?.id)
    if (!user) {
      res.status(401).json({ message: "User not found" })
      return
    }
    const item = user.cartItems.find(i => i.productId === productId)
    if (!item) {
      res.status(404).json({ message: "Item not found" })
      return
    }
    if (body.quantity <= 0) {
      user.cartItems = user.cartItems.filter(i => i.productId !== productId)
    } else {
      item.quantity = body.quantity
    }
    saveUsersFile(data)
    res.status(200).json({ items: user.cartItems })
  } catch {
    res.status(500).json({ message: "Update cart error" })
  }
}

export function removeCartItem(req: AuthedRequest, res: Response): void {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }
    const productId = req.params.productId
    if (!productId) {
      res.status(400).json({ message: "Product id required" })
      return
    }
    const data = loadUsersFile()
    const user = data.users.find(u => u.id === req.user?.id)
    if (!user) {
      res.status(401).json({ message: "User not found" })
      return
    }
    user.cartItems = user.cartItems.filter(i => i.productId !== productId)
    saveUsersFile(data)
    res.status(200).json({ items: user.cartItems })
  } catch {
    res.status(500).json({ message: "Remove cart error" })
  }
}


