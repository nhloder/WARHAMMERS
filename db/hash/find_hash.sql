select * from users u
join hash h on u.user_id = h.user_id
WHERE username = ${u.username} OR email = ${u.email};