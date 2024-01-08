CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY(1,1),
  username NVARCHAR(50) UNIQUE,
  password NVARCHAR(255), -- menggunakan keamanan String Hashing
  identityNumber NVARCHAR(20),
  -- Add more columns as needed
);
