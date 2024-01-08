// assets script js
document
  .getElementById("registrationForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const identityNumber = document.getElementById("identityNumber").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("./api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, identityNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
      } else {
        alert(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }

    // Extend script.js
    // ...

    document
      .getElementById("addCarForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();

        const merk = document.getElementById("merk").value;
        const model = document.getElementById("model").value;
        const platNumber = document.getElementById("platNumber").value;
        const fees = document.getElementById("fees").value;

        try {
          const response = await fetch("/api/addCar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ merk, model, platNumber, fees }),
          });

          const data = await response.json();

          if (response.ok) {
            alert("Car added successfully!");
          } else {
            alert(`Car addition failed: ${data.error}`);
          }
        } catch (error) {
          console.error("Error adding car:", error);
        }
      });

    // Dummy data for available cars
    const availableCarsData = [
      { merk: "Toyota", model: "Camry", fees: 50 },
      { merk: "Honda", model: "Accord", fees: 60 },
      { merk: "Ford", model: "Fusion", fees: 55 },
      // Add more dummy data as needed
    ];

    function searchCars() {
      // Fetch search parameters
      const searchMerk = document
        .getElementById("searchMerk")
        .value.toLowerCase();
      const searchModel = document
        .getElementById("searchModel")
        .value.toLowerCase();
      const searchFees = parseFloat(
        document.getElementById("searchFees").value
      );

      // Filter available cars based on search parameters
      const searchResults = availableCarsData.filter((car) => {
        const merkMatch = car.merk.toLowerCase().includes(searchMerk);
        const modelMatch = car.model.toLowerCase().includes(searchModel);
        const feesMatch = isNaN(searchFees) || car.fees <= searchFees;

        return merkMatch && modelMatch && feesMatch;
      });

      // Display search results
      displaySearchResults(searchResults);
    }

    function displaySearchResults(results) {
      const carListContainer = document.getElementById("carList");
      carListContainer.innerHTML = ""; // Clear existing results

      if (results.length === 0) {
        carListContainer.innerHTML = "<p>No matching cars found.</p>";
      } else {
        const ul = document.createElement("ul");
        results.forEach((car) => {
          const li = document.createElement("li");
          li.textContent = `Car - Merk: ${car.merk}, Model: ${car.model}, Fees: ${car.fees}`;
          ul.appendChild(li);
        });
        carListContainer.appendChild(ul);
      }
    }

    // Example: Add an event listener to trigger the searchCars function on form submit
    document
      .getElementById("searchCarsForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        searchCars();
      });

    // Populate car dropdown with available cars
    async function populateCarDropdown() {
      try {
        const response = await fetch("/api/getAvailableCars");
        const cars = await response.json();

        const selectCarDropdown = document.getElementById("selectCar");
        selectCarDropdown.innerHTML = "";

        cars.forEach((car) => {
          const option = document.createElement("option");
          option.value = car.id;
          option.text = `${car.merk} ${car.model} - ${car.platNumber}`;
          selectCarDropdown.add(option);
        });
      } catch (error) {
        console.error("Error fetching available cars:", error);
      }
    }

    document
      .getElementById("rentCarForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();

        const selectedCarId = document.getElementById("selectCar").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        try {
          const response = await fetch("/api/rentCar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ carId: selectedCarId, startDate, endDate }),
          });

          const data = await response.json();

          if (response.ok) {
            alert("Car rented successfully!");
            populateRentedCarsList();
          } else {
            alert(`Car rental failed: ${data.error}`);
          }
        } catch (error) {
          console.error("Error renting car:", error);
        }
      });

    // Fetch and display list of rented cars
    async function populateRentedCarsList() {
      try {
        const response = await fetch("/api/getRentedCars");
        const rentedCars = await response.json();

        const rentedListContainer = document.getElementById("rentedList");
        rentedListContainer.innerHTML = "<h3>Rented Cars</h3>";

        rentedCars.forEach((rental) => {
          const rentalInfo = document.createElement("p");
          rentalInfo.textContent = `${rental.merk} ${rental.model} - ${rental.platNumber} (Start Date: ${rental.startDate}, End Date: ${rental.endDate})`;
          rentedListContainer.appendChild(rentalInfo);
        });
      } catch (error) {
        console.error("Error fetching rented cars:", error);
      }
    }

    // update scriptjs

    document
      .getElementById("returnCarForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();

        const returnPlatNumber =
          document.getElementById("returnPlatNumber").value;

        try {
          const response = await fetch("/api/returnCar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ platNumber: returnPlatNumber }),
          });

          const data = await response.json();

          if (response.ok) {
            alert(
              `Car returned successfully! Duration: ${data.duration} days, Fees: ${data.fees}`
            );
            populateRentedCarsList();
          } else {
            alert(`Car return failed: ${data.error}`);
          }
        } catch (error) {
          console.error("Error returning car:", error);
        }
      });
    document
      .getElementById("logoutButton")
      .addEventListener("click", function () {
        // Implement logout logic
        // Clear user-related data and redirect to the login page
        window.location.href = "./login.html"; // Redirect to your login page
      });
  });
