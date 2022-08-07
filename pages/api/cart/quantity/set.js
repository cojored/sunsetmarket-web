import { withSessionRoute } from "../../../../lib/withSession";

export default withSessionRoute(quantitySet);

async function quantitySet(req, res) {
  if (!req.session.cart) req.session.cart = [];
  let p = Number(req.query.product);
  let a = Number(req.query.amount);
  if (isNaN(p) || isNaN(a)) return res.redirect("/error?e=" + "BAD REQUEST");
  let index = req.session.cart.findIndex((value) => value.id === p);
  if (index === -1) return res.redirect("/error?e=" + "DOES NOT EXIST");
  if (req.session.cart[index].quantity + a > req.session.cart[index].stock)
    return res.redirect("/error?e=" + "NOT ENOUGH STOCK");
  if (req.session.cart[index] < 1)
    return res.redirect(
      "/error?e=" + "YOU CANNOT HAVE A NEGATIVE OR ZERO QUANTITY"
    );
  req.session.cart[index].quantity = a;
  await req.session.save();
  res.redirect("/cart");
}
