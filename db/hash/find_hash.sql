select * from users u
join hash h on u.hash_id = h.hash_id
WHERE email = ($1);