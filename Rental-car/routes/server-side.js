// server.js
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// SQL Server configuration
const config = {
  user: "LAPTOP-8R7JQO88",
  password: "your_password",
  server: "localhost",
  database: "Databas-Rental-car",
};

// Registration endpoint
app.post("/api/register", async (req, res) => {
  const { username, password, identityNumber } = req.body;

  try {
    // Connect to the SQL Server
    await sql.connect(config);

    // Insert user into the Users table
    const result = await sql.query`
      INSERT INTO Users (username, password, identityNumber)
      VALUES (${username}, ${password}, ${identityNumber});
    `;

    res.json({ success: true });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // menutup koneksi pada SQL server
    await sql.close();
  }
});

// memulai server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Extend server.js
// ...

// Add Car endpoint
app.post("/api/addCar", async (req, res) => {
  const { merk, model, platNumber, fees } = req.body;

  try {
    // Connect to the SQL Server
    await sql.connect(config);

    // Insert car into the Cars table
    const result = await sql.query`
        INSERT INTO Cars (merk, model, platNumber, status, fees)
        VALUES (${merk}, ${model}, ${platNumber}, 'Available', ${fees});
      `;

    res.json({ success: true });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Close the SQL Server connection
    await sql.close();
  }
});

// Search Cars endpoint
app.get("/api/searchCars", async (req, res) => {
  const { merk, model, maxFees } = req.query;

  try {
    // Connect to the SQL Server
    await sql.connect(config);

    // Query Cars based on search criteria
    const result = await sql.query`
        SELECT * FROM Cars
        WHERE merk LIKE ${merk}% AND model LIKE ${model}% AND fees <= ${maxFees}
        AND status = 'Available';
      `;

    res.json(result.recordset);
  } catch (error) {
    console.error("Error searching cars:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Close the SQL Server connection
    await sql.close();
  }
});

// Extend server.js
// ...

// Rent Car endpoint
app.post("/api/rentCar", async (req, res) => {
  const { carId, startDate, endDate } = req.body;
  const userId = 1; // Replace with actual user identification (e.g., from authentication)

  try {
    // Connect to the SQL Server
    await sql.connect(config);

    // Verify car availability for the selected dates
    const availabilityCheck = await sql.query`
        SELECT * FROM Rentals
        WHERE carId = ${carId}
        AND (
          (startDate <= ${startDate} AND endDate >= ${startDate})
          OR (startDate <= ${endDate} AND endDate >= ${endDate})
          OR (startDate >= ${startDate} AND endDate <= ${endDate})
        );
      `;

    if (availabilityCheck.recordset.length > 0) {
      return res
        .status(400)
        .json({ error: "Car not available for the selected dates" });
    }

    // Insert rental information into Rentals table
    const result = await sql.query`
        INSERT INTO Rentals (userId, carId, startDate, endDate)
        VALUES (${userId}, ${carId}, ${startDate}, ${endDate});
      `;

    res.json({ success: true });
  } catch (error) {
    console.error("Error renting car:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Close the SQL Server connection
    await sql.close();
  }
});

// Get Rented Cars endpoint
app.get("/api/getRentedCars", async (req, res) => {
  const userId = 1; // Replace with actual user identification (e.g., from authentication)

  try {
    // Connect to the SQL Server
    await sql.connect(config);

    // Query rented cars for the logged-in user
    const result = await sql.query`
        SELECT Cars.*, Rentals.startDate, Rentals.endDate
        FROM Rentals
        INNER JOIN Cars ON Rentals.carId = Cars.id
        WHERE Rentals.userId = ${userId};
      `;

    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching rented cars:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Close the SQL Server connection
    await sql.close();
  }
});

// Get Available Cars endpoint
app.get("/api/getAvailableCars", async (req, res) => {
  try {
    // Connect to the SQL Server
    await sql.connect(config);

    // Query available cars
    const result = await sql.query`
        SELECT * FROM Cars
        WHERE status = 'Available';
      `;

    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching available cars:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Close the SQL Server connection
    await sql.close();
  }

  // Extend server.js
  // ...

  // Return Car endpoint
  app.post("/api/returnCar", async (req, res) => {
    const { platNumber } = req.body;
    const userId = 1; // Replace with actual user identification (e.g., from authentication)

    try {
      // Connect to the SQL Server
      await sql.connect(config);

      // Get rental information for the returned car
      const rentalInfo = await sql.query`
        SELECT TOP 1 * FROM Rentals
        INNER JOIN Cars ON Rentals.carId = Cars.id
        WHERE Cars.platNumber = ${platNumber}
        AND Rentals.userId = ${userId}
        AND Rentals.returnDate IS NULL
        ORDER BY Rentals.startDate DESC;
      `;

      if (!rentalInfo.recordset[0]) {
        return res
          .status(400)
          .json({ error: "Car not found or already returned" });
      }

      const returnDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(rentalInfo.recordset[0].startDate)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(rentalInfo.recordset[0].endDate)
        .toISOString()
        .split("T")[0];

      // Update return date in Rentals table
      await sql.query`
        UPDATE Rentals
        SET returnDate = ${returnDate}
        WHERE id = ${rentalInfo.recordset[0].id};
      `;

      // Calculate duration and fees
      const duration = Math.ceil(
        (new Date(returnDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      );
      const fees = duration * rentalInfo.recordset[0].fees;

      res.json({ success: true, duration, fees });
    } catch (error) {
      console.error("Error returning car:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      // Close the SQL Server connection
      await sql.close();
    }
  });

  // Logout endpoint (clear server-side session)
  app.post("/api/logout", async (req, res) => {
    // Implement server-side logout logic
    // Clear user session information
    res.json({ success: true });
  });
});
