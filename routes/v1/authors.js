const express = require("express");
const router = express.Router();
const authorController = require("../../mongo/controllers/author.controller");

router.get("/", async (req, res) => {
    try {
        const result = await authorController.getAllAuthors();
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

router.post("/", async (req, res) => {
    try {
        const {email} = req.body;
        if (!email) {
            return res.status(401).json({status: 401, message: "Thiếu dữ liệu"});
        }
        const result = await authorController.getAuthorByEmail(email);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

// authors/author?id=value
router.get("/author", async (req, res) => {
    try {
        const {id} = req.query;
        if (!id) {
            return res.status(401).json({status: 401, message: "Thiếu dữ liệu"});
        }
        const result = await authorController.getAuthorById(id);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

router.post("/author/register", async (req, res) => {
    try {
        const body = req.body;
        const {name, email, password, isThirdParty, contact_ref} = body;
        if (!name || !email || !password || isThirdParty || contact_ref) {
            return res.status(401).json({status: 401, message: "Thiếu dữ liệu"});
        }
        const result = await authorController.register(body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

router.post("/author/login", async (req, res) => {
    try {
        const body = req.body;
        const {email, password} = body;
        if (!email || !password) {
            return res.status(401).json({status: 401, message: "Thiếu dữ liệu"});
        }
        const result = await authorController.login(body);
        if (result.status === 200) {
            res.cookie("as_tn", result.access_token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                maxAge: 3 * 24 * 3600 * 1000,
                sameSite: "strict",
                path: "/",
            });

            res.cookie("rh_tn", result.refresh_token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 3600 * 1000,
                sameSite: "strict",
                path: "/",
            });

            return res.status(result.status).json({status: result.status, message: result.message});
        } else {
            return res.status(result.status).json({status: result.status, message: result.message});
        }
    } catch (error) {
        console.error("Lỗi server:", error);
        return res
            .status(500)
            .json({status: 500, message: "Lỗi server"});
    }
});

router.post("/author/login/third-party", async (req, res) => {
    try {
        const body = req.body;
        const {email, password} = body;
        if (!email || !password) {
            return res.status(401).json({status: 401, message: "Thiếu dữ liệu"});
        }
        const result = await authorController.login(body);
        if (result.status === 200) {
            res.cookie("as_tn", result.access_token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                maxAge: 3 * 24 * 3600 * 1000,
                sameSite: "strict",
                path: "/",
            });

            res.cookie("rh_tn", result.refresh_token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 3600 * 1000,
                sameSite: "strict",
                path: "/",
            });

            return res.status(result.status).json({result});
        } else {
            return res.status(result.status).json({result});
        }
    } catch (error) {
        console.error("Lỗi server:", error);
        return res
            .status(500)
            .json({status: 500, message: "Lỗi server", error: error});
    }
});

router.post("/author/logout", async (req, res) => {
    try {
        res.clearCookie("as_tn", {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
        });
        res.clearCookie("rh_tn", {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
        });
        return res.status(200).json({message: "Đăng xuất thành công"});
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

module.exports = router;
