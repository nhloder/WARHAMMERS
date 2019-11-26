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
    db.products.delete_user_products(+req.params.id)
    .then(db.comments.delete_user_comments(+req.params.id)
    .then(db.cart.clear_cart(+req.params.id)
    .then(db.hash.delete_hash(+req.params.id)
    .then(db.users.delete_user(+req.params.id)))))
    
    .then(
      res.status(200).send({message:'sorry to see you go'})
    ).catch(err => {
      res
        .status(500)
        .send({ errorMessage: "we done goofed, try again later" });
      console.log(err);
    });
  },
  getUserInfo(req,res){
    if(req.session.user){
      return res.status(200).send(req.session.user)
    }
    else (res.status(412).send({message:'please login first'}))
  },
  
}
