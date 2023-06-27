const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Replace with your web application's URL
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// API endpoint to save the news
app.post("/api/save-news", (req, res) => {
  try {
    const { source, imgSrc, title, desc, author, publishedDate } = req.body;

    // Read the contents of the db.json file
    const db = JSON.parse(fs.readFileSync("db.json", "utf8"));

    // Add the new news object to the "news" array
    db.news.push({
      source,
      imgSrc,
      title,
      desc,
      author,
      publishedDate,
    });

    // Write the updated data back to the db.json file
    fs.writeFileSync("db.json", JSON.stringify(db));

    res.status(200).json({ message: "News saved successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while saving the news." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
