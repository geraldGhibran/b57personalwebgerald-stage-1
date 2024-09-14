function showDetail() {
  window.addEventListener("load", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const projectDetail = JSON.parse(localStorage.getItem("projectList"));


    const inputDateString = projectDetail[id].createdDate;

    const inputDate = new Date(inputDateString);

    const currentDate = new Date();

    const diffYears = currentDate.getFullYear() - inputDate.getFullYear();
    const diffMonths =
      currentDate.getMonth() - inputDate.getMonth() + diffYears * 12;

    const dayDifference = currentDate.getDate() - inputDate.getDate();
    const totalMonthDifference =
      dayDifference < 0 ? diffMonths - 1 : diffMonths;

    document.getElementById("paramsDisplay").innerHTML = `  
      <div class="blog-detail">
        <div class="blog-detail-container">
          <h1>${projectDetail[id].projectName}</h1>
          <div class="author"> Start Date | ${totalMonthDifference} months ago ${
      projectDetail[id].startDate
    }| End Date ${projectDetail[id].endDate} | Gerald Ghibran</div>
          <img src="${projectDetail[id].image}" alt="detail" />
          <p>
          ${projectDetail[id].description}
          </p>
             <div class="detail-blog-content">
                        ${projectDetail[id].createdDate} |
                        ${getFullTime(projectDetail[id].createdDate)}
                    </div>
                  
                    <p>
                      ${getDistanceTime(projectDetail[id].createdDate)}
                    </p>
        </div>
      </div>`;
  });
}

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

function getFullTime(times) {
  const time = new Date(times);

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

  return ` ${monthIndex} ${year} ${hours}:${minutes} WIB`;
}

showDetail();
