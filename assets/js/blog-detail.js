function showDetail() {
  window.addEventListener("load", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const projectDetail = JSON.parse(localStorage.getItem("projectList"));
    document.getElementById("paramsDisplay").innerHTML = `  
      <div class="blog-detail">
        <div class="blog-detail-container">
          <h1>${projectDetail[id].projectName}</h1>
          <div class="author"> Start Date ${projectDetail[id].startDate}| End Date ${projectDetail[id].endDate} | Gerald Ghibran</div>
          <img src="${projectDetail[id].image}" alt="detail" />
          <p>
          ${projectDetail[id].description}
          </p>
        </div>
      </div>`;
  });
}

showDetail();
