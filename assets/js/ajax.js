function getTestimonialData(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onerror = () => {
      reject("Network Error!");
    };

    xhr.onload = () => {
      resolve(JSON.parse(xhr.responseText));
    };

    xhr.send();
  });
}

async function getAllTestimonials() {
  const testimonials = await getTestimonialData(
    "https://api.npoint.io/324bca9b24b53c982ad1"
  );

  const testimonialHTML = testimonials.map((testimonial) => {
    return `
    <div class="col-lg-4 col-md-4 col-xl-4 mb-5 col-sm-2" style="height: 450px; ">
    <div class="card p-5 h-100" style="width: 20rem">
    <img src="${testimonial.image}" class="card-img-top" alt="..." />
    <div class="card-body">
      <p class="card-title poppins-regular text-start">"${testimonial.content}"</p>
      <p class="card-text poppins-bold text-end">- ${testimonial.author}</p>
      <p class="card-text poppins-bold text-end">${testimonial.rating} <i class="fa-solid fa-star"></i></p>
    </div>
    </div>
    </div>`;
  });

  document.getElementById("testimonials").innerHTML = testimonialHTML.join("");
}

async function getTestimonialsByRating(rating) {
  const testimonials = await getTestimonialData(
    "https://api.npoint.io/324bca9b24b53c982ad1"
  );

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (testimonial.rating === rating) {
      return true;
    }
  });

  const testimonialHTML = filteredTestimonials.map((testimonial) => {
    return `<div class="col-lg-4 col-md-4 col-xl-4 mb-5 col-sm-2" style="height: 450px; ">
    <div class="card p-5 h-100" style="width: 20rem">
    <img src="${testimonial.image}" class="card-img-top" />
    <div class="card-body">
    <p class="quote">"${testimonial.content}"</p>
    <p class="author">- ${testimonial.author}</p>
    <p class="author">${testimonial.rating} <i class="fa-solid fa-star"></i></p>
</div>
 </div>
    </div>`;
  });

  document.getElementById("testimonials").innerHTML = testimonialHTML.join("");
}

getAllTestimonials();

const buttonRatings = [
  {
    name: "All",
    rating: "all",
  },
  {
    name: "1",
    rating: 1,
  },
  {
    name: "2",
    rating: 2,
  },
  {
    name: "3",
    rating: 3,
  },
  {
    name: "4",
    rating: 4,
  },
  {
    name: "5",
    rating: 5,
  },
];

function showButtonRatings() {
  const buttonRatingsHTML = buttonRatings.map((buttonRating) => {
    if (buttonRating.name === "All") {
      return `<button onclick="getAllTestimonials()" class="p-2 rating-btn bg-dark text-white m-2">${buttonRating.name}</button>`;
    } else {
      return `<button onclick="getTestimonialsByRating(${buttonRating.rating})" class=" p-2 rating-btn bg-dark text-white m-2">
            ${buttonRating.name} <i class="fa-solid fa-star text-white"></i>
          </button>`;
    }
  });

  document.getElementById("button-ratings").innerHTML =
    buttonRatingsHTML.join("");
}

showButtonRatings();
