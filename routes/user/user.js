const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const { encryptData, decryptData } = require("../../enc");
const bcrypt = require("bcrypt");

const Transporter = require("../../mailer");

router.post("/register", async (req, res) => {
  try {
    let { username, password } = req.body;
    console.log(User);

    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Generate a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the new password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ username, password:hashedPassword });

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser.username });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user with the provided username and password
    const user = await User.findOne({ where: { username, password } });

    if (user) {
      // Successful sign-in
      return res.status(200).json({ message: "Sign in successful", user });
    } else {
      // Invalid credentials
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/forgot-password", async (req, res) => {
  const { username } = req.body;
  try {
    //Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      const mailOptions = {
        from: "lokeshbs0608@gmail.com",
        to: username,
        subject: "Password Reset OTP",
        text: `Your OTP code is ${verificationCode}.`,
      };
      Transporter.sendMail(mailOptions, (error, _info) => {
        if (error) {
          console.error("Error sending email: ", error);
          res.status(500).send({ message: "Failed to send OTP" });
        } else {
          res.status(200).send({
            message: "OTP sent successfully",
            code: encryptData(verificationCode),
          });
        }
      });
    } else {
      res.status(200).json({ message: "User not exist" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/verify-otp", async (req, res) => {
  const { username, verification_code, password, token } = req.body;
  try {
    //Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      if (verification_code === decryptData(token)) {
        // Generate a salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the new password with the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);
        await existingUser.update({ password: hashedPassword });
        res.status(200).json({ message: "Password reset successful" });
      }
    } else {
      res.status(200).json({ message: "User not exist" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
