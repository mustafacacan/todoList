const router = require("express").Router();
const {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth/autheticate");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getUser);
router.put("/update-profile", auth, updateUser);
router.delete("/delete-profile", auth, deleteUser);

module.exports = router;
