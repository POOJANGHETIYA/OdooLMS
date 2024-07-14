// server/routes/auth.js
const express = require("express");
const router = express.Router();
const {supabase} = require("../services/supabaseClient");


router.get("/" , async (req, res) => {
  return res.status(200).json({ message: "Response from auth.js" });
});


router.post("/register", async (req, res) => {
  const { email, password, role, name } = req.body;
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
      
    });
    if (error) return res.status(400).json({ error: error.message });

    if (role === "librarian") {
      const { error } = await supabase
        .from("User")
        .insert([{ email, roleId: 2, userName: name }]);
      if (error) return res.status(400).json({ error: error.message });
    } else if(role === "admin") {
      const { error } = await supabase
        .from("User")
        .insert([{ email, roleId: 1, userName: name }]);
      if (error) return res.status(400).json({ error: error.message });
    }
    else {
      const { error } = await supabase
        .from("User")
        .insert([{ email, roleId: 3, userName: name }]);
      if (error) return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: "Registeration successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(200).json({ message: "Login Successful ", data});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Logout successful", data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
