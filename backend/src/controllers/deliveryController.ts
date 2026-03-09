import { Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { AuthedRequest } from "../authMiddleware"
import { Delivery } from "../types"
import { loadUsersFile, saveUsersFile } from "../fileStorage"

type CreateDeliveryBody = {
  address: string
  phone: string
  email: string
  paymentMethod: string
}

export function getDeliveries(req: AuthedRequest, res: Response): void {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }
    res.status(200).json({ deliveries: req.user.deliveries })
  } catch {
    res.status(500).json({ message: "Deliveries error" })
  }
}

export function createDelivery(req: AuthedRequest, res: Response): void {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }
    const body = req.body as CreateDeliveryBody
    if (!body.address || !body.phone || !body.email || !body.paymentMethod) {
      res.status(400).json({ message: "Invalid body" })
      return
    }
    const data = loadUsersFile()
    const user = data.users.find(u => u.id === req.user?.id)
    if (!user) {
      res.status(401).json({ message: "User not found" })
      return
    }
    if (user.cartItems.length === 0) {
      res.status(400).json({ message: "Cart is empty" })
      return
    }
    const delivery: Delivery = {
      id: uuidv4(),
      userId: user.id,
      items: user.cartItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
      address: body.address,
      phone: body.phone,
      email: body.email,
      paymentMethod: body.paymentMethod,
      createdAt: new Date().toISOString(),
      status: "created"
    }
    user.deliveries.push(delivery)
    user.cartItems = []
    saveUsersFile(data)
    res.status(201).json({ delivery })
  } catch {
    res.status(500).json({ message: "Create delivery error" })
  }
}


