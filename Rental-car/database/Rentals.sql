CREATE TABLE Rentals (
  id INT PRIMARY KEY IDENTITY(1,1),
  userId INT FOREIGN KEY REFERENCES Users(id),
  carId INT FOREIGN KEY REFERENCES Cars(id),
  startDate DATE,
  endDate DATE,
  -- Add more columns as needed
);
