import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(cartRemove);

async function cartRemove(req, res) {
  if (!req.session.cart) req.session.cart = [];
  let p = Number(req.query.product);
  if (isNaN(p)) res.redirect("/error?e=" + "BAD REQUEST");
  let index = req.session.cart.findIndex((value) => value.id === p);
  if (index === -1) return res.redirect("/error?e=" + "DOES NOT EXIST");
  req.session.cart.splice(index, 1);
  await req.session.save();
  res.redirect("/cart");
}
