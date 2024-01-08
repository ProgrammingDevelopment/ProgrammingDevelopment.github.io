CREATE TABLE Cars (
  id INT PRIMARY KEY IDENTITY(1,1),
  merk NVARCHAR(50),
  model NVARCHAR(50),
  platNumber NVARCHAR(20) UNIQUE,
  status NVARCHAR(20), -- menambahkan status mobil rental 
  fees INT,
  -- menambahkan function database ketika ingin menambahkan kembali 
);
