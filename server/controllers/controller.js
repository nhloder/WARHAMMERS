module.exports = {
  getUser(req, res) {
    const db = req.app.get("db");
    db.users
      .get_user(+req.params.id)
      .then(result => {
        res.status(200).send(result);
      })
      .catch(err => {
        res
          .status(500)
          .send({ errorMessage: "we done goofed, try again later" });
        console.log(err);
      });
  },
  getAllUsers(req, res) {
    const db = req.app.get("db");
    db.users
      .get_all_users()
      .then(result => {
        res.status(200).send(result);
      })
      .catch(err => {
        res
          .status(500)
          .send({ errorMessage: "we done goofed, try again later" });
        console.log(err);
      });
  },
  editUser(req, res) {
    const db = req.app.get("db");
    const user_id = +req.params.id;
    const { username, email, about, profile_pic, hash_id} = req.body;

    db.edit
      .edit_user({ username, email, about, profile_pic, hash_id, user_id })
      .then(result => {
        // console.log(+req.params.id);
        res.status(200).send(result);
      })
      .catch(err => {
        res
          .status(500)
          .send({ errorMessage: "we done goofed, try again later" });
        console.log(err);
      });
  },

  deleteUser(req, res) {
    const db = req.app.get("db");
    // db.users.get_all_from_user(+req.params.id)
    db.users
      .delete_user_products(+req.params.id)
      // .then(() => {
      //   db.hash.delete_hash(+req.params.id);
      //   console.log("IT WILL BE DONE MY LORD");
      // })80
      .then(() => {
        db.users.delete_user(+req.params.id).then(() => {
          res.status(200).send({ message: "sorry to see you go" });
          
        });
      })
      .catch(err => {
        res
          .status(500)
          .send({ errorMessage: "we done goofed, try again later" });
        console.log(err);
      });
  }
};
