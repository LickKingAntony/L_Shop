"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = authRequired;
const fileStorage_1 = require("./fileStorage");
function authRequired(req, res, next) {
    try {
        const token = req.cookies?.sessionId;
        if (!token) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const data = (0, fileStorage_1.loadUsersFile)();
        const user = data.users.find(u => u.sessionToken === token);
        if (!user) {
            res.status(401).json({ message: "Invalid session" });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(500).json({ message: "Auth error" });
    }
}
