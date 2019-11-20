module.exports = {
  getAll(req, res) {
    const db = req.app.get("db");
    db.get_all()
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
    db.get_one(+req.params.id)
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
