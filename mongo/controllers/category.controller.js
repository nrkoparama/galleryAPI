const categoryModel = require("../models/category.model");

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};

async function getAllCategories() {
    try {
        // const categories = await categoryModel.find({ status: { $ne: 0 } }); // $ne: not equal
        const categories = await categoryModel.find();
        return {
            status: 200,
            message: "Lấy dữ liệu thành công",
            data: categories,
        };
    } catch (error) {
        console.log("Lỗi lấy dữ liệu: ", error);
        return {status: 500, message: "Lỗi lấy dữ liệu"};
    }
}

async function getCategoryById(id) {
    try {
        if (!id) {
            return {status: 401, message: "Gửi thiếu dữ liệu"}
        }
        const category = await categoryModel.findById(id);
        if (!category) {
            return {status: 404, message: "Không tìm thấy danh mục"};
        }
        return {
            status: 200,
            message: "Lấy dữ liệu thành công",
            data: category,
        };
    } catch (error) {
        console.log("Lỗi lấy dữ liệu: ", error);
        return {status: 500, message: "Lỗi lấy dữ liệu"};
    }
}

async function createCategory(body) {
    try {
        const {name, description} = body;
        if (!name || !description) {
            return {status: 401, message: "Gửi thiếu dữ liệu"}
        }

        const existingCategory = await categoryModel.findOne({name});
        if (existingCategory) {
            return {status: 409, message: "Danh mục đã tồn tại"};
        }

        const category = new categoryModel({...body});
        await category.save();

        return {
            status: 200,
            message: "Tạo mới danh mục thành công",
        };
    } catch (error) {
        console.log("Lỗi tạo mới danh mục: ", error);
        return {status: 500, message: "Lỗi tạo mới danh mục"};
    }
}

async function updateCategory(id, body) {
    try {
        const {name, description, status} = body;
        if (!id || !name || !description || !status) {
            return {status: 401, message: "Gửi thiếu dữ liệu"}
        }
        const existingCategory = await categoryModel.findById(id);
        if (!existingCategory) {
            return {status: 404, message: "Không tìm thấy danh mục"};
        }
        await categoryModel.findByIdAndUpdate(
            id,
            {name, description, status},
            {new: true}
        );
        return {
            status: 200,
            message: "Cập nhật thông tin danh mục thành công",
        };
    } catch (error) {
        console.log("Lỗi cập nhật thông tin danh mục: ", error);
        return {status: 500, message: "Lỗi cập nhật thông tin danh mục"};
    }
}

async function deleteCategory(id) {
    try {
        if (!id) {
            return {status: 401, message: "Gửi thiếu dữ liệu"}
        }
        const category = await categoryModel.findById(id);
        if (!category) {
            return {status: 404, message: "Không tìm thấy danh mục"};
        }
        await categoryModel.findByIdAndDelete(id);
        return {status: 200, message: "Xóa danh mục thành công"}
    } catch (error) {
        console.log("Lỗi xóa danh mục: ", error);
        return {status: 500, message: "Lỗi xóa danh mục"}
    }
}
