module.exports = {
  addComment(req, res) {
    const db = req.app.get("db");
    const { comment_location_id, commenter_id, content } = req.body;
    db.comments
      .add_comment({
        comment_location_id: comment_location_id,
        commenter_id: commenter_id,
        content: content
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

  getComments(req, res) {
    const db = req.app.get("db");
    db.comments
      .get_comments(+req.params.id)
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

  deleteComment(req, res) {
    const db = req.app.get("db");
    db.comments
      .delete_comment(+req.params.id)
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
