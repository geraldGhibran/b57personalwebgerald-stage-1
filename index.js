const express = require("express");
const app = express();
const port = 5000;
const path = require("path");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(express.urlencoded({ extended: true }));

// routing
app.get("/", home);
app.get("/project", project);
app.get("/add-project", addProjectView);
app.post("/add-project", addProject);
app.get("/contact", contactMe);
app.get("/testimonial", testimonial);
app.get("/project/detail/:id", projectDetail);

const projects = [];

function home(req, res) {
  res.render("index");
}

function project(req, res) {
  res.render("project", { projects });
}

function addProjectView(req, res) {
  res.render("add-project");
}

function addProject(req, res) {
  const { title, content } = req.body;

  const data = {
    title,
    content,
    image: "",
    author: "Naruto",
    createdAt: new Date(),
  };

  projects.unshift(data);
}

function contactMe(req, res) {
  res.render("contact");
}

function testimonial(req, res) {
  res.render("testimonial");
}

function projectDetail(req, res) {
  res.render("project-detail");
}

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});