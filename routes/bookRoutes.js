const router = require("express").Router();
const { routes } = require("../app");
const {
  getBooks,
  addBook,
  addBookFromApi,
  getBook,
  updateBook,
  issueBook,
  returnBook,
  getAvailablebooks,
  getDashboardData,
} = require("../controllers/bookController");

router.get("/", async (req, res) => {
  return res.status(200).json({ message: "Response from bookRoutes.js" });
});

router.get("/getBooks", getBooks);
router.get("/getAvailablebooks",getAvailablebooks );
router.post("/addBook", addBook);
router.post("/addBookFromApi", addBookFromApi);
router.get("/getBook/:isbn", getBook);
router.post("/updateBook/:isbn", updateBook);
router.post("/issueBook", issueBook);
router.post("/returnBook", returnBook);
router.get("/getDashboard", getDashboardData);

module.exports = router;
