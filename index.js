//  Fetch the available categories present in an api for showing in the dropdown box
fetch("https://newsapi.org/v2/sources?apiKey=d6f7f658c7ad4a87a9d21757a90e803c")
  .then((response) => response.json())
  .then((data) => {
    const categories = Array.from(
      new Set(data.sources.map((source) => source.category))
    );

    const categoryDropdown = document.getElementById("category");

    // Capitalize first letter of each wor
    categories.forEach((category) => {
      const formattedCategory = category.replace(/\b\w/g, (match) =>
        match.toUpperCase()
      );

      const li = document.createElement("li");
      li.value = category;
      li.textContent = formattedCategory;
      li.classList.add("categoryDropdown"); // Add the class name
      categoryDropdown.appendChild(li);
    });
  })
  .catch((error) => {
    console.log(error);
  });

window.onload = function () {
  if (!sessionStorage.getItem("isLoggedIn")) {
    // User is not logged in, redirect to login page
    window.location.href = "login.html";
  }
  // Logout button click event
  document.getElementById("logoutButton").addEventListener("click", function () {
    // Remove the session storage item and redirect to the login page
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
  });
};

// Function to truncate a string to a specified number of words
function truncateWords(text, limit) {
  const words = text.split(' ');
  if (words.length > limit) {
    return words.slice(0, limit).join(' ') + '...';
  }
  return text;
}

// Fetch news articles from the General category
fetch('https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=d6f7f658c7ad4a87a9d21757a90e803c')
  .then(response => response.json())
  .then(data => {
    // Check if articles are available
    if (data.articles && data.articles.length > 0) {
      const articles = data.articles; // Fetch all articles

      // Create a container to hold the news articles
      const newsContainer = document.getElementById('newsContainer');

      // Iterate over each article and create the news card
      articles.forEach(article => {
        // Create elements for the news card
        const card = document.createElement('div');
        card.classList.add('card', 'position-relative', 'mb-3');
        card.style.width = '18rem';

        const badge = document.createElement('span');
        badge.classList.add('position-absolute', 'top-0', 'start-20', 'translate-middle', 'badge', 'rounded-pill', 'bg-danger');
        badge.textContent = article.source.name;

        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = article.urlToImage || './images/no_img.jpg';
        image.alt = 'News image';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = truncateWords(article.title, 7);

        const description = document.createElement('p');
        description.classList.add('card-text');
        description.textContent = truncateWords(article.description, 12);

        const author = document.createElement('p');
        author.textContent = `By ${article.author || 'Unknown'}`;

        const date = document.createElement('p');
        date.textContent = article.publishedAt || 'Unknown';

        const readMoreLink = document.createElement('a');
        readMoreLink.href = article.url;
        readMoreLink.classList.add('btn', 'btn-dark', 'me-2');
        readMoreLink.textContent = 'Read more';

        const saveLink = document.createElement('a');
        saveLink.href = '#';
        saveLink.classList.add('btn', 'btn-info');
        saveLink.textContent = 'Save';

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
  .catch(error => {
    console.log(error);
  });