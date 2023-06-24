<<<<<<< HEAD
fetch('https://newsapi.org/v2/sources?apiKey=d6f7f658c7ad4a87a9d21757a90e803c')
.then(response => response.json())
.then(data => {
  const countries = Array.from(new Set(data.sources.map(source => source.country)));

  const countryDropdown = document.getElementById('country');

  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countryDropdown.appendChild(option);
  });
}).catch(error => {
  console.log(error);
})

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var country = document.getElementById("country").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      document.getElementById("label").innerHTML =
        "The entered password and confirmed password do not match.";

      return;
    }

    // Regular expression pattern for password validation
    var passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordPattern.test(password)) {
      document.getElementById("label").innerHTML =
        "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).";
      return;
    }

    var user = {
      firstName: firstName,
      lastName: lastName,
      country: country,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((users) => {
        // Check if the email already exists
        if (users.some((user) => user.email === email)) {
          alert("User already exists with this email.");
          return;
        }

        // Email does not exist, proceed with registration
        fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            window.location.href = "login.html";
            alert(
              "Registration successful! You will now be redirected to the login page."
            );
          })
          .catch((error) => {
            console.log(error);
            alert("Registration failed.");
          });
      })
      .catch((error) => {
        console.log(error);
        alert("Error occurred while checking user existence.");
      });
  });
=======
fetch('https://newsapi.org/v2/sources?apiKey=d6f7f658c7ad4a87a9d21757a90e803c')
.then(response => response.json())
.then(data => {
  const countries = Array.from(new Set(data.sources.map(source => source.country)));

  const countryDropdown = document.getElementById('country');

  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countryDropdown.appendChild(option);
  });
}).catch(error => {
  console.log(error);
})

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var country = document.getElementById("country").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      document.getElementById("label").innerHTML =
        "The entered password and confirmed password do not match.";

      return;
    }

    // Regular expression pattern for password validation
    var passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordPattern.test(password)) {
      document.getElementById("label").innerHTML =
        "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).";
      return;
    }

    var user = {
      firstName: firstName,
      lastName: lastName,
      country: country,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((users) => {
        // Check if the email already exists
        if (users.some((user) => user.email === email)) {
          alert("User already exists with this email.");
          return;
        }

        // Email does not exist, proceed with registration
        fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            window.location.href = "login.html";
            alert(
              "Registration successful! You will now be redirected to the login page."
            );
          })
          .catch((error) => {
            console.log(error);
            alert("Registration failed.");
          });
      })
      .catch((error) => {
        console.log(error);
        alert("Error occurred while checking user existence.");
      });
  });
>>>>>>> b27905d5fa820c0c5ed0cdbea361f6a5b393d8dc
