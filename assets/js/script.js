function validateForm() {
  // Get references to the form elements
  let nameInput = document.getElementById("input-project-name");
  let startDateInput = document.getElementById("input-project-startdate");
  let endDateInput = document.getElementById("input-project-enddate");
  let priceInput = document.getElementById("price");
  let descriptionInput = document.getElementById("input-project-description");
  let image = document.getElementById("input-project-image");

  // Get the values from the input fields and remove extra white spaces.
  let name = nameInput.value.trim();
  let startDate = startDateInput.value.trim();
  let endDate = endDateInput.value.trim();

  // Validate name input
  if (name === "") {
    document.getElementById("name-error-msg").innerHTML =
      " Please enter your project name";
    return false;
  } else {
    document.getElementById("name-error-msg").innerHTML = "";
  }

  // Validate description input
  if (descriptionInput.value.length > 50) {
    document.getElementById("disc-error-msg").innerHTML =
      " Description can be maximum 50 characters";
    return false;
  } else if (descriptionInput.value == "") {
    document.getElementById("disc-error-msg").innerHTML =
      " Please enter the Discription";
    return false;
  } else {
    document.getElementById("disc-error-msg").innerHTML = "";
  }

  // Validate image input
  if (image.files.length === 0) {
    document.getElementById("image-error-msg").innerHTML =
      " Please attach an image";
    return false;
  } else {
    document.getElementById("image-error-msg").innerHTML = "";
  }

  // regular expression for image format
  let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if (!allowedExtensions.exec(image.files[0].name)) {
    document.getElementById("image-error-msg").innerHTML =
      " Please attach a valid image file (jpg, jpeg, png, or gif)";
    image.value = "";
    return false;
  } else {
    document.getElementById("image-error-msg").innerHTML = "";
  }

  // Check the file size of the uploaded image
  let fileSize = image.files[0].size / 1024; // in KB
  if (fileSize > 750) {
    document.getElementById("image-error-msg").innerHTML =
      " Please attach an image that is smaller than 750KB";
    image.value = "";
    return false;
  } else {
    document.getElementById("image-error-msg").innerHTML = "";
  }
  return true;
}

function showData() {
  let projectList;
  if (localStorage.getItem("projectList") == null) {
    projectList = [];
  } else {
    projectList = JSON.parse(localStorage.getItem("projectList"));
  }
  let html = "";
  if (projectList.length === 0) {
    // Display an image if the projectList array is empty
    html += `<div class="card-body">
        <div class="row gx-2">
          <div class="col">
            <div class="p-3">
              <img src="assets/img/no-data-found.png" class="img-fluid rounded mx-auto d-block" alt="No Products">
            </div>
          </div>
        </div>
      </div>`;
  } else {
    projectList.forEach(function (element, index) {
      html += `<div>
        <div class='row gx-2'>
        <div class='col'>
        <div class='p-3'>
        <div class='card d-flex card-all'>
        <div class='card-body'style=" height: 11rem; width: 16rem;">
        <h5 class='card-title text-center'><strong>${element.projectName}</strong>  </h5>
        <img src="${element.image}" class="card-img-top" id='sendParams' alt='Image' style=" height: 7rem; width: 14rem;">
        </div>
        <ul class='list-group list-group-flush'>
        <li class='list-group-item'><strong>Start Date -</strong>  ${element.startDate}</li>
        <li class='list-group-item'><strong>End Date -</strong>  ${element.endDate}</li>
        <li class='list-group-item h-25'> <button onclick="getDetail(${index})" type='button' class='btn btn-primary' style="width: 49%">Detail <span><i class="fa-solid fa-eye"></i></span> </button> </li>
        </ul>
        <div class='card-body text-center'>
       
         <button onclick='editData("${index}")' type='button' data-bs-toggle='modal' data-bs-target='#exampleModal-2' class='btn btn-success' style="width: 49%">Edit</button>
       
         <button onclick='deleteData("${index}")' type='button' class='btn btn-danger' style="width: 49%">Delete</button>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        `;
    });
  }

  document.querySelector("#curd-table").innerHTML = html;
}

function getDetail(id) {
  const params = new URLSearchParams({
    id: id,
  });
  window.location.href = `/project/detail/?${params.toString()}`;
}

// Load all data when document or page load
showData();

const form = document.querySelector("form");

