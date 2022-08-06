import { withSessionRoute } from "../../../lib/withSession";

export default withSessionRoute(cart);

async function cart(req, res) {
  res.send(req.session.cart || []);
}
