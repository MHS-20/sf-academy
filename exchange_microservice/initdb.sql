CREATE DATABASE exchange;

CREATE USER me;
GRANT ALL PRIVILEGES ON DATABASE exchange TO me;


CREATE TABLE IF NOT EXISTS users(
    email VARCHAR(32) PRIMARY KEY NOT NULL,    
    name VARCHAR(32) NOT NULL,
    iban VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS wallet(
    email VARCHAR(32) PRIMARY KEY,
    wallet_eu FLOAT(10) NOT NULL, 
    wallet_usd FLOAT(10) NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email)  
);

CREATE TABLE IF NOT EXISTS transactions(
    code SERIAL PRIMARY KEY,
    email VARCHAR(32) NOT NULL,    
    name VARCHAR(32) NOT NULL,
    eu_amount FLOAT(10) NOT NULL, 
    usd_amount FLOAT (10) NOT NULL,
    starting_currency VARCHAR(5) NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email)  
);