function AddDataProject(event) {
  //   if (validateForm() == true) {
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

  const image = document.getElementById("input-project-image");

  let reader = new FileReader();

  let skills = [];
  const fd = new FormData(form);
  // Creates array into which skills will be pushed if checked
  document.querySelectorAll('[type="checkbox"]').forEach((item) => {
    // Iterates through all checkbox elements
    if (item.checked === true) {
      skills.push(item.value);
      // Pushes checkbox value into skills array if checked
    } else if (item.checked === false) {
      skills = skills;
      // Does nothing if not checked
    }
  });

  fd.append("skills", JSON.stringify(skills));
  // Stringify array to JSON and append to FormData object

  console.log(Object.fromEntries(fd));

  let projectList;
  if (localStorage.getItem("projectList") == null) {
    projectList = [];
  } else {
    projectList = JSON.parse(localStorage.getItem("projectList"));
  }

  let id = 1;
  if (projectList.length > 0) {
    let ids = projectList.map((product) => product.id);
    id = Math.max(...ids) + 1;
  }

  reader.readAsDataURL(image.files[0]);
  reader.addEventListener("load", () => {
    projectList.push({
      id: id,
      projectName: inputProjectName,
      startDate: inputProjectStartDate,
      endDate: inputProjectEndDate,
      description: inputDescription,
      skills: skills,
      createdDate: new Date(),
      image: reader.result,
    });
    localStorage.setItem("projectList", JSON.stringify(projectList));
    window.open("/",'_self');
  });

  document.getElementById("input-project-name").value = "";
  document.getElementById("input-project-startdate").value = "";
  document.getElementById("input-project-enddate").value = "";
  document.getElementById("input-project-description").value = "";
  document.getElementById("close-btn").click();
  
  //   }
}

function deleteData(index) {
  let projectList;
  if (localStorage.getItem("projectList") == null) {
    projectList = [];
  } else {
    projectList = JSON.parse(localStorage.getItem("projectList"));
  }

  // Display a confirmation message to the user
  if (confirm("Are you sure you want to delete this item?")) {
    projectList.splice(index, 1);
    localStorage.setItem("projectList", JSON.stringify(projectList));
    showData();
    location.reload(); // Reload the current page
  }
}

