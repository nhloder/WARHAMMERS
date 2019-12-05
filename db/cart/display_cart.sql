select c.*, u.profile_pic, u.username, p.*
from cart c
join products p on c.item_id = p.product_id
join users u on c.customer_id = u.user_id
WHERE u.user_id = $1;