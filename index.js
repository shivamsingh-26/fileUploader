const path = require("path");
const express = require("express");
const app = express();
const PORT = 8005;

const multer = require("multer");

// DEBUG: print project dirname
console.log("PROJECT ROOT:", __dirname);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads");
    console.log("Saving file to:", uploadPath); // DEBUG
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    console.log("Saving file name:", fileName); // DEBUG
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.render("homepage");
});

app.post("/upload", upload.single("ProfileImage"), (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  if (!req.file) {
    console.log("NO FILE RECEIVED");
  }

  return res.redirect("/");
});

app.listen(PORT, () => console.log(`server started at PORT: ${PORT}`));
