const router = require("express").Router();
const {getIssuedBooks, getUserList} = require("../controllers/userController");

router.get("/", async (req, res) => {
  return res.status(200).json({ message: "Response from userRoutes.js" });
});


router.get("/issuedBooks/:email", getIssuedBooks);
router.get("/userList", getUserList);

module.exports = router;
