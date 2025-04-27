const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT || 3000,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      //  idle: 10000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync({ force: false });
    console.log("Dtabase bağlantısı başarılı");
  })
  .catch((error) => {
    console.log("Database bağlantısı başarısız", error);
    //process.exit(1);
  });

module.exports = sequelize;
