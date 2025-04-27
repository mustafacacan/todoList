const { User, Task, Category } = require("../models");
const {
  loginSchema,
  registerSchema,
  updateSchema,
} = require("../middleware/validation/userValidate");
const Response = require("../utils/response");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
require("dotenv").config();

exports.register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error422(res);
    }

    const user = await User.findOne({ where: { email: value.email } });

    if (user) {
      return new Response(null, "Bu e-posta adresi zaten kayıtlı").error422(
        res
      );
    }

    const token = jwt.sign({ id: value.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const newUser = await User.create(value, { transaction });
    await transaction.commit();

    return new Response({ newUser, token }, "Kayıt başarılı").create(res);
  } catch (error) {
    await transaction.rollback();
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error422(res);
    }

    const user = await User.findOne({ where: { email: value.email } });

    if (!user) {
      return new Response(null, "E-posta adresi veya şifre hatalı").error400(
        res
      );
    }

    const isValidPassword = await user.isValidPassword(value.password);

    if (!isValidPassword) {
      return new Response(null, "E-posta adresi veya şifre hatalı").error422(
        res
      );
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return new Response({ user, token }, "Giriş başarılı").success(res);
  } catch (error) {
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.updateUser = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { error, value } = updateSchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error422(res);
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return new Response(null, "Kullanıcı bulunamadı").error404(res);
    }

    await user.update(value, { transaction });
    await transaction.commit();

    return new Response(user, "Kullanıcı bilgileri güncellendi").success(res);
  } catch (error) {
    await transaction.rollback();
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Task,
          as: "tasks",
          include: [
            {
              model: Category,
              as: "category",
            },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!user) {
      return new Response(null, "Kullanıcı bulunamadı").error404(res);
    }

    return new Response(user, "Kullanıcı bilgileri").success(res);
  } catch (error) {
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunuc hatası : ${error.message}`).error500(res);
  }
};

exports.deleteUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;

    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Task,
          as: "tasks",
        },
        {
          model: Category,
          as: "categories",
        },
      ],
    });

    if (!user) {
      return new Response(null, "Kullanıcı bulunamadı").error404(res);
    }

    await Task.destroy({ where: { userId }, transaction });
    await Category.destroy({ where: { userId }, transaction });
    await user.destroy({ transaction });

    await transaction.commit();

    return new Response(null, "Kullanıcı ve ilişkili veriler silindi").success(
      res
    );
  } catch (error) {
    await transaction.rollback();
    console.log(`Kullanıcı silinirken hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`);
  }
};
