document.addEventListener("DOMContentLoaded", function () {
  // Retrieve user details from sessionStorage
  var user = JSON.parse(sessionStorage.getItem("user"));

  // Display user details on the profile page
  if (user) {
    
    document.getElementById("userName").textContent = user.firstName+" "+user.lastName;
    document.getElementById("firstName").textContent = user.firstName;
    document.getElementById("lastName").textContent = user.lastName;
    document.getElementById("email").textContent = user.email;
    document.getElementById("countrySpan").textContent = user.country;
  }

  // Delete profile functionality
  var deleteButton = document.getElementById("delete");
  deleteButton.addEventListener("click", function () {
    // Confirm deletion
    var confirmDelete = confirm(
      "Are you sure you want to delete your profile?"
    );
    if (confirmDelete) {
      // Retrieve the user ID
      var userId = user.id;

      // Send DELETE request to the server
      fetch("http://localhost:3000/users/" + userId, {
        method: "DELETE",
      })
        .then(function (response) {
          if (response.ok) {
            // Clear sessionStorage and redirect to login page
            sessionStorage.clear();
            window.location.href = "login.html";
          } else {
            throw new Error("Failed to delete profile.");
          }
        })
        .catch(function (error) {
          console.error(error);
          alert("An error occurred while deleting the profile.");
        });
    }
  });
  
  // Reset password functionality
  var resetPasswordButton = document.getElementById("resetPasswordButton");
  resetPasswordButton.addEventListener("click", function () {
    var oldPassword = document.getElementById("oldPassword").value;
    var newPassword = document.getElementById("newPassword").value;

    if (oldPassword === "" || newPassword === "") {
      alert(
        "Please enter the old password and new password for reset the password !"
      );
      return;
    }

    fetch("http://localhost:3000/users/" + user.id, { method: "GET" })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          alert("Failed to retrive users data");
        }
      })
      .then(function (userData) {
        if (oldPassword !== userData.password) {
          alert("Password does not matched !");
        } else {
          fetch("http://localhost:3000/users/" + user.id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword }),
          })
            .then(function (response) {
              if (response.ok) {
                sessionStorage.removeItem("isLoggedIn");
                window.location.href = "login.html";
              } else {
                alert("Password is not reset !");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
  });

  document.getElementById("firstNameInput").value = user.firstName;
  document.getElementById("lastNameInput").value = user.lastName;
  document.getElementById("country").value = user.country;
  document.getElementById("emailInput").value = user.email;

  var updateButton = document.getElementById("updateButton");
  updateButton.addEventListener("click", function () {
    var updatedFirstName = document.getElementById("firstNameInput").value;
    var updatedLastName = document.getElementById("lastNameInput").value;
    var updatedCountry = document.getElementById("country").value;
    var updatedEmail = document.getElementById("emailInput").value;

    var updateUser = Object.assign({}, user);
    updateUser.firstName = updatedFirstName;
    updateUser.lastName = updatedLastName;
    updateUser.email = updatedEmail;
    updateUser.country = updatedCountry;

    fetch("http://localhost:3000/users/" + user.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateUser),
    }).then(function(response){
        if (response.ok) {
            return response.json();
        }else{
            alert("Failed to update")
        }
    }).then(function (responseUser) {
        // var updatedUser = response.json();
        user = responseUser;
        alert("Profile updated successfully !");
        document.getElementById("userName").textContent = user.firstName+" "+lastName;
        document.getElementById("firstName").textContent =user.firstName;
        document.getElementById("lastName").textContent = user.lastName;
        document.getElementById("email").textContent = user.email;
        document.getElementById("countrySpan").textContent = user.country;

        document.getElementById("firstNameInput").value = "";
        document.getElementById("lastNameInput").value = "";
        document.getElementById("country").value = "";
        document.getElementById("emailInput").value = "";
      
    }).catch(function (error) {
        console.log(error);
    })
  });
});
