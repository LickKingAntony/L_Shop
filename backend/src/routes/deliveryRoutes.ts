import { Router } from "express"
import { authRequired } from "../authMiddleware"
import { createDelivery, getDeliveries } from "../controllers/deliveryController"

const router = Router()

router.get("/", authRequired, getDeliveries)
router.post("/", authRequired, createDelivery)

export default router


