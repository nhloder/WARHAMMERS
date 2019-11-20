INSERT INTO users(username, email, about, profile_pic, is_admin)
VALUES
(${username}, ${email}, ${about}, ${profile_pic}, ${is_admin})
select * from users;