import { NextFunction, Request, Response } from "express"
import { loadUsersFile } from "./fileStorage"
import { User } from "./types"

export type AuthedRequest = Request & {
  user?: User
}

export function authRequired(req: AuthedRequest, res: Response, next: NextFunction): void {
  try {
    const token = req.cookies?.sessionId as string | undefined
    if (!token) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }
    const data = loadUsersFile()
    const user = data.users.find(u => u.sessionToken === token)
    if (!user) {
      res.status(401).json({ message: "Invalid session" })
      return
    }
    req.user = user
    next()
  } catch {
    res.status(500).json({ message: "Auth error" })
  }
}


