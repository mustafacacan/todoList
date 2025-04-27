const router = require("express").Router();

const userRoute = require("./userRoute");
const taskRoute = require("./taskRoute");
const categoryRoute = require("./categoryRoute");

router.use("/user", userRoute);
router.use("/task", taskRoute);
router.use("/category", categoryRoute);

module.exports = router;
