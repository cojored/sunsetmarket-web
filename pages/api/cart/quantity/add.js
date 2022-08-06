import { withSessionRoute } from "../../../../lib/withSession";

export default withSessionRoute(quantityAdd);

async function quantityAdd(req, res) {
  if (!req.session.cart) req.session.cart = [];
  let p = Number(req.query.product);
  let a = Number(req.query.amount);
  if (isNaN(p) || isNaN(a)) return res.status(400).send("BAD REQUEST");
  let index = req.session.cart.findIndex((value) => value.id === p);
  if (index === -1) return res.status(404).send("DOES NOT EXIST");
  if (req.session.cart[index].quantity + a > req.session.cart[index].stock)
    return res.status(400).send("NOT ENOUGH STOCK");
  req.session.cart[index].quantity += a;
  await req.session.save();
  res.redirect("/cart");
}
