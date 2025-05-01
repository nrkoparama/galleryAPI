const contactModel = require("../models/contact.model");
const contactSchema = require("../models/contact.model");

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
};

async function getAllContacts() {
  try {
    const contacts = await contactSchema.find();
    return { status: 200, message: "Lấy dữ liệu thành công", data: contacts };
  } catch (error) {
    console.error("Lỗi lấy dữ liệu contacts:", error);
    return { status: 500, message: "Lấy dữ liệu thất bại" };
  }
}

async function getContactById(id) {
  try {
    const contact = await contactSchema.findById(id);
    if (!contact) {
      return { status: 404, message: "Không tìm thấy liên hệ" };
    }
    return { status: 200, message: "Lấy dữ liệu thành công", data: contact };
  } catch (error) {
    console.error("Lỗi lấy dữ liệu contact:", error);
    return { status: 500, message: "Lấy dữ liệu thất bại" };
  }
}

async function createContact(body) {
  try {
    const { facebook, instagram, x, linkedIn } = body;
    const newContact = new contactSchema({
      facebook,
      instagram,
      x,
      linkedIn,
    });
    await newContact.save();
    return { status: 200, message: "Tạo liên hệ thành công" };
  } catch (error) {
    console.error("Lỗi tạo contact:", error);
    return { status: 500, message: "Tạo liên hệ thất bại" };
  }
}

async function updateContact(id, body) {
  try {
    const contact = await contactModel.findById(id);
    if (!contact) {
      return { status: 404, message: "Không tìm thấy liên hệ" };
    }

    const { facebook, instagram, x, linkedIn } = body;
    await contactSchema.findByIdAndUpdate(
      id,
      { facebook, instagram, x, linkedIn },
      { new: true }
    );
    return { status: 200, message: "Cập nhật liên hệ thành công" };
  } catch (error) {
    console.error("Lỗi cập nhật contact:", error);
    return { status: 500, message: "Cập nhật liên hệ thất bại ()" };
  }
}
