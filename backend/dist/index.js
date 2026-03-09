"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const deliveryRoutes_1 = __importDefault(require("./routes/deliveryRoutes"));
const fileStorage_1 = require("./fileStorage");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true
}));
const frontendDistPath = path_1.default.resolve(process.cwd(), "frontend", "dist");
const frontendStatic = express_1.default.static(frontendDistPath);
app.use("/static", frontendStatic);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/deliveries", deliveryRoutes_1.default);
app.get("*", (_req, res) => {
    try {
        res.sendFile(path_1.default.join(frontendDistPath, "index.html"));
    }
    catch {
        res.status(500).send("Server error");
    }
});
function ensureSampleProducts() {
    const data = (0, fileStorage_1.loadProductsFile)();
    if (data.products.length > 0) {
        return;
    }
    data.products = [
        {
            id: "p1",
            title: "Телефон Basic",
            description: "Простой телефон для звонков и сообщений",
            price: 199,
            category: "electronics",
            available: true,
            imageUrl: ""
        },
        {
            id: "p2",
            title: "Футболка Classic",
            description: "Базовая хлопковая футболка",
            price: 29,
            category: "clothes",
            available: true,
            imageUrl: ""
        },
        {
            id: "p3",
            title: "Печенье Sweet",
            description: "Сладкое печенье к чаю",
            price: 10,
            category: "food",
            available: false,
            imageUrl: ""
        }
    ];
    (0, fileStorage_1.saveProductsFile)(data);
}
ensureSampleProducts();
app.listen(port, () => {
});
