const router = require("express").Router();
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const auth = require("../middleware/auth/autheticate");

router.post("/create", auth, createCategory);
router.get("/all", auth, getCategories);
router.get("/:name", auth, getCategory);
router.put("/update/:name", auth, updateCategory);
router.delete("/delete/:name", auth, deleteCategory);

module.exports = router;
