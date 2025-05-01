const express = require("express");
const router = express.Router();
const contactController = require("../../mongo/controllers/contact.controller");

router.get("/", async (req, res) => {
  try {
    const result = await contactController.getAllContacts();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Lỗi lấy dữ liệu liên hệ:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

// contacts/contact?id=value
router.get("/contact", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(401).json({ message: "Thiếu dữ liệu" });
    }
    const result = await contactController.getContactById(id);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Lỗi lấy dữ liệu liên hệ:", error);
    return res.status(500).json({ status: 500, message: "Lỗi server" });
  }
});

router.post("/contact/create", async (req, res) => {
  try {
    const body = req.body;
    const result = await contactController.createContact(body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Lỗi tạo liên hệ:", error);
    return res.status(500).json({ status: 500, message: "Lỗi server" });
  }
});

// contacts/contact/update?id=value
router.put("/contact/update", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }
    const body = req.body;
    const result = await contactController.updateContact(id, body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Lỗi cập nhật liên hệ:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;