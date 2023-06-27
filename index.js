// Fetch the available categories present in an API for showing in the dropdown box
fetch("https://newsapi.org/v2/sources?apiKey=4179b0aaa9b243f6a2cae4686a986c39")
  .then((response) => response.json())
  .then((data) => {
    const categories = Array.from(
      new Set(data.sources.map((source) => source.category))
    );

    const categoryDropdown = document.getElementById("category");

    // Capitalize first letter of each word
    categories.forEach((category) => {
      const formattedCategory = category.replace(/\b\w/g, (match) =>
        match.toUpperCase()
      );

      const a = document.createElement("a");
      a.value = category;
      a.textContent = formattedCategory;
      a.classList.add("categoryDropdown"); // Add the class name
      categoryDropdown.appendChild(a);

      a.addEventListener("click", function (event) {
        event.preventDefault();
        var category = event.target.textContent.toLowerCase();
        fetchNews(category);
        document.getElementById("headCategory").textContent = category;
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });

window.onload = function () {
  if (!sessionStorage.getItem("isLoggedIn")) {
    // User is not logged in, redirect to the login page
    window.location.href = "login.html";
  }
  // Logout button click event
  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      // Remove the session storage item and redirect to the login page
      sessionStorage.removeItem("isLoggedIn");
      window.location.href = "login.html";
    });
};

// Function to truncate a string to a specified number of words
function truncateWords(text, limit) {
  const words = text.split(" ");
  if (words.length > limit) {
    return words.slice(0, limit).join(" ") + "...";
  }
  return text;
}

// Fetch news articles from the General category
function fetchNews(category) {
  fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=4179b0aaa9b243f6a2cae4686a986c39`
  )
    .then((response) => response.json())
    .then((data) => {
      // Check if articles are available
      if (data.articles && data.articles.length > 0) {
        const articles = data.articles; // Fetch all articles

        // Create a container to hold the news articles
        const newsContainer = document.getElementById("newsContainer");

        // Clear previous search results
        newsContainer.innerHTML = "";

        // Iterate over each article and create the news card
        articles.forEach((article) => {
          // Create elements for the news card
          const card = document.createElement("div");
          card.classList.add("card", "position-relative", "mb-3");
          card.style.width = "18rem";

          const badge = document.createElement("span");
          badge.classList.add(
            "position-absolute",
            "top-0",
            "start-20",
            "translate-middle",
            "badge",
            "rounded-pill",
            "bg-danger"
          );
          badge.textContent = article.source.name;

          const image = document.createElement("img");
          image.classList.add("card-img-top");
          image.src = article.urlToImage || "./images/no_img.jpg";
          image.alt = "News image";

          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");

          const title = document.createElement("h5");
          title.classList.add("card-title");
          title.textContent = truncateWords(article.title, 7);

          const description = document.createElement("p");
          description.classList.add("card-text");
          description.textContent = truncateWords(article.description, 12);

          const author = document.createElement("p");
          author.textContent = `By ${article.author || "Unknown"}`;

          const date = document.createElement("p");
          date.textContent = article.publishedAt || "Unknown";

          const readMoreLink = document.createElement("a");
          readMoreLink.href = article.url;
          readMoreLink.target = '_blank';
          readMoreLink.classList.add("btn", "btn-dark", "me-2");
          readMoreLink.textContent = "Read more";

          const saveLink = document.createElement("a");
          saveLink.href = "#";
          saveLink.classList.add("btn", "btn-info");
          saveLink.textContent = "Save";

          saveLink.addEventListener("click", function (event) {
            event.preventDefault();

            // Get the news data from the card
            const card = event.target.closest(".card");
            const title = card.querySelector(".card-title").textContent;
            const description = card.querySelector(".card-text").textContent;
            const source = card.querySelector(".badge").textContent;
            const image = card.querySelector(".card-img-top").src;
            const authorElement = card.querySelector("p:nth-child(4)");
            const author = authorElement
              ? authorElement.textContent
              : "Unknown";
            const dateElement = card.querySelector("p:nth-child(5)");
            const publishedDate = dateElement
              ? dateElement.textContent
              : "Unknown";

            // Prepare the data to be sent in the post request
            const data = {
              title,
              description,
              source,
              image,
              author,
              publishedDate,
            };

            // Send post request to the API endpoint
            fetch("http://localhost:3000/api/save-news", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                alert(data.message);
              })
              .catch((error) => {
                console.error(error);
                alert("An error occurred while saving the news.");
              });
          });

          // Append elements to the news card
          card.appendChild(badge);
          card.appendChild(image);
          card.appendChild(cardBody);
          cardBody.appendChild(title);
          cardBody.appendChild(description);
          cardBody.appendChild(author);
          cardBody.appendChild(date);
          cardBody.appendChild(readMoreLink);
          cardBody.appendChild(saveLink);

          // Append the news card to the container
          newsContainer.appendChild(card);
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// Fetch news articles on page load
fetchNews();

// Search operation
const searchForm = document.querySelector("form[role='search']");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  const searchInput = document.querySelector("input[type='search']");
  const searchTerm = searchInput.value.trim();

  if (searchTerm !== "") {
    searchNews(searchTerm);
  }
});

// Function to search news
function searchNews(searchTerm) {
  const apiKey = "4179b0aaa9b243f6a2cae4686a986c39";
  const url =
    "https://newsapi.org/v2/top-headlines?country=us&category=general&q=" +
    encodeURIComponent(searchTerm) +
    "&apiKey=" +
    apiKey;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.articles && data.articles.length > 0) {
        const articles = data.articles;
        displayNews(articles);
      } else {
        displayNoResults();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// Function to display news
function displayNews(articles) {
  const newsContainer = document.getElementById("newsContainer");

  // Clear previous search results
  newsContainer.innerHTML = "";

  // Iterate over each article and create the news card
  articles.forEach((article) => {
    // Create elements for the news card
    const card = document.createElement("div");
    card.classList.add("card", "position-relative", "mb-3");
    card.style.width = "18rem";

    const badge = document.createElement("span");
    badge.classList.add(
      "position-absolute",
      "top-0",
      "start-20",
      "translate-middle",
      "badge",
      "rounded-pill",
      "bg-danger"
    );
    badge.textContent = article.source.name;

    const image = document.createElement("img");
    image.classList.add("card-img-top");
    image.src = article.urlToImage || "./images/no_img.jpg";
    image.alt = "News image";

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = truncateWords(article.title, 7);

    const description = document.createElement("p");
    description.classList.add("card-text");
    description.textContent = truncateWords(article.description, 12);

    const author = document.createElement("p");
    author.textContent = `By ${article.author || "Unknown"}`;

    const date = document.createElement("p");
    date.textContent = article.publishedAt || "Unknown";

    const readMoreLink = document.createElement("a");
    readMoreLink.href = article.url;
    readMoreLink.classList.add("btn", "btn-dark", "me-2");
    readMoreLink.textContent = "Read more";

    const saveLink = document.createElement("a");
    saveLink.href = "#";
    saveLink.classList.add("btn", "btn-info");
    saveLink.textContent = "Save";

    // Append elements to the news card
    card.appendChild(badge);
    card.appendChild(image);
    card.appendChild(cardBody);
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(author);
    cardBody.appendChild(date);
    cardBody.appendChild(readMoreLink);
    cardBody.appendChild(saveLink);

    // Append the news card to the container
    newsContainer.appendChild(card);
  });
}

// Function to display "No results" message
function displayNoResults() {
  const newsContainer = document.getElementById("newsContainer");
  newsContainer.innerHTML = ""; // Clear previous search results

  const messageElement = document.createElement("p");
  messageElement.textContent = "No results found.";
  newsContainer.appendChild(messageElement);
}

// Fetch users data
document.addEventListener("DOMContentLoaded", function () {
  var user = JSON.parse(sessionStorage.getItem("user"));
  var usernameElement = document.getElementById("username");
  if (usernameElement) {
    usernameElement.textContent = user.firstName;
  }
});
