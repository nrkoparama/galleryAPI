const express = require("express");
const router = express.Router();
const contactController = require("../../mongo/controllers/contact.controller");

router.get("/", async (req, res) => {
    try {
        const result = await contactController.getAllContacts();
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({message: "Lỗi server"});
    }
});

router.get("/contact", async (req, res) => {
    try {
        const {id} = req.query;
        const result = await contactController.getContactById(id);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

router.post("/contact/create", async (req, res) => {
    try {
        const body = req.body;
        const result = await contactController.createContact(body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({status: 500, message: "Lỗi server"});
    }
});

router.put("/contact/update", async (req, res) => {
    try {
        const {id} = req.query;
        const body = req.body;
        const result = await contactController.updateContact(id, body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({message: "Lỗi server"});
    }
});

router.delete("/contact/delete", async (req, res) => {
    try {
        const {id} = req.query;
        const result = await contactController.deleteContact(id);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi server: ", error);
        return res.status(500).json({message: "Lỗi server"});
    }
});

module.exports = router;