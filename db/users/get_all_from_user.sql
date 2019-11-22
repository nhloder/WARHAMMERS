select * 
from users u
join products p on p.seller_id = u.user_id
join hash h on u.hash_id = h.hash_id
where user_id = $1