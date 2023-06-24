document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((users) => {
        var matchedUser = users.find(
          (user) => user.email === email && user.password === password
        );

        if (matchedUser) {
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("user", JSON.stringify(matchedUser));
          window.location.href = "index.html";
        } else {
          document.getElementById("invalid").innerHTML =
            "Invalid credentials !";
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Error occurred while retrieving user data.");
      });
  });

// Make eye icon hide and show
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function (e) {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});