function editData(index) {
  let projectList;
  if (localStorage.getItem("projectList") == null) {
    projectList = [];
  } else {
    projectList = JSON.parse(localStorage.getItem("projectList"));
  }

  document.getElementById("id-edit").value = projectList[index].id;
  document.getElementById("name-edit").value = projectList[index].projectName;
  document.getElementById("start-date-edit").value =
    projectList[index].startDate;
  document.getElementById("end-date-edit").value = projectList[index].endDate;
  document.getElementById("description-edit").value =
    projectList[index].description;

  let imagePreview = document.getElementById("image-div");
  imagePreview.src = projectList[index].image;
  document.getElementById("image-div").innerHTML =
    "<img src=" + projectList[index].image + " width='100%' height='100%'>";

  let imageEdit = document.getElementById("image-edit");
  imageEdit.onchange = function (event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function () {
      projectList[index].image = reader.result;
      imagePreview.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  document.querySelector("#update").onclick = function () {
    projectList[index].id = document.getElementById("id-edit").value;
    projectList[index].projectName = document.getElementById("name-edit").value;
    projectList[index].startDate =
      document.getElementById("start-date-edit").value;
    projectList[index].endDate = document.getElementById("end-date-edit").value;
    projectList[index].description =
      document.getElementById("description-edit").value;
    // this line is used to convert the array to a JSON string before it is saved to local storage.
    localStorage.setItem("projectList", JSON.stringify(projectList));
    // The is method, which refreshes the page with the updated data.
    location.reload();

    showData();
    document.getElementById("id-edit").value = "";
    document.getElementById("name-edit").value = "";
    document.getElementById("description-edit").value = "";
    document.getElementById("close-btn").click();
    alert("Data Updated Successfully");
  };
}

function searchBar() {
  let searchvalue = document.querySelector("#serachProductText").value;
  console.log(searchvalue);
  let sortedItem = [];
  let sortedProduct = JSON.parse(localStorage.getItem("productList")) ?? [];
  let regex = new RegExp(searchvalue, "i");
  for (let element of sortedProduct) {
    let item = element;
    if (regex.test(item.name)) {
      sortedItem.push(element);
    }
  }
  console.log(sortedItem);
  searchProduct(sortedItem);
}

/**
 * @function searchProduct
 *
 * @description This function is generates HTML code to display search
 *              results for items. If there are no results, it displays an
 *              image and a error message. Otherwise, it generates a card
 *              for each product that matches the search query,
 *
 * @param sortedItem (a array format)
 */
function searchProduct(sortedItem) {
  let html = "";
  console.log("searchProduct", sortedItem);
  if (sortedItem.length === 0) {
    // Display an image if the productList array is empty
    html += `<div class="card-body">
        <div class="row gx-2">
          <div class="col">
            <div class="p-3">
              <img src="img/search-not-found.png" class="img-fluid rounded mx-auto d-block" alt="No Products" style="width: 18rem; height: 18rem;">
              <p class="text-center">No Similar Items Found..!</p>
            </div>
          </div>
        </div>
      </div>`;
  } else {
    sortedItem.forEach(function (element, index) {
      html += `<div>
        <div class='row gx-2'>
        <div class='col'>
        <div class='p-3'>
        <div class='card d-flex card-all'>
        <div class='card-body'style=" height: 11rem; width: 16rem;">
        <img src="${element.image}" class="card-img-top" alt='Image' style=" height: 7rem; width: 14rem;">
        </div>
        <ul class='list-group list-group-flush'>
        <li class='list-group-item'><strong>Product -</strong>  ${element.name}  </li>
        <li class='list-group-item h-25'><strong>Description -</strong> ${element.description}  </li>
        <li class='list-group-item'><strong>Price -</strong>  $${element.price}</li>
        </ul>
        <div class='card-body text-center'>
         <button onclick='editData("${index}")' type='button' data-bs-toggle='modal' data-bs-target='#exampleModal-2' class='btn btn-success' style="width: 49%">Edit</button>
         <button onclick='deleteData("${index}")' type='button' class='btn btn-danger' style="width: 49%">Delete</button>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>`;
    });
  }
  document.querySelector("#curd-table").classList.add("d-none");
  document.querySelector("#sort-table").innerHTML = html;
}

let selectElem = document.querySelector("#sort-select");
selectElem.addEventListener("change", (event) => {
  let sortBy = event.target.value;
  filterProduct(sortBy); // perform the sorting action based on the selected value
  if (sortBy == "refresh-btn") {
    location.reload(); // refresh the page
  }
});

function filterProduct(sortvalue) {
  let sortedProduct = JSON.parse(localStorage.getItem("sortedProduct")) ?? [];
  let productList = JSON.parse(localStorage.getItem("productList")) ?? [];
  sortedProduct = productList;
  localStorage.setItem("sortedProduct", JSON.stringify(sortedProduct));

  /**
   * @description This code block is a conditional statement that checks
   *              the value of the sortvalue parameter to determine the
   *              sorting criteria to be used for the product list.
   */
  if (sortvalue == "desc") {
    let desc = true;
    sortedProduct = sortedProduct.sort((a, b) =>
      desc ? b.id - a.id : a.id - b.id
    );
    desc = !desc;
    console.log("descending", sortedProduct);
    return filteredData(sortedProduct);
  } else if (sortvalue == "asc") {
    let desc = false;
    sortedProduct = sortedProduct.sort((a, b) =>
      desc ? b.id - a.id : a.id - b.id
    );
    console.log("Asc", sortedProduct);
    return filteredData(sortedProduct);
  } else if (sortvalue == "name") {
    sortedProduct = sortedProduct = sortedProduct.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    console.log("name", sortedProduct);
    return filteredData(sortedProduct);
  } else if (sortvalue == "price") {
    sortedProduct = sortedProduct.sort((a, b) => b.price - a.price);
    console.log("Price", sortedProduct);
    return filteredData(sortedProduct);
  } else {
    return false;
  }
}

function filteredData(sortedProduct) {
  let html = "";
  if (sortedProduct.length === 0) {
    // This Below HTML Code Display when product list's array is Empty.
    html += `<div class="card-body">
        <div class="row gx-2">
          <div class="col">
            <div class="p-3">
              <img src="img/no-data-found.png" class="img-fluid rounded mx-auto d-block" alt="No Products">
              <p class="text-center">No products to display</p>
            </div>
          </div>
        </div>
      </div>`;
  } else {
    sortedProduct.forEach(function (element, index) {
      // This Below HTML code is generate Card For Sorted Items.
      html += `<div>
        <div class='row gx-2'>
        <div class='col'>
        <div class='p-3'>
        <div class='card d-flex card-all'>
        <div class='card-body'style=" height: 11rem; width: 16rem;">
        <img src="${element.image}" class="card-img-top" alt='Image' style=" height: 7rem; width: 14rem;">
        </div>
        <ul class='list-group list-group-flush'>
        <li class='list-group-item'><strong>Product -</strong>  ${element.name}  </li>
        <li class='list-group-item h-25'><strong>Description -</strong>  ${element.description}  </li>
        <li class='list-group-item'>Price -</strong>  $${element.price}</li>
        </ul>
        <div class='card-body text-center'>
         <button onclick='editData("${index}")' type='button' data-bs-toggle='modal' data-bs-target='#exampleModal-2' class='btn btn-success' style="width: 49%">Edit</button>
         <button onclick='deleteData("${index}")' type='button' class='btn btn-danger' style="width: 49%">Delete</button>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>`;
    });
  }
  document.querySelector("#curd-table").classList.add("d-none");
  document.querySelector("#sort-table").innerHTML = html;
}
