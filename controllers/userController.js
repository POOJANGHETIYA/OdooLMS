const { supabase } = require("../services/supabaseClient");

exports.getIssuedBooks = async (req, res) => {
  // get data from Borrowings table
  const { email } = req.params;
  try {
    const { data, error } = await supabase
      .from("Borrowings")
      .select("*")
      .eq("userEmail", email);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserList = async (req, res) => {
  // get data from Borrowings table
  try {
    const { data, error } = await supabase.from("User").select("*").eq("roleId", 3);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
