const jwt = require("jsonwebtoken");
const Response = require("../../utils/response");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  try {
    const headers = req.headers.authorization;

    if (!headers || !headers.startsWith("Bearer ")) {
      return new Response(null, "Token bulunamadı").error401(res);
    }

    const token = headers.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return new Response(null, "Token geçersiz").error401(res);
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(`Hata oluştu: ${error.message}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

module.exports = authenticate;
