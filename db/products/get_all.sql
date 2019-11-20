select u.username, u.profile_pic, p.*
from users u 
JOIN products p on u.user_id = p.seller_id