DROP DATABASE IF EXISTS TestApp
GO

CREATE DATABASE TestApp
GO

USE TestApp
GO

DROP TABLE IF EXISTS Uzytkownicy

CREATE TABLE Uzytkownicy (
    Id INT IDENTITY PRIMARY KEY,
    Login VARCHAR(10) NOT NULL,
    Haslo VARCHAR(10) NOT NULL,
    Imie VARCHAR(20) NOT NULL,
    Nazwisko VARCHAR(20) NOT NULL
)

INSERT INTO Uzytkownicy VALUES
('Antonio', 'antfri', 'Antonio', 'Lamoda'),
('Alla', 'allmo', 'Alla', 'Smollak')