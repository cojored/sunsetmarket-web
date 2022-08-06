import { withSessionSsr } from "../lib/withSession";
import { Avatar, Dropdown, Text, Button, Link, Image, User } from "@nextui-org/react";
import { Buy } from "react-iconly";
import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";

function Cart({ products, session, bal }) {
  let total = 0;
  products.map(function (i) {
    total += i.quantity * i.price;
  });

  const checkout = () => {
    window.location = "/api/cart/checkout";
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
      />
      <title>Purchase</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootswatch@5.1.3/dist/lux/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.reflowhq.com/v1/toolkit.min.css"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600&display=swap"
      />
      <link rel="stylesheet" href="/assets/css/styles.css" />
      <nav
        className="navbar navbar-light navbar-expand-md"
        style={{ paddingLeft: 0, marginRight: 50, marginLeft: 50 }}
      >
        <div className="container-fluid">
          <Link
            className="navbar-brand"
            href="/"
            style={{ fontWeight: "bold", fontSize: 23 }}
          >
            Sunset Market
          </Link>
          <button
            data-bs-toggle="collapse"
            className="navbar-toggler"
            data-bs-target="#navcol-1"
          >
            <span className="visually-hidden">Toggle navigation</span>
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navcol-1">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" href="/">
                  PRODUCTS
                </Link>
              </li>
              <li className="nav-item" />
              <li className="nav-item" />
            </ul>
            <Link href="/cart" className="ms-auto">
              <Button
                auto
                color="black"
                icon={<Buy set="bold" primaryColor="black" />}
              >
                View Cart
              </Button>
            </Link>
            {session ? (
              <>
                <Dropdown placement="bottom-left">
                  <Dropdown.Trigger>
                    <Avatar
                      src={session.user.image}
                      size="lg"
                      style={{
                        paddingRight: 0,
                        marginRight: -30,
                        marginLeft: 20,
                      }}
                      pointer={true}
                      onHover
                    />
                  </Dropdown.Trigger>
                  <Dropdown.Menu
                    color="secondary"
                    aria-label="Avatar Actions"
                    css={{ $$dropdownMenuWidth: "350px" }}
                    onAction={(key) => {
                      if (key === "logout") {
                        signOut({ callbackUrl: "/" });
                      }
                    }}
                  >
                    <Dropdown.Item key="profile" css={{ height: "$18" }}>
                      <Text b color="inherit" css={{ d: "flex" }}>
                        Signed in as:
                      </Text>
                      <Text b color="inherit" css={{ d: "flex" }}>
                        {session.user.name} ({session.user.email})
                      </Text>
                    </Dropdown.Item>
                    <Dropdown.Item key="balance" withDivider>
                      Balance: {bal.balance.toLocaleString()} {bal.currency.rep}
                    </Dropdown.Item>
                    <Dropdown.Item key="logout" color="error" withDivider>
                      Log Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  style={{
                    marginRight: -30,
                    marginLeft: 20,
                  }}
                  icon={<User set="bold" primaryColor="black" />}
                  auto
                  onClick={() => signIn("discord")}
                  color="black"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="container">
        <div>
          <div className="reflow-shopping-cart" style={{ display: "block" }}>
            <div className="ref-loading-overlay" />
            <div className="ref-message" style={{ display: "none" }} />
            <div className="ref-cart" style={{ display: "block" }}>
              <div className="ref-heading">Shopping Cart</div>
              <div className="ref-th">
                <div className="ref-product-col">Product</div>
                <div className="ref-price-col">Price</div>
                <div className="ref-quantity-col">Quantity</div>
                <div className="ref-total-col">Total</div>
              </div>
              <div className="ref-cart-table">
                {products.map((product) => {
                  return (
                    <div className="ref-product" key={product}>
                      <div className="ref-product-col">
                        <div className="ref-product-wrapper">
                          <Image
                            className="ref-product-photo"
                            src={product.imageLink}
                            alt="NAME"
                          />
                          <div className="ref-product-data">
                            <div className="ref-product-info">
                              <div className="ref-product-name">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ref-price-col">
                        <div className="ref-product-price">
                          {product.price} {bal.currency.rep}
                        </div>
                      </div>
                      <div className="ref-quantity-col">
                        <div className="ref-product-quantity">
                          <div className="ref-quantity-container">
                            <div className="ref-quantity-widget">
                              <div className="ref-decrease">
                                <span
                                  onClick={() =>
                                    (window.location = `/api/cart/quantity/add?product=${product.id}&amount=-1`)
                                  }
                                />
                              </div>
                              <input
                                type="text"
                                id="count"
                                value={product.quantity}
                                onChange={(event) => {
                                  window.location = `/api/cart/quantity/set?product=${product.id}&amount=${event.target.value}`;
                                }}
                              />
                              <div className="ref-increase">
                                <span
                                  onClick={() =>
                                    (window.location = `/api/cart/quantity/add?product=${product.id}&amount=1`)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="ref-product-qty-message" />
                          <div
                            className="ref-product-remove"
                            onClick={() =>
                              (window.location = `/api/cart/remove?product=${product.id}`)
                            }
                          >
                            Remove
                          </div>
                        </div>
                      </div>
                      <div className="ref-total-col">
                        <div className="ref-product-total">
                          <div className="ref-product-total-sum">
                            {(
                              product.price * product.quantity
                            ).toLocaleString()}{" "}
                            {bal.currency.rep}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="ref-footer">
                <div className="ref-links" />
                <div className="ref-totals">
                  <div className="ref-subtotal">
                    Total: {total.toLocaleString()} {bal.currency.rep}
                  </div>
                  <div className="ref-shipping-taxes">
                    You will be sent your items by the bot
                    <br /> on discord.
                  </div>
                  <div
                    className="ref-button ref-checkout-button"
                    onClick={checkout}
                  >
                    Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withSessionSsr(gssp);

async function gssp(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const products = context.req.session.cart || [];
  let bal = await fetch(`http://localhost:3001/balance/${session.user.id}`);
  bal = await bal.json();
  return {
    props: {
      products,
      session,
      bal,
    },
  };
}

export default Cart;
