const authorModel = require("../models/author.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config");
module.exports = {
    getAllAuthors,
    getAuthorById,
    getAuthorByEmail,
    register,
    login,
    updateAuthor,
};

async function getAllAuthors() {
    try {
        const authors = await authorModel.find().populate("contact_ref");
        return {status: 200, message: "Lấy dữ liệu thành công", data: authors};
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu authors:", error);
        return {status: 500, message: "Lỗi lấy dữ liệu ()"};
    }
}

async function getAuthorById(id) {
    try {
        const author = await authorModel.findById(id).populate("contact_ref");
        if (!author) {
            return {status: 404, message: "Không tìm thấy tác giả"};
        }
        return {
            status: 200,
            message: "Lấy dữ liệu thành công",
            data: author,
        };
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu author:", error);
        return {status: 500, message: "Lỗi lấy dữ liệu ()"};
    }
}

async function getAuthorByEmail(email) {
    try {
        const author = await authorModel.findOne({email});
        if (!author) {
            return {status: 404, message: `Không tìm thấy tài khoản ${email}`}
        }
        return {status: 200, message: `Lấy thông tin tài khoản thành công`, data: author}
    } catch (error) {
        console.log("Lỗi lấy thông tin tác giả bằng email: ", error);
        return {status: 500, message: `Lỗi lấy dữ liệu ()`}
    }
}

async function register(body) {
    try {
        const {
            name,
            email,
            password,
            image,
            email_verified,
            isThirdParty,
            contact_ref,
            role,
            status,
        } = body;

        const existingAuthor = await authorModel.findOne({email, isThirdParty});
        if (existingAuthor) {
            if (isThirdParty) {
                const accessToken = jwt.sign(
                    {
                        authorId: existingAuthor._id,
                        role: existingAuthor.role,
                    },
                    config.secret_key,
                    {expiresIn: "3d"}
                );
                const refreshToken = jwt.sign(
                    {
                        authorId: existingAuthor._id,
                        role: existingAuthor.role,
                    },
                    config.secret_key,
                    {expiresIn: "7d"}
                );
                return {
                    status: 200,
                    message: "Đăng nhập thành công",
                    access_token: accessToken,
                    refresh_token: refreshToken,
                };
            } else {
                return {
                    status: 409,
                    message: "Địa chỉ email đã được sử dụng",
                };
            }
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const author = new authorModel({
                name,
                email,
                password: hashedPassword,
                image,
                email_verified,
                isThirdParty,
                contact_ref,
                role,
                status,
            });

            await author.save();

            return {status: 200, message: "Đăng ký tài khoản thành công"};
        }
    } catch (error) {
        console.log("Lỗi khi tạo author:", error);
        return {status: 500, message: "Lỗi khi tạo tác giả ()"};
    }
}

async function login(body) {
    try {
        const {email, password} = body;

        const author = await authorModel.findOne({email, isThirdParty: false});
        // const isPasswordValid = bcrypt.compareSync(password, author.password);

        if (!author || !bcrypt.compareSync(password, author.password)) {
            return {
                status: 401,
                message: "Phương thức đăng nhập hoặc mật khẩu không đúng",
            };
        }

        const accessToken = jwt.sign(
            {
                authorId: author._id,
                role: author.role,
            },
            config.secret_key,
            {expiresIn: "3d"}
        );

        const refreshToken = jwt.sign(
            {
                authorId: author._id,
                role: author.role,
            },
            config.secret_key,
            {expiresIn: "7d"}
        );

        return {
            status: 200,
            message: "Đăng nhập thành công",
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    } catch (error) {
        console.log("Lỗi khi đăng nhập:", error);
        return {status: 500, message: "Lỗi khi đăng nhập ()"};
    }
}

async function updateAuthor(id, body) {
    try {
        const author = await authorModel.findById(id);

        if (!author) {
            return {status: 404, message: "Không tìm thấy tác giả"};
        }

        const {name, image, status} = body;

        await authorModel.findByIdAndUpdate(
            id,
            {
                name,
                image,
                status,
            },
            {new: true}
        );

        return {
            status: 200,
            message: "Cập nhật thông tin thành công",
        };
    } catch (error) {
        console.log("Lỗi khi cập nhật author:", error);
        return {status: 500, message: "Cập nhật thông tin thất bại"};
    }
}

// async function rePassword(body) {}
