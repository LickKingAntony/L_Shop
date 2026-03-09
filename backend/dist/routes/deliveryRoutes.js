"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../authMiddleware");
const deliveryController_1 = require("../controllers/deliveryController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authRequired, deliveryController_1.getDeliveries);
router.post("/", authMiddleware_1.authRequired, deliveryController_1.createDelivery);
exports.default = router;
