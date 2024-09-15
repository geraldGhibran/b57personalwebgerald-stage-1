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
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
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
app.post("/edit-project/:id", editProject);
app.get("/contact", contact);
app.get("/testimonial", testimonial);
app.get("/project-detail/:id", projectDetail);

app.get("/login", loginView);
app.get("/register", registerView);

app.post("/register", register);
app.post("/login", login);

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
    createdDate: new Date(),
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

  res.render("edit-project", { data: result });
}

async function editProject(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;

  const project = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  if (!project) return res.render("not-found");

  project.title = title;
  project.content = content;

  await project.save();

  res.redirect("/project");
}

function addProjectView(req, res) {
  res.render("add-project");
}

function contact(req, res) {
  res.render("contact");
}

function testimonial(req, res) {
  res.render("testimonial");
}

async function projectDetail(req, res) {
  const { id } = req.params;
  const result = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  console.log("detail", result);

  if (!result) return res.render("not-found");
  res.render("project-detail", { data: result });
}

app.listen(port, () => {
  console.log("Server is running on PORT :", port);
});
