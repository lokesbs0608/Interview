const express = require('express');
const router = express.Router();
const  User  = require('../../models/users'); 

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(User)

    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    // Create a new user
    const newUser = await User.create({ username, password });

    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/signin', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user with the provided username and password
      const user = await User.findOne({ where: { username, password } });
  
      if (user) {
        // Successful sign-in
        return res.status(200).json({ message: 'Sign in successful', user });
      } else {
        // Invalid credentials
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
router.post('/forgot-password', async (req, res) => {
    try {
      // Generate a random 6-digit number
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
  
      // You might want to associate this code with the user in your database for verification
      // For simplicity, let's assume you send the code in the response
      return res.status(200).json({ message: 'Verification code generated successfully', code: verificationCode });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });  

module.exports = router;
