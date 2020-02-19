const { STRIPE_SECRET } = process.env;
const stripe = require("stripe")(STRIPE_SECRET);
const uuid = require('uuid/v4')

module.exports = {
  stripe: async (req, res, next) => {
    // console.log("Request:", req.body);

    let error;
    let status;
    try {
      const { product, token } = req.body;
      // console.log(req.body.product);

      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      });

      const idempotency_key = uuid();

      const charge = await stripe.charges.create(
        {
          amount: product * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchased the ${product.name}`
        },
        {
          idempotency_key
        }
      );
      // console.log("Charge:", { charge });
      status = "success";
    } catch (error) {
      console.error("Error:", error);
      status = "failure";
    }

    res.json({ error, status });
    next()
  }
};
