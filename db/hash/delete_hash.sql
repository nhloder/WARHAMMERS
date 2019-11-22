delete from hash h
using users u
where  u.hash_id = h.hash_id and u.user_id = ($1) 