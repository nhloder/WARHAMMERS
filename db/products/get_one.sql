-- select * from products
-- where product_id = $1;

select p.*, u.profile_pic, u.username
from users u
join products p on p.seller_id = u.user_id
where p.product_id = $1;