import Error from "next/error";

function Success() {
  const redirect = () => {
    window.location = "/";
  };
  setTimeout(redirect, 3000);
  return (
    <>
      <Error
        statusCode="SUCCESS CHECK DISCORD"
        title="Redirecting in 3 seconds"
      ></Error>
    </>
  );
}

export default Success;
