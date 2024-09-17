const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");

const projectModel = require("./models").project;
const userModel = require("./models").user;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "my-session",
    secret: "ewVsqWOyeb",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax", // or 'none' if you need cross-site cookies
      secure: true, // true if in production
    },
  })
);
app.use(flash());

app.get("/", home);
app.get("/project", project);
app.get("/add-project", addProjectView);
app.post("/project", addProject);
app.get("/delete-project/:id", deleteProject);
app.get("/edit-project/:id", editProjectView);
app.get("/edit-project/:id", convertDate);
app.post("/edit-project/:id", editProject);
app.get("/contact", contact);
app.get("/testimonial", testimonial);
app.get("/project-detail/:id", projectDetail);

app.get("/login", loginView);
app.get("/register", registerView);

app.post("/register", register);
app.post("/login", login);
app.get("/logout", logout);

function loginView(req, res) {
  res.render("login");
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // cek email user apakah ada di database
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      req.flash("error", "Email / password salah!");
      return res.redirect("/login");
    }

    // cek password apakah valid dengan password yang sudah di hash
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
  req.session.destroy();
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
  const result = await projectModel.findAll();

  res.render("index", { data: result, user });
}

async function project(req, res) {
  const result = await projectModel.findAll();
  const user = req.session.user;

  res.render("project", { data: result, user });
}

async function deleteProject(req, res) {
  const { id } = req.params;

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
  res.redirect("/");
}

async function addProject(req, res) {
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
  await projectModel.create({
    projectName: projectName,
    startDate: startDate,
    endDate: endDate,
    description: description,
    technologies: [nodejs, typescript, reactjs, nextjs],
    createdAt: "2024-07-15T16:11:25.556Z",
    image: image,
  });

  res.redirect("/");
}

async function editProjectView(req, res) {
  const { id } = req.params;

  const result = await projectModel.findOne({
    where: {
      id: id,
    },
  });

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
}

async function editProject(req, res) {
  const { id } = req.params;
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
  project.image = image;

  project.technologies = [nodejs, typescript, reactjs, nextjs];

  await project.save();

  res.redirect("/");
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
