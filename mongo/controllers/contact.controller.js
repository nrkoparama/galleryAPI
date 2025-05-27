const contactModel = require("../models/contact.model");

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
};

async function getAllContacts() {
    try {
        const contacts = await contactModel.find();
        return {status: 200, message: "Lấy dữ liệu thành công", data: contacts};
    } catch (error) {
        console.error("Lỗi lấy dữ liệu: ", error);
        return {status: 500, message: "Lỗi lấy dữ liệu"};
    }
}

async function getContactById(id) {
    try {
        if (!id) {
            return {status: 401, message: "Gửi thiếu dữ liệu"}
        }
        const contact = await contactModel.findById(id);
        if (!contact) {
            return {status: 404, message: "Không tìm thấy liên hệ"};
        }
        return {status: 200, message: "Lấy dữ liệu thành công", data: contact};
    } catch (error) {
        console.error("Lỗi lấy dữ liệu: ", error);
        return {status: 500, message: "Lỗi lấy dữ liệu"};
    }
}

async function createContact(body) {
    try {
        const newContact = new contactModel({...body});
        await newContact.save();
        return {
            status: 200,
            message: "Tạo liên hệ thành công",
            contact_id: newContact._id,
        };
    } catch (error) {
        console.error("Tạo liên hệ thất bại: ", error);
        return {status: 500, message: "Tạo liên hệ thất bại"};
    }
}

async function updateContact(id, body) {
    try {
        if (!id) {
            return {status: 401, message: "Thiếu dữ liệu"}
        }
        const contact = await contactModel.findById(id);
        if (!contact) {
            return {status: 404, message: "Không tìm thấy liên hệ"};
        }
        // những trường dữ liệu gửi lên khác vs dữ liệu đang lưu
        const updatedFields = {}
        const fields = ["facebook", "instagram", "x", "linkedIn"];

        fields.forEach((field) => {
            if (body.hasOwnProperty(field) && body[field] !== contact[field]) {
                updatedFields[field] = body[field];
            }
        })
        await contactModel.findByIdAndUpdate(
            id,
            {...updatedFields},
            {new: true}
        );
        return {status: 200, message: "Cập nhật thông tin liên hệ thành công"};
    } catch (error) {
        console.error("Lỗi cập nhật thông tin liên hệ: ", error);
        return {status: 500, message: "Cập nhật thông tin liên hệ thất bại"};
    }
}

async function deleteContact(id) {
    try {
        if (!id) {
            return {status: 401, message: "Gửi thiếu dữ liệu"}
        }
        const contact = await contactModel.findById(id);
        if (!contact) {
            return {status: 404, message: "Không tìm thấy liên hệ"};
        }
        await contactModel.findByIdAndDelete(id);
        return {status: 200, message: "Xóa liên hệ thành công"}
    } catch (error) {
        console.log("Lỗi xóa liên hệ: ", error);
        return {status: 500, message: "Lỗi xóa liên hệ"}
    }
}

