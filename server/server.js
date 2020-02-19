const path = require('path'); 
require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const userCtrl = require("./controllers/userController.js");
const cartCtrl = require("./controllers/cartController.js");
const authCtrl = require("./controllers/authController.js");
const comCtrl = require("./controllers/commentController.js");
const pdctCtrl = require("./controllers/productController.js");
const stripeCtrl = require("./controllers/stripeController.js");
const aws = require("aws-sdk");

const {
  SERVER_PORT,
  CONNECTION_STRING,
  SESSION_SECRET,
  S3_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;
// const stripe = new stripeLoader(STRIPE_SECRET);

const app = express();
// HOSTING STUFF \\
app.use( express.static( `${__dirname}/../build` ) );

// TOP LEVEL MIDDLEWARE \\
app.use(express.json());

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("TAC-COM ONLINE");
  app.listen(SERVER_PORT, () => console.log(`${SERVER_PORT} STRIKES OF FIRE`));
});

// ENDPOINTS \\

//Users
app.get("/api/user/:id", userCtrl.getUser);
app.get("/api/users", userCtrl.getAllUsers);
app.get("/api/userInfo", userCtrl.getUserInfo);
app.put("/api/user/:id", authCtrl.authenticate, userCtrl.editUser);
app.delete("/api/user/:id", userCtrl.deleteUser);

// Products
app.get("/api/products", pdctCtrl.getAll);
app.get("/api/product/:id", pdctCtrl.getOne);
app.get("/api/userProducts/:id", pdctCtrl.userProducts);
app.get("/api/myProducts", authCtrl.authenticate, pdctCtrl.myProducts);
app.post("/api/product", authCtrl.authenticate, pdctCtrl.addProduct);
app.put("/api/product/:id", pdctCtrl.updateProduct);
app.delete("/api/product/:id", authCtrl.authenticate, pdctCtrl.deleteProduct);

// Cart
app.get("/api/cart/:id", cartCtrl.getUserCart);
app.post("/api/cart", authCtrl.authenticate, cartCtrl.intoCart);
app.delete("/api/cart/:id", authCtrl.authenticate, cartCtrl.remove);
app.delete("/api/wholeCart/:id", authCtrl.authenticate, cartCtrl.clear);

// Comments
app.get("/api/comments/:id", comCtrl.getComments);
app.post("/api/comment", authCtrl.authenticate, comCtrl.addComment);
app.delete("/api/comment/:id", authCtrl.authenticate, comCtrl.deleteComment);

//Auth
app.post("/api/user", authCtrl.register);
app.post("/api/login", authCtrl.login);
app.delete("/api/logout", authCtrl.logout);

// AMAZON S3 \\


app.get("/sign-s3", (req, res) => {
  aws.config = {
    region: "us-west-1",
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  };

  const s3 = new aws.S3();
  const fileName = req.query["file-name"];
  const fileType = req.query["file-type"];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 365 * 2,
    ContentType: fileType,
    ACL: "public-read"
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };

    return res.send(returnData);
  });
});


 // STRIPE \\


 app.get("/", (req, res) => {
  res.send("Add your Stripe Secret Key to the .require('stripe') statement!");
});

app.post("/checkout/:id", authCtrl.authenticate, stripeCtrl.stripe, cartCtrl.clear);