module.exports = {
  getUserCart(req,res){
    const db = req.app.get("db");
    db.cart.display_cart(+req.params.id)
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
  intoCart(req,res){
    const db = req.app.get('db')
    const {customer_id, item_id} = req.body
    db.cart.add_to_cart({
      customer_id : customer_id,
      item_id : item_id
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
  },
}