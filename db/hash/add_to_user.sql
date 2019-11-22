INSERT INTO users(username, email, about, profile_pic, is_admin, hash_id)
VALUES
(${username}, ${email}, ${about}, ${profile_pic}, ${is_admin}, ${hash_id})
RETURNING *;