const authorModel = require("../models/author.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config");
module.exports = {
    getAllAuthors, getAuthorById, getAuthorByEmail, register, login, thirdPartyLogin, updateAuthor,
};

async function getAllAuthors() {
    try {
        const authors = await authorModel.find().populate("contact_ref");
        return {status: 200, message: "Lấy dữ liệu thành công", data: authors};
    } catch (error) {
        console.log("Lỗi lấy dữ liệu: ", error);
        return {status: 500, message: "Lỗi lấy dữ liệu"};
    }
}

async function getAuthorById(id) {
    try {
        const author = await authorModel.findById(id).populate("contact_ref");
        if (!author) {
            return {status: 404, message: "Không tìm thấy tác giả"};
        }
        return {
            status: 200, message: "Lấy dữ liệu thành công", data: author,
        };
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu:", error);
        return {status: 500, message: "Lỗi lấy dữ liệu"};
    }
}

async function getAuthorByEmail(email) {
    try {
        const author = await authorModel.findOne({email});
        if (!author) {
            return {status: 404, message: `Không tìm thấy tác giả`}
        }
        return {status: 200, message: "Lấy dữ liệu thành công"}
    } catch (error) {
        console.log("Lỗi lấy dữ liệu: ", error);
        return {status: 500, message: `Lỗi lấy dữ liệu`}
    }
}

async function register(body) {
    try {
        const {email, password, isThirdParty} = body; // isThirdParty === false
        const existingAuthor = await authorModel.findOne({email, isThirdParty});
        if (existingAuthor) {
            return {status: 409, message: "Địa chỉ email đã được sử dụng",};
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const author = new authorModel({...body, password: hashedPassword,});
        await author.save();

        return {status: 200, message: "Đăng ký tài khoản thành công"};
    } catch (error) {
        console.log("Lỗi khi tạo tài khoản:", error);
        return {status: 500, message: "Lỗi khi tạo tài khoản"};
    }
}

async function login(body) {
    try {
        const {email, password} = body;

        const author = await authorModel.findOne({email, isThirdParty: false}).populate("contact_ref");

        // const isPasswordValid = bcrypt.compareSync(password, author.password);
        // nếu không có author thì author.password === null | findOne -> {} || null
        if (!author || !bcrypt.compareSync(password, author.password)) {
            return {
                status: 401, message: "Phương thức đăng nhập hoặc mật khẩu không đúng",
            };
        }

        const accessToken = jwt.sign({
            authorId: author._id, role: author.role,
        }, config.secret_key, {expiresIn: "3d"});

        const refreshToken = jwt.sign({
            authorId: author._id, role: author.role,
        }, config.secret_key, {expiresIn: "7d"});

        return {
            status: 200, message: "Đăng nhập thành công", access_token: accessToken, refresh_token: refreshToken,
        };
    } catch (error) {
        console.log("Lỗi đăng nhập: ", error);
        return {status: 500, message: "Lỗi đăng nhập"};
    }
}

async function thirdPartyLogin(body) {
    try {
        const {email, isThirdParty} = body; // isThirdParty === true

        const existingAuthor = await authorModel.findOne({email, isThirdParty}).populate("contact_ref");
        if (existingAuthor) {
            const accessToken = jwt.sign({
                authorId: existingAuthor._id, role: existingAuthor.role,
            }, config.secret_key, {expiresIn: "3d"});
            const refreshToken = jwt.sign({
                authorId: existingAuthor._id, role: existingAuthor.role,
            }, config.secret_key, {expiresIn: "7d"});
            return {
                status: 200, message: "Đăng nhập thành công", access_token: accessToken, refresh_token: refreshToken
            }
        }

        const newAuthor = new authorModel({...body});
        await newAuthor.save();

        const accessToken = jwt.sign({
            authorId: newAuthor._id, role: newAuthor.role,
        }, config.secret_key, {expiresIn: "3d"});
        const refreshToken = jwt.sign({
            authorId: newAuthor._id, role: newAuthor.role,
        }, config.secret_key, {expiresIn: "7d"});
        return {status: 200, message: "Đăng nhập thành công", access_token: accessToken, refresh_token: refreshToken}
    } catch (error) {
        console.log("Lỗi đăng nhập: ", error);
        return {status: 500, message: "Lỗi đăng nhập"}
    }
}

async function updateAuthor(id, body) {
    try {
        const author = await authorModel.findById(id);

        if (!author) {
            return {status: 404, message: "Không tìm thấy tác giả"};
        }

        const {name, image, status} = body;

        await authorModel.findByIdAndUpdate(id, {
            name, image, status,
        }, {new: true});

        return {
            status: 200, message: "Cập nhật thông tin thành công",
        };
    } catch (error) {
        console.log("Lỗi khi cập nhật author:", error);
        return {status: 500, message: "Cập nhật thông tin thất bại"};
    }
}

// async function rePassword(body) {}
