import { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { loadUsersFile, saveUsersFile } from "../fileStorage"
import { User } from "../types"

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

function setSessionCookie(res: Response, token: string): void {
  const maxAge = 10 * 60 * 1000
  res.cookie("sessionId", token, {
    httpOnly: true,
    maxAge
  })
}

export function register(req: Request, res: Response): void {
  try {
    const body = req.body as RegisterBody
    if (!body.name || !body.email || !body.login || !body.phone || !body.password) {
      res.status(400).json({ message: "Missing fields" })
      return
    }
    const data = loadUsersFile()
    const exists = data.users.find(
      u => u.email === body.email || u.login === body.login || u.phone === body.phone
    )
    if (exists) {
      res.status(409).json({ message: "User already exists" })
      return
    }
    const id = uuidv4()
    const sessionToken = uuidv4()
    const user: User = {
      id,
      name: body.name,
      email: body.email,
      login: body.login,
      phone: body.phone,
      password: body.password,
      role: "customer",
      cartItems: [],
      deliveries: [],
      sessionToken
    }
    data.users.push(user)
    saveUsersFile(data)
    setSessionCookie(res, sessionToken)
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        login: user.login,
        phone: user.phone,
        cartItems: user.cartItems,
        deliveries: user.deliveries
      }
    })
  } catch {
    res.status(500).json({ message: "Register error" })
  }
}

export function login(req: Request, res: Response): void {
  try {
    const body = req.body as LoginBody
    if (!body.loginOrEmailOrPhone || !body.password) {
      res.status(400).json({ message: "Missing fields" })
      return
    }
    const data = loadUsersFile()
    const user = data.users.find(
      u =>
        (u.login === body.loginOrEmailOrPhone ||
          u.email === body.loginOrEmailOrPhone ||
          u.phone === body.loginOrEmailOrPhone) &&
        u.password === body.password
    )
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" })
      return
    }
    const sessionToken = uuidv4()
    user.sessionToken = sessionToken
    saveUsersFile(data)
    setSessionCookie(res, sessionToken)
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        login: user.login,
        phone: user.phone,
        cartItems: user.cartItems,
        deliveries: user.deliveries
      }
    })
  } catch {
    res.status(500).json({ message: "Login error" })
  }
}

export function logout(req: Request, res: Response): void {
  try {
    const data = loadUsersFile()
    const token = req.cookies?.sessionId as string | undefined
    if (token) {
      const user = data.users.find(u => u.sessionToken === token)
      if (user) {
        user.sessionToken = null
        saveUsersFile(data)
      }
    }
    res.clearCookie("sessionId")
    res.status(200).json({ message: "Logged out" })
  } catch {
    res.status(500).json({ message: "Logout error" })
  }
}

export function me(req: Request, res: Response): void {
  try {
    const token = req.cookies?.sessionId as string | undefined
    if (!token) {
      res.status(200).json({ user: null })
      return
    }
    const data = loadUsersFile()
    const user = data.users.find(u => u.sessionToken === token)
    if (!user) {
      res.status(200).json({ user: null })
      return
    }
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        login: user.login,
        phone: user.phone,
        cartItems: user.cartItems,
        deliveries: user.deliveries
      }
    })
  } catch {
    res.status(500).json({ message: "Me error" })
  }
}


