select c.content, u.profile_pic, u.username, c.comment_id
from comments c
join products p on c.comment_location_id = p.product_id
join users u on c.commenter_id = u.user_id
WHERE c.comment_location_id = $1;