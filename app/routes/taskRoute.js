const router = require("express").Router();
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  getFinishedTasks,
  getUnfinishedTasks,
  deleteTask,
} = require("../controllers/taskController");
const auth = require("../middleware/auth/autheticate");

router.post("/create", auth, createTask);
router.get("/all-tasks", auth, getAllTasks);
router.get("/finished", auth, getFinishedTasks);
router.get("/unfinished", auth, getUnfinishedTasks);
router.delete("/delete-task/:title", auth, deleteTask);
router.get("/:title", auth, getTask);
router.put("/update-task/:title", auth, updateTask);

module.exports = router;
