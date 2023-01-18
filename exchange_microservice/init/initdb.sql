CREATE DATABASE IF NOT EXISTS exchange;
USE exchange;

CREATE USER me;
GRANT ALL PRIVILEGES ON DATABASE exchange TO me;


CREATE TABLE IF NOT EXISTS users(
    email VARCHAR(32) PRIMARY KEY NOT NULL,    
    name VARCHAR(32) NOT NULL,
    iban VARCHAR(100) UNIQUE NOT NULL, 
);

CREATE TABLE IF NOT EXISTS wallet(
    email VARCHAR(32) PRIMARY KEY,
    wallet_eu DOUBLE NOT NULL, 
    wallet_usd DOUBLE NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email)  
);

CREATE TABLE IF NOT EXISTS transactions(
    code SERIAL PRIMARY KEY,
    email VARCHAR(32) NOT NULL,    
    name VARCHAR(32) NOT NULL,
    eu_amount DOUBLE NOT NULL, 
    usd_amount DOUBLE NOT NULL,
    starting_currency VARCHAR(5) NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email)  
);