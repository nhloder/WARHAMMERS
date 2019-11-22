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
  updateProduct(req, res) {
    
    const db = req.app.get("db");
    const product_id = +req.params.id
    const {
      item_name,
      price,
      description,
      img,
      weight,
      length,
      material,
    } = req.body;
    db.edit
    .edit_product({
      item_name,
      price,
      description,
      img,
      weight,
      length,
      material,
      product_id
    })
    .then(result => {
      console.log(+req.params.id);
        res.status(200).send(result);
      })
      .catch(err => {
        res
          .status(500)
          .send({ errorMessage: "we done goofed, try again later" });
        console.log(err);
      });
  },
  deleteProduct(req, res) {
    const db = req.app.get("db");
    db.products
      .delete_product(+req.params.id)
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
  addProduct(req, res) {
    const db = req.app.get("db");
    const {
      item_name,
      price,
      description,
      img,
      weight,
      length,
      material,
      seller_id
    } = req.body;
    db.products
      .add_product({
        item_name,
        price,
        description,
        img,
        weight,
        length,
        material,
        seller_id
      })
      .then(result => {
        res.status(200).send(result);
      })
      .catch(err => {
        res
          .status(500)
          .send({ errorMessage: "we done goofed, try again later" });
        console.log(err);
      });
  }
};
