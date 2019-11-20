UPDATE products
SET item_name = ${item_name},
price = ${price},
description = ${description},
img = ${img},
weight = ${weight},
length = ${length},
material = ${material}
WHERE product_id = ${product_id};