select
  *
from products p
join users u on p.seller_id = u.user_id
WHERE
  u.user_id = $1;