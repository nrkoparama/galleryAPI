const express = require("express");
const router = express.Router();
const categoryController = require("../../mongo/controllers/category.controller");

router.get("/", async (req, res) => {
    try {
        const result = await categoryController.getAllCategories();
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

router.get("/category", async (req, res) => {
    try {
        const {id} = req.query;
        const result = await categoryController.getCategoryById(id);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

router.post("/category/create", async (req, res) => {
    try {
        const body = req.body;
        const result = await categoryController.createCategory(body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

router.put("/category/update", async (req, res) => {
    try {
        const {id} = req.query;
        const body = req.body;
        const result = await categoryController.updateCategory(id, body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

router.delete("/category/delete", async (req, res) => {
    try {
        const {id} = req.query;
        const result = await categoryController.deleteCategory(id);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

module.exports = router;
