"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadUsersFile = loadUsersFile;
exports.saveUsersFile = saveUsersFile;
exports.loadProductsFile = loadProductsFile;
exports.saveProductsFile = saveProductsFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dataDir = path_1.default.resolve(process.cwd(), "backend", "data");
const usersFilePath = path_1.default.join(dataDir, "users.json");
const productsFilePath = path_1.default.join(dataDir, "products.json");
function ensureDataDir() {
    if (!fs_1.default.existsSync(dataDir)) {
        fs_1.default.mkdirSync(dataDir, { recursive: true });
    }
}
function readJsonFile(filePath, defaultValue) {
    try {
        ensureDataDir();
        if (!fs_1.default.existsSync(filePath)) {
            fs_1.default.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), { encoding: "utf-8" });
            return defaultValue;
        }
        const content = fs_1.default.readFileSync(filePath, { encoding: "utf-8" });
        if (!content) {
            return defaultValue;
        }
        const parsed = JSON.parse(content);
        return parsed;
    }
    catch {
        return defaultValue;
    }
}
function writeJsonFile(filePath, data) {
    try {
        ensureDataDir();
        fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), { encoding: "utf-8" });
    }
    catch {
    }
}
function loadUsersFile() {
    const defaultValue = { users: [] };
    return readJsonFile(usersFilePath, defaultValue);
}
function saveUsersFile(data) {
    writeJsonFile(usersFilePath, data);
}
function loadProductsFile() {
    const defaultValue = { products: [] };
    return readJsonFile(productsFilePath, defaultValue);
}
function saveProductsFile(data) {
    writeJsonFile(productsFilePath, data);
}
