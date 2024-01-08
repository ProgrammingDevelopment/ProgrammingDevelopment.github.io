// login.js
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Example login logic (replace with actual authentication logic)
    if (username === "demo" && password === "password") {
      // Successful login
      alert("Login successful");
      window.location.href = "./dashboard.html"; // Redirect to your dashboard page
    } else {
      // Invalid credentials
      alert("Invalid credentials");
    }
  });

// mengubah logic untuk callback logout
document.getElementById("logoutButton").addEventListener("click", function () {
  window.location.href = "./login.html";
});
