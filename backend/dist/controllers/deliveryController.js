"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveries = getDeliveries;
exports.createDelivery = createDelivery;
const uuid_1 = require("uuid");
const fileStorage_1 = require("../fileStorage");
function getDeliveries(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        res.status(200).json({ deliveries: req.user.deliveries });
    }
    catch {
        res.status(500).json({ message: "Deliveries error" });
    }
}
function createDelivery(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const body = req.body;
        if (!body.address || !body.phone || !body.email || !body.paymentMethod) {
            res.status(400).json({ message: "Invalid body" });
            return;
        }
        const data = (0, fileStorage_1.loadUsersFile)();
        const user = data.users.find(u => u.id === req.user?.id);
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        if (user.cartItems.length === 0) {
            res.status(400).json({ message: "Cart is empty" });
            return;
        }
        const delivery = {
            id: (0, uuid_1.v4)(),
            userId: user.id,
            items: user.cartItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
            address: body.address,
            phone: body.phone,
            email: body.email,
            paymentMethod: body.paymentMethod,
            createdAt: new Date().toISOString(),
            status: "created"
        };
        user.deliveries.push(delivery);
        user.cartItems = [];
        (0, fileStorage_1.saveUsersFile)(data);
        res.status(201).json({ delivery });
    }
    catch {
        res.status(500).json({ message: "Create delivery error" });
    }
}
