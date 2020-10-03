"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const App_1 = __importDefault(require("../../App"));
const router = express_1.Router();
router.get("/", (req, res) => {
    const API = new App_1.default();
    const user = req.query.username;
    if (!user)
        return res.json({
            success: false,
            message: "missing username"
        });
    API.got(user).then((val) => {
        res.status(200).json({
            success: true,
            result: val
        });
    }).catch((e) => {
        res.status(500).json({
            success: false,
            message: e
        });
    });
});
module.exports = router;
