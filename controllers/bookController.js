const { supabase } = require("../services/supabaseClient");
const moment = require("moment");
const axios = require("axios");

/* Table name : Books 

isbn (Primary Key)	
text
string	

title	
text
string	

author	
text
string	

publisher	
text
string	

genre	
text
string	

available	
boolean
boolean	

image
text
string

*/

exports.getBooks = async (req, res) => {
  try {
    const { data, error } = await supabase.from("Books").select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.addBook = async (req, res) => {
  const { isbn, title, author, publisher, genre, available, image } = req.body;

  // validate the body
  if (!isbn || !title || !author) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  try {
    // check if book already exists by isbn
    const { data: bookData, error: bookError } = await supabase
      .from("Books")
      .select("isbn")
      .eq("isbn", isbn)
      .single();

    if (bookData) {
      return res.status(400).json({ error: "Book already exists" });
    }

    const { data, error } = await supabase
      .from("Books")
      .insert([{ isbn, title, author, publisher, genre, available, image }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// exports.addBookFromApi = async (req, res) => {
//   const { isbn } = req.body;

//   // validate the body
//   if (!isbn) {
//     return res
//       .status(400)
//       .json({ error: "Please provide all required fields" });
//   }

//   try {
//     // check if book already exists by isbn
//     const { data: bookData, error: bookError } = await supabase
//       .from("Books")
//       .select("isbn")
//       .eq("isbn", isbn)
//       .single();

//     if (bookData) {
//       return res.status(400).json({ error: "Book already exists" });
//     }

//     //  https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}
//     // get data from this api
//     const { data: bookDataFromApi } = await axios.get(
//       `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
//     );
//     const isbn =
//       bookDataFromApi.items[0].volumeInfo.industryIdentifiers[1].identifier;
//     const title = bookDataFromApi.items[0].volumeInfo.title;
//     const author = bookDataFromApi.items[0].volumeInfo.authors[0];
//     const publisher = bookDataFromApi.items[0].volumeInfo.publisher || "";
//     const genre = bookDataFromApi.items[0].volumeInfo.categories[0] || "";
//     const image =
//       bookDataFromApi.items[0].volumeInfo.imageLinks.thumbnail || "";
//     const { data, error } = await supabase
//       .from("Books")
//       .insert([{ isbn, title, author, publisher, genre, image }]);
//     if (error) return res.status(400).json({ error: error.message });

//     return res.status(201).json(data);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

exports.addBookFromApi = async (req, res) => {
  const { isbn } = req.body;

  // Validate the request body
  if (!isbn) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  try {
    // Check if the book already exists by ISBN
    const { data: existingBook, error: bookError } = await supabase
      .from("Books")
      .select("isbn")
      .eq("isbn", isbn)
      .single();

    if (existingBook) {
      return res.status(400).json({ error: "Book already exists" });
    }

    // Get book data from the external API

    const { data: apiResponse } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );

    if (!apiResponse.items || !apiResponse.items[0].volumeInfo) {
      return res
        .status(404)
        .json({ error: "Book information not found in external API" });
    }

    const volumeInfo = apiResponse.items[0].volumeInfo;

    // Extract book details
    const bookIsbn =
      volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")
        ?.identifier || isbn;
    const title = volumeInfo.title || "Unknown Title";
    const author = volumeInfo.authors
      ? volumeInfo.authors[0]
      : "Unknown Author";
    const publisher = volumeInfo.publisher || "Unknown Publisher";
    const genre = volumeInfo.categories
      ? volumeInfo.categories[0]
      : "Unknown Genre";
    const image = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : "";

    // Insert new book into the database
    const { data: insertData, error: insertError } = await supabase
      .from("Books")
      .insert([{ isbn: bookIsbn, title, author, publisher, genre, image }]);

    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }

    return res.status(201).json({ success: true, data: insertData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getBook = async (req, res) => {
  const { isbn } = req.params;
  try {
    const { data, error } = await supabase
      .from("Books")
      .select("*")
      .eq("isbn", isbn);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const { isbn } = req.params;
  try {
    const { data, error } = await supabase
      .from("Books")
      .delete()
      .eq("isbn", isbn);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  const { isbn } = req.params;
  const { title, author, publisher, genre, available, image } = req.body;
  try {
    const { data, error } = await supabase
      .from("Books")
      .update({ title, author, publisher, genre, available, image })
      .eq("isbn", isbn);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.issueBook = async (req, res) => {
  let { isbn, days, email } = req.body;
  const borrowDate = new Date();

  days = parseInt(days);

  // use moment.js to add days to the current date
  const dueDate = moment(borrowDate).add(days, "days").toDate();

  // validate the body
  if (!isbn || !days || !email) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  try {
    // check if book is available
    const { data, error } = await supabase
      .from("Books")
      .select("available")
      .eq("isbn", isbn)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Book not found" });

    if (!data) {
      return res
        .status(200)
        .json({ success: false, message: "Book not available" });
    }

    const borrowData = {
      isbn,
      userEmail: email,
      borrowDate,
      dueDate,
    };

    // insert borrow data
    const { error: borrowError } = await supabase
      .from("Borrowings")
      .insert([borrowData]);

    if (borrowError) throw borrowError;

    // update book availability
    const { error: updateError } = await supabase
      .from("Books")
      .update({ available: false })
      .eq("isbn", isbn);

    if (updateError)
      return res.status(400).json({ error: updateError.message });

    return res
      .status(200)
      .json({ message: "Book issued successfully", borrowData });
  } catch (error) {
    console.log("error", error);

    return res.status(500).json({ error: error.message });
  }
};

// exports.returnBook = async (req, res) => {
//   const { isbn, email } = req.body;
//   const returnDate = new Date();

//   // validate the body
//   if (!isbn || !email) {
//     return res
//       .status(400)
//       .json({ error: "Please provide all required fields" });
//   }

//   try {
//     // check if book is available
//     const { data, error } = await supabase
//       .from("Books")
//       .select("available")
//       .eq("isbn", isbn)
//       .single();

//     if (error) throw error;
//     if (!data) return res.status(404).json({ error: "Book not found" });

//     if (data.available) {
//       return res.status(200).json({ message: "Book already returned" });
//     }

//     // update book availability
//     const { error: updateError } = await supabase
//       .from("Books")
//       .update({ available: true })
//       .eq("isbn", isbn);

//     if (updateError)
//       return res.status(400).json({ error: updateError.message });

//     // process the late fee if any. If return date is greater than due date, calculate the difference in days and charge 10 per day and update lateFees in Borrowings table and return date
//     const { data: borrowData, error: borrowError } = await supabase
//       .from("Borrowings")
//       .select("*")
//       .eq("isbn", isbn)
//       .eq("userEmail", email)
//       .single();

//     if (borrowError) throw borrowError;

//     const { dueDate } = borrowData;
//     const diffDays = moment(returnDate).diff(dueDate, "days");
//     let lateFees = 0;

//     if (diffDays > 0) {
//       lateFees = diffDays * 10;
//     }

//     const { error: lateFeeError } = await supabase
//       .from("Borrowings")
//       .update({ returnDate, lateFees })
//       .eq("isbn", isbn)
//       .eq("userEmail", email);

//     if (lateFeeError) throw lateFeeError;

//     return res.status(200).json({ message: "Book returned successfully" });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

exports.returnBook = async (req, res) => {
  const { isbn } = req.body;
  const returnDate = new Date();

  // Validate the request body
  if (!isbn) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  try {
    // Check if book is available
    const { data: bookData, error: bookError } = await supabase
      .from("Books")
      .select("available")
      .eq("isbn", isbn)
      .single();

    if (bookError) throw bookError;
    if (!bookData)
      return res.status(404).json({ success: false, error: "Book not found" });

    if (bookData.available) {
      return res
        .status(200)
        .json({ success: false, message: "Book already returned" });
    }

    // Parallelize updating book availability and fetching borrowing record
    const [updateBookResult, borrowResult] = await Promise.all([
      supabase.from("Books").update({ available: true }).eq("isbn", isbn),
      supabase.from("Borrowings").select("*").eq("isbn", isbn).single(),
    ]);

    if (updateBookResult.error) {
      throw updateBookResult.error;
    }

    const { data: borrowData, error: borrowError } = borrowResult;
    if (borrowError) throw borrowError;

    // Calculate late fees if any
    const { dueDate } = borrowData;
    const diffDays = moment(returnDate).diff(dueDate, "days");
    const lateFees = diffDays > 0 ? diffDays * 10 : 0;

    // Update borrowing record with return date and late fees
    const { error: lateFeeError } = await supabase
      .from("Borrowings")
      .update({ lateFees })
      .eq("isbn", isbn)
      .eq("userEmail", email);

    if (lateFeeError) throw lateFeeError;

    const updateBorrowingResult = await supabase
      .from("Borrowings")
      .update({ returnDate: returnDate })
      .eq("isbn", isbn)
      .eq("userEmail", email); // Assuming email is retrieved somewhere

    if (updateBorrowingResult.error) {
      throw updateBorrowingResult.error;
    }
    return res
      .status(200)
      .json({ success: true, message: "Book returned successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAvailablebooks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Books")
      .select("*")
      .eq("available", true);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
