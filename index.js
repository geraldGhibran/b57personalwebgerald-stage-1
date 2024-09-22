const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("cookie-session");
const flash = require("express-flash");
const { Sequelize, QueryTypes } = require("sequelize");
const admin = require("firebase-admin");
const config = require("./config/config.json");
const sequelize = new Sequelize(config.development);

const multer = require("multer");
const serviceAccount = require("./assets/js/service-account");

const upload = multer({ storage: multer.memoryStorage() });

require("dotenv").config();

const projectModel = require("./models").project;
const userModel = require("./models").user;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "my-session",
    secret: "ewVsqWOyeb",
    saveUninitialized: true,
    rolling: true,
    resave: false,
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: false, 
      secure: false, 
      sameSite: "None",
    },
  })
);
app.use(flash());

app.get("/", home);
app.get("/project", project);
app.get("/add-project", addProjectView);
app.post("/project", upload.single("image"), addProject);
app.get("/delete-project/:id/imageId/:imageId", deleteProject);
app.get("/edit-project/:id", editProjectView);
app.get("/edit-project/:id", convertDate);
app.post(
  "/edit-project/:id/imageId/:imageId",
  upload.single("image"),
  editProject
);
app.get("/contact", contact);
app.get("/testimonial", testimonial);
app.get("/project-detail/:id", projectDetail);

app.get("/login", loginView);
app.get("/register", registerView);

app.post("/register", register);
app.post("/login", login);
app.get("/logout", logout);

let {
  storageBucket
} = process.env;



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: storageBucket,
});

const bucket = admin.storage().bucket();

function loginView(req, res) {
  res.render("login");
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      req.flash("error", "Email / password salah!");
      return res.redirect("/login");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      req.flash("error", "Email / password salah!");
      return res.redirect("/login");
    }

    req.session.user = user;

    req.flash("success", "Login berhasil!");

    res.redirect("/");
  } catch (error) {
    req.flash("error", "Something went wrong!");
    res.redirect("/");
  }
}

function registerView(req, res) {
  res.render("register");
}

function logout(req, res) {
  req.session = null;
  res.redirect("/");
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    req.flash("success", "Register berhasil!");
    res.redirect("/register");
  } catch (error) {
    req.flash("error", "Register gagal!");
    res.redirect("/register");
  }
}

async function home(req, res) {
  const user = req.session.user;
  const result = await projectModel.findAll({
    include: [
      {
        model: userModel,
      },
    ],
  });

  res.render("index", { data: result, user });
}

async function project(req, res) {
  const result = await projectModel.findAll();
  const user = req.session.user;

  res.render("project", { data: result, user });
}

async function deleteProject(req, res) {
  const { id, imageId } = req.params;

  let result = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  if (!result) return res.render("not-found");

  await projectModel.destroy({
    where: {
      id: id,
    },
  });

  bucket.file(imageId).delete();
  res.redirect("/");
}

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

async function addProject(req, res) {
  const imagePath = req.file.path;
  const user = req.session.user;
  const file = req.file;
  const dateTime = giveCurrentDateTime();

  if (!user) {
    return res.redirect("/login");
  }

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const fileRef = bucket.file(file.originalname);
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-17-2025",
    });
    await fileRef.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      resumable: false,
    });
    const {
      projectName,
      description,
      startDate,
      endDate,
      nodejs,
      typescript,
      reactjs,
      nextjs,
    } = req.body;
    await projectModel.create({
      projectName: projectName,
      startDate: startDate,
      endDate: endDate,
      description: description,
      technologies: [nodejs, typescript, reactjs, nextjs],
      createdAt: "2024-07-15T16:11:25.556Z",
      image: url,
      imageId: file.originalname,
      userId: user.id,
      author: user.name,
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error: ${error.message}`);
  }
}

async function editProjectView(req, res) {
  const { id } = req.params;
  const user = req.session.user;

  const result = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  if (!user) {
    return res.redirect("/login");
  }

  if (!result) return res.render("not-found");

  res.render("edit-project", {
    data: result,
    startDate: convertDate(result.startDate),
    endDate: convertDate(result.endDate),
    typescript: result.technologies.indexOf("typescript") !== -1,
    nodejs: result.technologies.indexOf("nodejs") !== -1,
    nextjs: result.technologies.indexOf("nextjs") !== -1,
    reactjs: result.technologies.indexOf("reactjs") !== -1,
  });

  if (!user) {
    return res.redirect("/login");
  }
}

async function editProject(req, res) {
  const { id, imageId } = req.params;
  const file = req.file;

  const {
    projectName,
    description,
    startDate,
    endDate,
    image,
    nodejs,
    typescript,
    reactjs,
    nextjs,
  } = req.body;

  try {
    const fileRef = bucket.file(imageId);
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-17-2025",
    });
    await fileRef.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      resumable: false,
    });
    const project = await projectModel.findOne({
      where: {
        id: id,
      },
    });

    if (!project) return res.render("not-found");

    project.projectName = projectName;
    project.description = description;
    project.startDate = startDate;
    project.endDate = endDate;
    project.image = url;
    project.imageId = file.originalname;

    project.technologies = [nodejs, typescript, reactjs, nextjs];

    await project.save();

    res.redirect("/");
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

function addProjectView(req, res) {
  const user = req.session.user;
  res.render("add-project", { user });
}

function contact(req, res) {
  res.render("contact");
}

function testimonial(req, res) {
  const user = req.session.user;
  res.render("testimonial", { user });
}

async function projectDetail(req, res) {
  const user = req.session.user;
  const { id } = req.params;
  const result = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  const inputDateString = result.createdAt;

  const inputDate = new Date(inputDateString);

  const currentDate = new Date();

  const diffYears = currentDate.getFullYear() - inputDate.getFullYear();
  const diffMonths =
    currentDate.getMonth() - inputDate.getMonth() + diffYears * 12;

  const dayDifference = currentDate.getDate() - inputDate.getDate();
  const totalMonthDifference = dayDifference < 0 ? diffMonths - 1 : diffMonths;

  if (!result) return res.render("not-found");
  res.render("project-detail", {
    data: result,
    startDate: convertDate(result.startDate),
    endDate: convertDate(result.endDate),
    createdDate: totalMonthDifference + " months ago",
    nodejs: result.technologies.includes("nodejs") ? "nodejs" : "",
    typescript: result.technologies.includes("typescript") ? "typescript" : "",
    reactjs: result.technologies.includes("reactjs") ? "reactjs" : "",
    nextjs: result.technologies.includes("nextjs") ? "nextjs" : "",
    user,
  });
}

function convertDate(dates) {
  // Original date string
  const dateString = dates;

  // Create a new Date object
  const date = new Date(dateString);

  // Extract the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  // Format the date as yyyy-MM-dd
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

app.listen(port, () => {
  console.log("Server is running on PORT :", port);
});
