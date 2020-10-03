import { Router } from "express";
import TrakteerID from "../../App";

const router = Router();

router.get("/", (req, res) => {
    const API = new TrakteerID();
    const user = req.query.username as string;
    if (!user) return res.json({
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

export = router;