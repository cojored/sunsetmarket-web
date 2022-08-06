import { withSessionRoute } from "../../../lib/withSession";
import { getSession } from "next-auth/react";
import fetch from "node-fetch";

export default withSessionRoute(cartRemove);

async function cartRemove(req, res) {
  const session = await getSession({ req });
  fetch(
    `http://localhost:3001/checkout?cart=${JSON.stringify(
      req.session.cart
    )}&user=${JSON.stringify(session.user)}`
  ).then(async (r) => {
    if (r.status === 200) {
      req.session.cart = [];
      await req.session.save();
      res.redirect("/success");
    } else {
      let text = await r.text();
      res.redirect("/error?e=" + text);
    }
  });
}
