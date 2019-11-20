INSERT INTO products(item_name, price, description, img, weight, length, material, seller_id)
VALUES
(${item_name}, ${price}, ${description}, ${img}, ${weight}, ${length}, ${material}, ${seller_id});
select * from products;