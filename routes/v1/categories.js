const express = require("express");
const router = express.Router();
const categoryController = require("../../mongo/controllers/category.controller");

router.get("/", async (req, res) => {
  try {
    const result = await categoryController.getAllCategories();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ status: 500, message: "Lỗi server" });
  }
});

// categories/category?id=value
router.get("/category", async (req, res) => {
  try {
    const { id } = req.query;
    const result = await categoryController.getCategoryById(id);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ status: 500, message: "Lỗi server" });
  }
});

router.post("/category/create", async (req, res) => {
  try {
    const body = req.body;
    const { name, description, status } = body;
    if (!name || !description || !status) {
      return res.status(400).json({
        status: 401,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const result = await categoryController.createCategory(body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ status: 500, message: "Lỗi server" });
  }
});

// categories/category/update?id=value
router.put("/category/update", async (req, res) => {
  try {
    const { id } = req.query;
    const body = req.body;

    const { name, description, status } = body;
    if ((!id|| !name || !description || !status)) {
      return res.status(400).json({
        status: 401,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const result = await categoryController.updateCategory(id, body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ status: 500, message: "Lỗi server" });
  }
});

module.exports = router;
