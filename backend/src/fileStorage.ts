import fs from "fs"
import path from "path"
import { ProductsFile, UsersFile } from "./types"

const dataDir = path.resolve(process.cwd(), "backend", "data")
const usersFilePath = path.join(dataDir, "users.json")
const productsFilePath = path.join(dataDir, "products.json")

function ensureDataDir(): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    ensureDataDir()
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), { encoding: "utf-8" })
      return defaultValue
    }
    const content = fs.readFileSync(filePath, { encoding: "utf-8" })
    if (!content) {
      return defaultValue
    }
    const parsed = JSON.parse(content) as T
    return parsed
  } catch {
    return defaultValue
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    ensureDataDir()
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { encoding: "utf-8" })
  } catch {
  }
}

export function loadUsersFile(): UsersFile {
  const defaultValue: UsersFile = { users: [] }
  return readJsonFile<UsersFile>(usersFilePath, defaultValue)
}

export function saveUsersFile(data: UsersFile): void {
  writeJsonFile<UsersFile>(usersFilePath, data)
}

export function loadProductsFile(): ProductsFile {
  const defaultValue: ProductsFile = { products: [] }
  return readJsonFile<ProductsFile>(productsFilePath, defaultValue)
}

export function saveProductsFile(data: ProductsFile): void {
  writeJsonFile<ProductsFile>(productsFilePath, data)
}


