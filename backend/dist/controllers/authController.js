"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.me = me;
const uuid_1 = require("uuid");
const fileStorage_1 = require("../fileStorage");
function setSessionCookie(res, token) {
    const maxAge = 10 * 60 * 1000;
    res.cookie("sessionId", token, {
        httpOnly: true,
        maxAge
    });
}
function register(req, res) {
    try {
        const body = req.body;
        if (!body.name || !body.email || !body.login || !body.phone || !body.password) {
            res.status(400).json({ message: "Missing fields" });
            return;
        }
        const data = (0, fileStorage_1.loadUsersFile)();
        const exists = data.users.find(u => u.email === body.email || u.login === body.login || u.phone === body.phone);
        if (exists) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const id = (0, uuid_1.v4)();
        const sessionToken = (0, uuid_1.v4)();
        const user = {
            id,
            name: body.name,
            email: body.email,
            login: body.login,
            phone: body.phone,
            password: body.password,
            role: "customer",
            cartItems: [],
            deliveries: [],
            sessionToken
        };
        data.users.push(user);
        (0, fileStorage_1.saveUsersFile)(data);
        setSessionCookie(res, sessionToken);
        res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                login: user.login,
                phone: user.phone,
                cartItems: user.cartItems,
                deliveries: user.deliveries
            }
        });
    }
    catch {
        res.status(500).json({ message: "Register error" });
    }
}
function login(req, res) {
    try {
        const body = req.body;
        if (!body.loginOrEmailOrPhone || !body.password) {
            res.status(400).json({ message: "Missing fields" });
            return;
        }
        const data = (0, fileStorage_1.loadUsersFile)();
        const user = data.users.find(u => (u.login === body.loginOrEmailOrPhone ||
            u.email === body.loginOrEmailOrPhone ||
            u.phone === body.loginOrEmailOrPhone) &&
            u.password === body.password);
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const sessionToken = (0, uuid_1.v4)();
        user.sessionToken = sessionToken;
        (0, fileStorage_1.saveUsersFile)(data);
        setSessionCookie(res, sessionToken);
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                login: user.login,
                phone: user.phone,
                cartItems: user.cartItems,
                deliveries: user.deliveries
            }
        });
    }
    catch {
        res.status(500).json({ message: "Login error" });
    }
}
function logout(req, res) {
    try {
        const data = (0, fileStorage_1.loadUsersFile)();
        const token = req.cookies?.sessionId;
        if (token) {
            const user = data.users.find(u => u.sessionToken === token);
            if (user) {
                user.sessionToken = null;
                (0, fileStorage_1.saveUsersFile)(data);
            }
        }
        res.clearCookie("sessionId");
        res.status(200).json({ message: "Logged out" });
    }
    catch {
        res.status(500).json({ message: "Logout error" });
    }
}
function me(req, res) {
    try {
        const token = req.cookies?.sessionId;
        if (!token) {
            res.status(200).json({ user: null });
            return;
        }
        const data = (0, fileStorage_1.loadUsersFile)();
        const user = data.users.find(u => u.sessionToken === token);
        if (!user) {
            res.status(200).json({ user: null });
            return;
        }
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                login: user.login,
                phone: user.phone,
                cartItems: user.cartItems,
                deliveries: user.deliveries
            }
        });
    }
    catch {
        res.status(500).json({ message: "Me error" });
    }
}
