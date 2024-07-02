const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User.js");
const { Newsshortsshorts } = require("../models/Newsshorts.js");

const auth = require("../middlewares/auth.js");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    console.log("New user added:", newUser.toJSON());

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res
        .status(200)
        .send({ message: "Invalid password", success: false });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, "aditya", {
      expiresIn: "1d",
    });
    res.send({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
});

exports.getFeed = async (req, res) => {
  try {
    const { filter, search } = req.query;
    let filters = filter ? JSON.parse(filter) : {};
    let searchParams = search ? JSON.parse(search) : {};

    let query = {
      where: {},
      include: [
        {
          model: Newsshorts,
          as: "Newsshorts",
          where: { ...filters, ...searchParams },
        },
      ],
    };

    const feed = await Newsshorts.findAll(query);

    return res.status(200).json({
      message: "Feed fetched successfully",
      data: feed,
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = router;
