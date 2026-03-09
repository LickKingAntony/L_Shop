import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import productRoutes from "./routes/productRoutes"
import cartRoutes from "./routes/cartRoutes"
import deliveryRoutes from "./routes/deliveryRoutes"
import { loadProductsFile, saveProductsFile } from "./fileStorage"

const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
)

const frontendDistPath = path.resolve(process.cwd(), "frontend", "dist")
const frontendStatic = express.static(frontendDistPath)
app.use("/static", frontendStatic)

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/deliveries", deliveryRoutes)

app.get("*", (_req, res) => {
  try {
    res.sendFile(path.join(frontendDistPath, "index.html"))
  } catch {
    res.status(500).send("Server error")
  }
})

function ensureSampleProducts(): void {
  const data = loadProductsFile()
  if (data.products.length > 0) {
    return
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
  ]
  saveProductsFile(data)
}

ensureSampleProducts()

app.listen(port, () => {
})


