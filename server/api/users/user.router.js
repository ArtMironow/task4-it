const {
  createUser,
  getUsersByUserId,
  getUsers,
  updateUser,
  deleteUser,
  login,
} = require("./user.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/signup", createUser);
router.get("/getusers", getUsers);
router.get("/:id", checkToken, getUsersByUserId);
router.patch("/update", updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/login", login);
module.exports = router;
