require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const ctrl = require("./controllers/controller.js");
const cartCtrl = require("./controllers/cartController.js");
const authCtrl = require("./controllers/authController.js");
const {
  SERVER_PORT,
  CONNECTION_STRING,
  SESSION_SECRET,
  S3_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY
} = process.env;

const app = express();
const aws = require('aws-sdk')


// TOP LEVEL MIDDLEWARE \\
app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("TAC-COM ONLINE");
  app.listen(SERVER_PORT, () => console.log(`${SERVER_PORT} STRIKES OF FIRE`));
});

// ENDPOINTS \\
app.get("/api/allProducts", ctrl.getAll);
app.get('/api/product/:id', ctrl.getOne);
app.get('/api/userProducts/:id', ctrl.userProducts);
app.get('/api/comments/:id', ctrl.getComments)
app.get('/api/user/:id', ctrl.getUser)
app.get('/api/allUsers', ctrl.getAllUsers)
app.get('/api/cart/:id', cartCtrl.getUserCart)
app.post('/api/cart', cartCtrl.intoCart)


// AMAZON S3 \\

// app.get("/api/signs3", (req, res) => {
//   aws.config = {
//     region: "us-west-1",
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY
//   };

//   const s3 = new aws.S3();
//   const fileName = req.query["file-name"];
//   const fileType = req.query["file-type"];
//   const s3Params = {
//     Bucket: S3_BUCKET,
//     Key: fileName,
//     Expires: 60,
//     ContentType: fileType,
//     ACL: "public-read"
//   };

//   s3.getSignedUrl("putObject", s3Params, (err, data) => {
//     if (err) {
//       console.log(err);
//       return res.end();
//     }
//     const returnData = {
//       signedRequest: data,
//       url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
//     };

//     return res.send(returnData);
//   });
// });
