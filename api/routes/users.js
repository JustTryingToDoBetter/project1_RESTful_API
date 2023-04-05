const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth")

const UserController = require("../controllers/user");



// creating a new user
router.post("/signup", UserController.signUp);

// login in  a user
router.post("/login", UserController.loginUser);



//delete users
router.delete("/:userId",checkAuth,UserController.deleteUser);



module.exports = router;