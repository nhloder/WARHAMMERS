CREATE TABLE users(
user_id serial PRIMARY KEY,
username VARCHAR(25),
email VARCHAR,
about TEXT,
profile_pic TEXT,
is_admin BOOLEAN
);

CREATE TABLE hash(
hash_id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(user_id),
hash TEXT
);

CREATE TABLE products(
product_id SERIAL PRIMARY KEY,
item_name VARCHAR(35),
price INT,
description TEXT,
img TEXT,
weight INT,
length int,
material VARCHAR(50),
seller_id int REFERENCES users(user_id)
);

CREATE TABLE comments(
comment_id SERIAL PRIMARY KEY,
comment_location_id int REFERENCES products(product_id),
commenter_id int REFERENCES users(user_id),
content VARCHAR
);

CREATE TABLE cart(
cart_id SERIAL PRIMARY KEY,
customer_id int REFERENCES users(user_id),
item_id int REFERENCES products(product_id)
);

-- DUMMY DATA

INSERT INTO users(username, email, about, profile_pic, is_admin)
VALUES
('nhloder', 'nhloder@gmail.com', 'I am the creator of this site, and uh, for right now, it sucks.', 'https://www.bibleblender.com/wp-content/uploads/2019/06/god-creating-the-milky-way-universe-550x413.jpg', TRUE),
('Grug', 'grug@grug.grug', 'ME GRUG.', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwow.zamimg.com%2Fuploads%2Fscreenshots%2Fnormal%2F414887-infested-orc.jpg&f=1&nofb=1', false),
('Grog', 'grog@grug.grug', 'I am Grog the destroyer. I have way to many War-hammers am i need to start selling some', 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.rpgfan.com%2Fpics%2FOf_Orcs_and_Men%2Fss-032.jpg&f=1&nofb=1', false);

INSERT INTO products(item_name, price, description, img, weight, length, material, seller_id)
VALUES
('Boop', 55, 'Gary here will come by and give youre enimeies a lil boop on the head','https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fi.ytimg.com%2Fvi%2FqhknaG9ifbs%2Fmaxresdefault.jpg&f=1&nofb=1', 250, 45, 'Wood, Steel, and Gary', 1);
