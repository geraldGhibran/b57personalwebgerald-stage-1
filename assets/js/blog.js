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
  console.log(time);

  const date = time.getDate();
  const monthIndex = time.getMonth();
  const year = time.getFullYear();
  let hours = time.getHours();
  let minutes = time.getMinutes();

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
function addBlog(event) {
  event.preventDefault();

  const inputTitle = document.getElementById("input-blog-title").value;
  const inputContent = document.getElementById("input-blog-content").value;
  const inputImage = document.getElementById("input-blog-image").files;

  const blobImage = URL.createObjectURL(inputImage[0]);

  const data = {
    title: inputTitle,
    content: inputContent,
    image: blobImage,
    author: "Naruto",
    createdAt: new Date(),
  };

  blogs.unshift(data);

  localStorage.setItem("blogs", JSON.stringify(data));

  console.log(blogs);
  renderBlog();
}

function renderBlog() {
  let html = "";

  for (let index = 0; index < blogs.length; index++) {
    console.log(blogs[index].image);
    html += `<div class="blog-list-item">
                <div class="blog-image">
                    <img src="${blogs[index].image}" alt="" />
                </div>
                <div class="blog-content">
                    <div class="btn-group">
                        <button class="btn-edit">Edit Post</button>
                        <button class="btn-post">Delete Post</button>
                    </div>
                    <h1>
                        <a href="blog-detail.html" target="_blank">${
                          blogs[index].title
                        }</a>
                    </h1>
                    <div class="detail-blog-content">
                        ${getFullTime(blogs[index].createdAt)} | ${
      blogs[index].author
    }
                    </div>
                    <p>
                        ${blogs[index].content}
                    </p>
                    <p>
                      ${getDistanceTime(blogs[index].createdAt)}
                    </p>
                </div>
            </div>
            `;
  }

  document.getElementById("contents").innerHTML = html;
}

// setInterval(() => {
//   renderBlog();
// }, 1000)
