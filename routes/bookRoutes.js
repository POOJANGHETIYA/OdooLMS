const router = require("express").Router();
const {
  getBooks,
  addBook,
  addBookFromApi,
  getBook,
  updateBook,
  issueBook,
  returnBook,
  getAvailablebooks,
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

module.exports = router;
