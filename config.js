require("dotenv").config();
console.log(process.env.MONGODB_CLOUD_URI)


module.exports = {
    mongodb_cloud_uri: process.env.MONGODB_CLOUD_URI,
    secret_key: process.env.SECRET_KEY,
}
