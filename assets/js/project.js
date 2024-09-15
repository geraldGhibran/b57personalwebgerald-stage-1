function generateUniqueNumber() {
  return Math.floor(Math.random() * 900000) + 100000;
}

const updatedProfiles = JSON.parse(localStorage.getItem("formDataProject"));
console.log(updatedProfiles);
console.log(updatedProfiles.length);
if (updatedProfiles == null) {
  localStorage.setItem("formDataProject", JSON.stringify([]));
}
// count post blog time
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getDistanceTime(timePost) {
  const timeNow = new Date();
  const distance = timeNow - timePost; // hasilnya miliseconds => 1 detik = 1000ms

  // seconds, minutes, hours, day
  // round => membulatkan ke angkat terdekat | 7.3 => 7 | 7.5 => 8
  // floor => membulatkan ke bawah | 7.9 => 7 | 7.99 => 7
  // ceil => membulatkan ke atas | 8.01 => 9 | 8.3 => 9
  const seconds = Math.floor(distance / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const day = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 60) {
    return `${hours} hours ago`;
  } else if (day < 24) {
    return `${day} day ago`;
  }
}

function getFullTime(time) {
  const dateString = new Date(time);
  console.log(dateString.toString());
  const date = String(dateString.getDate());
  const monthIndex = String(dateString.getMonth());
  const year = String(dateString.getFullYear());
  let hours = String(dateString.getHours());
  let minutes = String(dateString.getMinutes());

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return `${date} ${months[monthIndex]} ${year} ${hours}:${minutes} WIB`;
}

// blogs
const blogs = [];

function addObjectToArrayInLocalStorage(key, newObject) {
  
  let existingArray = localStorage.getItem(key);

  
  if (existingArray === null) {
    existingArray = [];
  } else {
    
    existingArray = JSON.parse(existingArray);
  }

  
  existingArray.push(newObject);

  
  localStorage.setItem(key, JSON.stringify(existingArray));
}

// renderBlog();

function addProject(event) {
  event.preventDefault();

  const inputProjectName = document.getElementById("input-project-name").value;
  const inputProjectStartDate = document.getElementById(
    "input-project-startdate"
  ).value;
  const inputProjectEndDate = document.getElementById(
    "input-project-enddate"
  ).value;
  const inputDescription = document.getElementById(
    "input-project-description"
  ).value;
  const inputNodeJs = document.getElementById("nodejs").value;
  const inputNextJs = document.getElementById("nextjs").value;
  const inputReactJs = document.getElementById("reactjs").value;
  const inputTypescript = document.getElementById("typescript").value;
  const inputImage = document.getElementById("input-project-image");


  let reader = new FileReader();
  reader.readAsDataURL(inputImage.files[0]);


  const data = {
    id: generateUniqueNumber(),
    projectName: inputProjectName,
    startDate: inputProjectStartDate,
    endDate: inputProjectEndDate,
    description: inputDescription,
    technologies: [inputNodeJs, inputNextJs, inputReactJs, inputTypescript],
    image: reader.result,
    createdAt: new Date(),
  };
  location.href='//index'

 
  

  renderBlog();
}

function renderBlog() {
  let html = "";

  for (let index = 0; index < updatedProfiles.length; index++) {
    html += `<div class="blog-list-item">
                  <div class="blog-image">
                      <img src="${updatedProfiles[index].image}" alt="" />
                  </div>
                  <div class="blog-content">
                      <div class="btn-group">
                          <button class="btn-edit">Edit Post</button>
                          <button class="btn-post">Delete Post</button>
                      </div>
                      <h1>
                          <a href="blog-detail.html" target="_blank">${
                            updatedProfiles[index].projectName
                          }</a>
                      </h1>
                      <div class="detail-blog-content">
                          ${getFullTime(updatedProfiles[index].createdAt)} | ${
      updatedProfiles[index].projectName
    }
                      </div>
                      <p>
                          ${updatedProfiles[index].description}
                      </p>
                      <p>
                        ${getDistanceTime(updatedProfiles[index].createdAt)}
                      </p>
                  </div>
              </div>
              `;
  }

  document.getElementById("contents").innerHTML = html;
  
}
renderBlog();

// setInterval(() => {
//   renderBlog();
// }, 1000);
