import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(cartRemove);

async function cartRemove(req, res) {
  if (!req.session.cart) req.session.cart = [];
  let p = Number(req.query.product);
  if (isNaN(p)) return res.status(400).send("BAD REQUEST");
  let index = req.session.cart.findIndex((value) => value.id === p);
  if (index === -1) return res.status(404).send("DOES NOT EXIST");
  req.session.cart.splice(index, 1);
  await req.session.save();
  res.redirect("/cart");
}
