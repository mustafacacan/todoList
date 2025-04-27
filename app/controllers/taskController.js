const sequelize = require("../config/database");
const { Task, User, Category } = require("../models");
const Response = require("../utils/response");
const {
  taskSchema,
  taskUpdateSchema,
} = require("../middleware/validation/task.validate");
const { TIME } = require("sequelize");

exports.createTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { error, value } = await taskSchema.validate(req.body);

    if (error) {
      return new Response(null, error.details[0].message).error422(res);
    }

    const task = await Task.findOne({
      where: {
        title: value.title,
        userId: req.user.id,
      },
    });

    if (task) {
      return new Response(null, "Bu görev mevcut").error422(res);
    }

    const category = await Category.findOne({
      where: { id: value.categoryId },
    });

    if (!category) {
      await Category.create({
        name: "Yapılacaklar",
        userId: req.user.id,
      });
    }

    const newTask = await Task.create(
      {
        ...value,
        userId: req.user.id,
        startDate: value.startDate
          ? new Date(value.startDate)
          : new Date(Date.now()),
        endDate: value.endDate,
      },
      { transaction }
    );

    await transaction.commit();

    return new Response(newTask, "Görev başarıyla oluşturuldu").create(res);
  } catch (error) {
    await transaction.rollback();
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const userId = req.user.id;

    const tasks = await Task.findAndCountAll({
      where: { userId },
      limit,
      offset,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(tasks.count / limit);

    const response = {
      tasks: tasks.rows,
      totalPages,
      currentPage: page,
      totalTasks: tasks.count,
    };

    return new Response(response, "Görevler başarıyla getirildi").success(res);
  } catch (error) {
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.getTask = async (req, res) => {
  try {
    const { title } = req.params;
    const userId = req.user.id;

    if (!userId) {
      return new Response(null, "Kullanıcı bulunamadı").error404(res);
    }

    const task = await Task.findOne({
      where: { title, userId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!task) {
      return new Response(null, "Görev bulunamadı").error404(res);
    }

    return new Response(task, "Görev başarıyla getirildi").success(res);
  } catch (error) {
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.updateTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { error, value } = await taskUpdateSchema.validate(req.body);
    if (error) {
      return new Response(null, error.details[0].message).error422(res);
    }

    const { title } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({
      where: { title: title, userId },
    });

    if (!task) {
      return new Response(null, "Görev bulunamadı").error404(res);
    }

    await task.update(value, { transaction });
    await transaction.commit();

    return new Response(task, "Görev başarıyla güncellendi").success(res);
  } catch (error) {
    await transaction.rollback();
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.deleteTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { title } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({
      where: { title, userId },
    });

    if (!task) {
      return new Response(null, "Görev bulunamadı").error404(res);
    }

    await task.destroy({ transaction });
    await transaction.commit();

    return new Response(null, "Görev silindi").success(res);
  } catch (error) {
    await transaction.rollback();
    console.log(`hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}}`).error500(res);
  }
};

exports.getFinishedTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return new Response(null, "Kullanıcı bulunamadı").error404(res);
    }

    const finished = await Task.findAll({
      where: { userId, isCompleted: true },
    });

    console.log("userId : ", userId);

    if (!finished) {
      return new Response(null, "Henüz tamamlanmış görev yok").error404(res);
    }

    return new Response(
      finished,
      "Tamamlanmış görevler başarıyla getirildi"
    ).success(res);
  } catch (error) {
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.getUnfinishedTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return new Response(null, "Kullanıcı bulunamadı").error404(res);
    }

    const unfinished = await Task.findAll({
      where: { userId, isCompleted: false },
    });

    if (!unfinished) {
      return new Response(null, "Henüz tamamlanmamış görev yok").error404(res);
    }

    return new Response(
      unfinished,
      "Tamamlanmamış görevler başarıyla getirildi"
    ).success(res);
  } catch (error) {
    console.log(`Hata oluştu: ${error}`);
    return new Response(null, `Sunucu hatası: ${error.message}`).error500(res);
  }
};
