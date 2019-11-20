select * from products
where product_id = ${product_id};

select profile_pic, username
from users u
join products p on p.seller_id = u.user_id
where p.product_id = ${product_id};

select c.content, u.profile_pic, u.username
from comments c
join products p on c.comment_location_id = p.product_id
join users u on c.commenter_id = u.user_id
WHERE p.product_id = ${product_id};