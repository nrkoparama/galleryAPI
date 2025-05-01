const categoryModel = require("../models/category.model");

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
};

async function getAllCategories() {
  try {
    // const categories = await categoryModel.find({ status: { $ne: 0 } }); // $ne: not equal
    const categories = await categoryModel.find(); // $ne: not equal
    return {
      status: 200,
      message: "Lấy dữ liệu thành công",
      data: categories,
    };
  } catch (error) {
    console.log("Lỗi khi lấy dữ liệu categories:", error);
    return { status: 500, message: "Lấy dữ liệu thất bại" };
  }
}

async function getCategoryById(id) {
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return { status: 404, message: "Không tìm thấy danh mục cần tìm" };
    }
    return {
      status: 200,
      message: "Lấy dữ liệu thành công",
      data: category,
    };
  } catch (error) {
    console.log("Lỗi khi lấy dữ liệu category:", error);
    return { status: 500, message: "Lấy dữ liệu thất bại" };
  }
}

async function createCategory(body) {
  try {
    const { name, description, status } = body;

    const existedCategory = await categoryModel.findOne({ name });
    if (existedCategory) {
      return { status: 409, message: "Danh mục đã tồn tại" };
    }

    const category = new categoryModel({ name, description, status });
    await category.save();

    return {
      status: 200,
      message: "Tạo mới danh mục thành công",
    };
  } catch (error) {
    console.log("Lỗi khi tạo mới category:", error);
    return { status: 500, message: "Lỗi khi tạo mới danh mục" };
  }
}

async function updateCategory(id, body) {
  try {
    const { name, description, status } = body;
    const existedCategory = await categoryModel.findById(id);
    if (!existedCategory) {
      return { status: 404, message: "Không tìm thấy danh mục cần sửa" };
    }
    await categoryModel.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true }
    );
    return {
      status: 200,
      message: "Cập nhật danh mục thành công",
    };
  } catch (error) {
    console.log("Lỗi khi cập nhật category:", error);
    return { status: 500, message: "Lỗi khi cập nhật danh mục" };
  }
}
