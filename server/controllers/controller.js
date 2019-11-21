module.exports = {
  getAll(req, res) {
    const db = req.app.get("db");
    db.products
      .get_all()
      .then(result => {
        res.status(200).send(result);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getOne(req, res) {
    // console.log(req.params);
    const db = req.app.get("db");
    db.products
      .get_one(+req.params.id)
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
  userProducts(req, res) {
    const db = req.app.get("db");
    db.users
      .get_user_products(+req.params.id)
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
  getComments(req,res) {
    const db = req.app.get('db')
    db.comments.get_comments(+req.params.id)
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
  getUser(req,res){
    const db = req.app.get('db')
    db.users.get_user(+req.params.id)
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
  getAllUsers(req,res){
    const db = req.app.get('db')
    db.users.get_all_users()
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
};
