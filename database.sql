create TABLE User(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255),
    email VARCHAR(255),
)

create TABLE role(
    id SERIAL PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES User(id),
)