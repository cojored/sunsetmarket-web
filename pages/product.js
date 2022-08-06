import { getSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  Avatar,
  Dropdown,
  Text,
  Button,
  Link,
  Image,
  Modal,
  User,
} from "@nextui-org/react";
import { Buy } from "react-iconly";
import { withSessionSsr } from "../lib/withSession";

function Product({ product, session, bal, cart }) {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(1);
  const [silentCount] = useState(
    cart.findIndex((x) => x.id === product.id) != -1
      ? cart.find((x) => x.id === product.id).quantity
      : 0
  );
  product["quantity"] = count;

  const addToCart = () => {
    window.location = "/api/cart/add?product=" + JSON.stringify(product);
  };

  const incrementCounter = () => {
    if (silentCount + count + 1 > product.stock) {
      setText("You can't buy more than " + product.stock + ".");
      setVisible(true);
    } else {
      setCount(count + 1);
      product["quantity"] = Number(count + 1);
    }
  };
  const decrementCounter = () => {
    if (count <= 1) {
      setText("You can't buy less than 1.");
      setVisible(true);
    } else {
      setCount(count - 1);
      product["quantity"] = Number(count - 1);
    }
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
          <div className="reflow-product">
            <div className="ref-media">
              <div className="ref-preview">
                <Image
                  className="ref-image active"
                  src={product.imageLink}
                  data-reflow-preview-type="image"
                />
              </div>
            </div>
            <div className="ref-product-data">
              <h2 className="ref-name">{product.name}</h2>
              <strong className="ref-price">
                {product.price} {bal.currency.rep}
              </strong>
              <span>
                <div className="ref-product-controls">
                  <span>
                    <div className="ref-quantity-widget">
                      <div className="ref-decrease">
                        <span onClick={() => decrementCounter()} />
                      </div>
                      <input
                        type="text"
                        id="count"
                        accept="number"
                        value={count}
                        onChange={(event) => {
                          if (isNaN(event.target.value)) return;
                          if (
                            silentCount + event.target.value >
                            product.stock
                          ) {
                            setText(
                              "You can't buy more than " + product.stock + "."
                            );
                            setVisible(true);
                          } else {
                            setCount(Number(event.target.value));
                          }
                        }}
                      />
                      <div className="ref-increase">
                        <span onClick={() => incrementCounter()} />
                      </div>
                    </div>
                  </span>
                  <Link
                    id="addtocart"
                    className="ref-button"
                    onClick={addToCart}
                  >
                    Add to Cart
                  </Link>
                </div>
              </span>
              <div className="ref-description">{product.description}</div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        aria-labelledby="modal-title"
        open={visible}
        blur
        onClose={() => setVisible(false)}
      >
        <Modal.Header>
          <Text id="modal-title" style={{ fontWeight: "bold" }} size={25}>
            Sunset Market
          </Text>
        </Modal.Header>
        <Modal.Body justify="center">
          <Text size="15">{text}</Text>
        </Modal.Body>
        <Modal.Footer justify="center">
          <Button flat color="error" onClick={() => setVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export const getServerSideProps = withSessionSsr(gssp);

async function gssp(context) {
  const res = await fetch(`http://localhost:3001/product/${context.query.id}`);
  let product = await res.json();
  if (product === undefined) product = null;
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  let bal = await fetch(`http://localhost:3001/balance/${session.user.id}`);
  bal = await bal.json();
  let cart = context.req.session.cart || [];
  return { props: { product, session, bal, cart } };
}
export default Product;
