import { Router } from "express"
import { addToCart, getCart, removeCartItem, updateCartItem } from "../controllers/cartController"
import { authRequired } from "../authMiddleware"

const router = Router()

router.get("/", authRequired, getCart)
router.post("/", authRequired, addToCart)
router.patch("/:productId", authRequired, updateCartItem)
router.delete("/:productId", authRequired, removeCartItem)

export default router


