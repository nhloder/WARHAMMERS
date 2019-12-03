UPDATE users
SET username = ${username},
about = ${about},
profile_pic = ${profile_pic}
where user_id = ${user_id};