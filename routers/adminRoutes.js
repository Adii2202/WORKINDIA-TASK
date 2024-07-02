// require('dotenv').config();
const express = require("express");
const router = express.Router();
const Newsshorts = require("../models/Newsshorts.js");
const { auth, isAdmin } = require("../middlewares/auth.js");

router.use(auth);
router.use(isAdmin);

router.post("/news", async (req, res) => {
  try {
    const apiKey = req.headers["admin-api-key"];
    if (apiKey !== "admin123") {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { title, articleId, author, content, publishDate } = req.body;
    const existingArticle = await News.findOne({ where: { articleId } });

    if (existingArticle) {
      return res
        .status(400)
        .json({ message: "Article ID already exists", success: false });
    }

    const newArticle = await Newsshorts.create({
      title,
      articleId,
      author,
      content,
      publishDate,
    });

    return res.status(201).json({
      message: "News article added successfully",
      success: true,
      data: newArticle,
    });
  } catch (error) {
    console.error("Error adding news article:", error);
    return res
      .status(500)
      .json({ message: error.message, data: error, success: false });
  }
});

router.get("/shorts/filter", async (req, res) => {
  try {
    const apiKey = req.headers["admin-api-key"];
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const { filter, search } = req.query;
    const filters = JSON.parse(filter);
    const searchParams = JSON.parse(search);

    let query = {
      where: {},
      include: [
        {
          model: News,
          as: "news",
          where: {},
        },
      ],
    };

    if (filters.category) query.where.category = filters.category;
    if (filters.publish_date) query.where.publish_date = filters.publish_date;
    if (filters.upvote)
      query.where.upvote = { [Sequelize.Op.gte]: filters.upvote };

    if (searchParams.title)
      query.include.where.title = {
        [Sequelize.Op.like]: `%${searchParams.title}%`,
      };
    if (searchParams.keyword)
      query.include.where.content = {
        [Sequelize.Op.like]: `%${searchParams.keyword}%`,
      };
    if (searchParams.author) query.include.where.author = searchParams.author;

    const shorts = await News.findAll(query);

    if (shorts.length === 0) {
      return res.status(400).json({
        status: "No short matches your search criteria",
        status_code: 400,
      });
    }

    const response = shorts.map((short) => ({
      short_id: short.id,
      category: short.category,
      title: short.title,
      author: short.author,
      publish_date: short.publish_date,
      content: short.content,
      actual_content_link: short.actual_content_link,
      image: short.image,
      votes: {
        upvote: short.upvote,
        downvote: short.downvote,
      },
      contains_title: searchParams.title
        ? short.title.includes(searchParams.title)
        : false,
      contains_content: searchParams.keyword
        ? short.content.includes(searchParams.keyword)
        : false,
      contains_author: searchParams.author
        ? short.author === searchParams.author
        : false,
    }));

    return res.json(response);
  } catch (error) {
    console.error("Error filtering shorts:", error);
    return res
      .status(500)
      .json({ message: error.message, data: error, success: false });
  }
});

router.get("/shorts/:shortId", async (req, res) => {
  try {
    const apiKey = req.headers["admin-api-key"];
    if (apiKey !== "admin123") {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const { shortId } = req.params;
    const short = await News.findByPk(shortId);

    if (!short) {
      return res
        .status(404)
        .json({ message: "Short not found", success: false });
    }

    return res.status(200).json({
      message: "Short details retrieved successfully",
      success: true,
      data: short,
    });
  } catch (error) {
    console.log(error);
    console.error("Error retrieving short:", error);
    return res
      .status(500)
      .json({ message: error.message, data: error, success: false });
  }
});
module.exports = router;
