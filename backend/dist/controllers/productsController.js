"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
const fileStorage_1 = require("../fileStorage");
function getProducts(req, res) {
    try {
        const query = req.query;
        const data = (0, fileStorage_1.loadProductsFile)();
        let result = data.products.slice();
        if (query.search) {
            const value = query.search.toLowerCase();
            result = result.filter(p => p.title.toLowerCase().includes(value) ||
                p.description.toLowerCase().includes(value));
        }
        if (query.category) {
            result = result.filter(p => p.category === query.category);
        }
        if (query.available) {
            if (query.available === "true") {
                result = result.filter(p => p.available);
            }
            if (query.available === "false") {
                result = result.filter(p => !p.available);
            }
        }
        if (query.sort === "price_asc") {
            result = result.slice().sort((a, b) => a.price - b.price);
        }
        if (query.sort === "price_desc") {
            result = result.slice().sort((a, b) => b.price - a.price);
        }
        res.status(200).json({ products: result });
    }
    catch {
        res.status(500).json({ message: "Products error" });
    }
}
