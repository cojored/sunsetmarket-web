import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(cartAdd);

function typeCheck(obj) {
  if (typeof obj.id != "number") return false;
  if (typeof obj.name != "string") return false;
  if (typeof obj.description != "string") return false;
  if (typeof obj.price != "number") return false;
  if (typeof obj.quantity != "number") return false;
  if (typeof obj.stock != "number") return false;
  if (!/((?:https\:\/\/)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i.test(obj.imageLink))
    return false;
  return true;
}

async function cartAdd(req, res) {
  if (!req.session.cart) req.session.cart = [];
  let p = JSON.parse(req.query.product);
  let product = {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    imageLink: encodeURIComponent(p.imageLink),
    quantity: p.quantity,
    stock: p.stock,
  };
  if (!typeCheck(product)) return res.redirect("/error?e=" + "BAD REQUEST");
  let filter = req.session.cart.filter((i) => i.id === product.id);
  if (filter.length > 0) {
    let f = filter[0];
    f.quantity += product.quantity;
    let index = req.session.cart.findIndex((value) => value.id === f.id);
    req.session.cart[index] = f;
  } else {
    req.session.cart.push(product);
  }
  await req.session.save();
  res.redirect("/cart");
}
