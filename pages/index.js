import { getSession } from "next-auth/react";
import { signOut, signIn } from "next-auth/react";
import {
  Avatar,
  Dropdown,
  Text,
  Button,
  Link,
  Image,
  Pagination,
} from "@nextui-org/react";
import { Buy, User } from "react-iconly";
function Products({ products, session, bal, pages, page }) {
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
        <h1 style={{ marginBottom: 25 }}>PRODUCTS</h1>
        <div className="reflow-product-list ref-cards">
          <div className="ref-products">
            {products.map((product) => {
              return (
                <Link
                  className="ref-product"
                  href={"/product?id=" + product.id}
                  key={product}
                >
                  <Image
                    className="ref-image"
                    src={product.imageLink}
                    loading="lazy"
                  />
                  <div className="ref-product-data">
                    <div className="ref-product-info">
                      <h5 className="ref-name">{product.name}</h5>
                      <p className="ref-excerpt">{product.description}</p>
                    </div>
                    <p className="ref-price">
                      Price: {product.price.toLocaleString()} {bal.currency.rep}{" "}
                      | Author ID: {product.author.id} | Stock {product.stock}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <footer>
        <div className="text-center">
          <Pagination
            total={pages}
            initialPage={page}
            css={{
              alignContent: "center",
            }}
            onChange={(pg) => {
              window.location = "/?page=" + pg;
            }}
          />
        </div>
      </footer>
    </>
  );
}

export async function getServerSideProps(context) {
  // Fetch data from external API
  const res = await fetch(`http://localhost:3001/products`);
  let products = await res.json();
  const session = await getSession(context);
  let bal;
  if (session) {
    bal = await fetch(`http://localhost:3001/balance/${session.user.id}`);
    bal = await bal.json();
  } else {
    let currency = await fetch(`http://localhost:3001/currency`);
    currency = await currency.json();
    bal = { currency: currency };
  }
  products = products.filter((x) => x.stock >= 1);
  if (session)
    products = products.filter((x) => x.author.id != session.user.id);
  products = products.map((product) => {
    if (product.description > 32)
      product.description = product.description.slice(0, 32) + "...";
    return product;
  });
  const chunkSize = 15;
  let chunks = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  let chunk = chunks[context.query.page - 1 || 0] || [];
  let pages = chunks.length === 0 ? 1 : chunks.length;
  let page = Number(context.query.page) || 1;

  return { props: { products: chunk, session, bal, pages, page } };
}

export default Products;
