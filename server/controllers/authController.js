const bcrypt = require("bcryptjs");

module.exports = {
  register: async (req, res) => {
    const db = req.app.get("db");
    const {
      email,
      password,
      username,
      about,
      profile_pic,
      is_admin
    } = req.body;

    const result = await db.hash.find_user(email);
    if (result[0])
      return res.status(409).send({ message: "E-mail already in use." });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const hashId = await db.hash.add_hash(hash);
    const { hash_id } = hashId[0];
    const createdUser = await db.hash.add_to_user({
      email,
      hash_id,
      username,
      about,
      profile_pic,
      is_admin
    });

    req.session.user = {
      id: createdUser[0].user_id,
      email: createdUser[0].email
    };

    res.status(200).send({ message: "Logged in", userData: req.session.user });
  },
  login: async (req, res) => {
    const db = req.app.get("db");
    const { email, password } = req.body;

    const user = await db.hash.find_hash(email);
    if (!user[0]) return res.status(404).send({ message: "User not found" });

    const result = bcrypt.compareSync(password, user[0].hash);
    if (result === true) {
      req.session.user = {
        id: user[0].user_id,
        email: user[0].email,
        profile_pic: user[0].profile_pic,
        username: user[0].username,
        about: user[0].about
      };
      return res
        .status(200)
        .send({ message: "Logged in", userData: req.session.user });
    } else {
      res.status(404).send({ message: "Password incorrect" });
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.status(200).send({ message: "Logged out" });
  },
  authenticate(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.status(200).send(`no`);
    }
  },
  // thatUser(req,res,next){
  //   const db = req.app.get("db");
  //   db.products.get_one(+req.params.id)
  //   if (+req.session.user.id === products.seller_id){
  //     next()
  //   }
  //   //what you need to do here is make it so that when a user trys to delete one
  // },
  adminsOnly: (req, res, next) => {
    if (!req.session.user.isAdmin) {
      return res.status(403).send("You are not an admin");
    }
    next();
  }
};
