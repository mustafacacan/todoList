const { Category, Task, User } = require("../models");
const Response = require("../utils/response");
const {
  categorySchema,
  categoryUpdateSchema,
} = require("../middleware/validation/categoryValidate");
const sequelize = require("../config/database");

exports.createCategory = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { error, value } = await categorySchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error422(res);
    }

    const userId = req.user.id;

    const category = await Category.findOne({
      where: { name: value.name, userId },
    });

    if (category) {
      return new Response(null, "Bu kategori mevcut").error422(res);
    }

    const newCategory = await Category.create(
      {
        userId: userId || req.user.id,
        ...value,
      },
      { transaction }
    );

    console.log("yeni kategori", newCategory);

    await transaction.commit();
    return new Response(newCategory, "Kategori başarıyla oluşturuldu").create(
      res
    );
  } catch (error) {
    await transaction.rollback();
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return new Response(null, "Kullanıcı bulunamadı").error404(res);
    }

    const category = await Category.findAll({
      where: { userId },
      include: [
        {
          model: Task,
          as: "tasks",
          attributes: ["id", "title", "description", "isCompleted"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    console.log("kategoriler", category);

    if (!category) {
      return new Response(null, "Kategori bulunamadı").error404(res);
    }

    return new Response(category, "Kategoriler başarıyla getirildi").success(
      res
    );
  } catch (error) {
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.getCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.params;

    if (!userId) {
      return new Response(null, "Kullanıcı bulunamadı").error404(res);
    }

    const category = await Category.findOne({
      where: { name, userId },
      include: [
        {
          model: Task,
          as: "tasks",
          attributes: ["id", "title", "description", "isCompleted"],
        },
      ],
    });

    if (!category) {
      return new Response(null, "Kategori bulunamadı").error404(res);
    }

    return new Response(category, "Kategori başarıyla getirildi").success(res);
  } catch (error) {
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.updateCategory = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { name } = req.params;

    const { error, value } = await categoryUpdateSchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error422(res);
    }

    const category = await Category.findOne({
      where: { name, userId },
    });

    if (!category) {
      return new Response(null, "Kategori bulunamadı").error404(res);
    }

    await category.update(value, { transaction });
    await transaction.commit();

    return new Response(category, "Kategori başarıyla güncellendi").success(
      res
    );
  } catch (error) {
    await transaction.rollback();
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.deleteCategory = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { name } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return new Response(null, "Kullanıcı bulunamadı").error404(res);
    }

    const category = await Category.findOne({
      where: { name, userId },
      include: [
        {
          model: Task,
          as: "tasks",
        },
      ],
    });

    if (!category) {
      return new Response(null, "Kategori bulunamadı").error404(res);
    }

    if (category.tasks.length > 0) {
      return new Response(
        null,
        "Bu kategoriye ait görevler var, silinemez"
      ).error422(res);
    }

    await category.destroy({ transaction });
    await transaction.commit();

    return new Response(null, "Kategori başarıyla silindi").success(res);
  } catch (error) {
    await transaction.rollback();
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};
