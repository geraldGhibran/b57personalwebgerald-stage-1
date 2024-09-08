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
    "https://api.npoint.io/325670a0ea8fb06fe0df"
  );

  const testimonialHTML = testimonials.map((testimonial) => {
    return `<div class="testimonial">
    <img src="${testimonial.image}" class="profile-testimonial" />
    <p class="quote">"${testimonial.content}"</p>
    <p class="author">- ${testimonial.author}</p>
    <p class="author">${testimonial.rating} <i class="fa-solid fa-star"></i></p>
</div>`;
  });

  document.getElementById("testimonials").innerHTML = testimonialHTML.join("");
}

async function getTestimonialsByRating(rating) {
  const testimonials = await getTestimonialData(
    "https://api.npoint.io/325670a0ea8fb06fe0df"
  );

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (testimonial.rating === rating) {
      return true;
    }
  });

  const testimonialHTML = filteredTestimonials.map((testimonial) => {
    return `<div class="testimonial">
    <img src="${testimonial.image}" class="profile-testimonial" />
    <p class="quote">"${testimonial.content}"</p>
    <p class="author">- ${testimonial.author}</p>
    <p class="author">${testimonial.rating} <i class="fa-solid fa-star"></i></p>
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
      return `<button onclick="getAllTestimonials()" class="rating-btn">${buttonRating.name}</button>`;
    } else {
      return `<button onclick="getTestimonialsByRating(${buttonRating.rating})" class="rating-btn">
            ${buttonRating.name} <i class="fa-solid fa-star"></i>
          </button>`;
    }
  });

  document.getElementById("button-ratings").innerHTML =
    buttonRatingsHTML.join("");
}

showButtonRatings();
