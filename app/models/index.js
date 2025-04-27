const Category = require("./categoryModel");
const Task = require("./taskModel");
const User = require("./userModel");

User.hasMany(Task, { foreignKey: "userId", as: "tasks" });
Task.belongsTo(User, { foreignKey: "userId", as: "user" });
Category.hasMany(Task, { foreignKey: "categoryId", as: "tasks" });
Task.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
User.hasMany(Category, { foreignKey: "userId", as: "categories" });
Category.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  Category,
  Task,
  User,
};
